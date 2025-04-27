import vendor from "../models/vendor.model.js"; // Adjust the path as needed
import user from "../models/user.model.js";
import event from "../models/event.model.js";
import ollamaModel from "../models/ollamamodel.model.js";
import chat from '../models/chat.model.js';
import mongoose from "mongoose";
import { flattenObject } from "../utils/objectUtils.js";
import pkg from 'lodash';
const { flatten, uniq } = pkg;

// Dynamic Model Middleware
const getDynamicModel = (collectionName) => {
    const schema = new mongoose.Schema({}, { strict: false, versionKey: false });
    return mongoose.models[collectionName] ||
        mongoose.model(collectionName, schema, collectionName);
};

// Admin Controller
let collectionsCache = null;
let lastCacheTime = 0;

export const getCollection = async (req, res) => {
    try {
        if (Date.now() - lastCacheTime < 300000 && collectionsCache) {
            return res.status(200).json({
                success: true,
                data: collectionsCache
            });
        }

        const collections = await mongoose.connection.db.listCollections().toArray();
        collectionsCache = collections.map(c => c.name);
        // Return proper structure
        res.status(200).json({
            success: true,
            data: collectionsCache  // Changed from 'collections' to 'data'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error getting collections",
            error: error.message,
        });
    }
}

// get collections data
const { Types: { ObjectId } } = mongoose;

const processNestedObject = (obj) => {
    const processed = {};
    for (const [key, value] of Object.entries(obj)) {
        processed[key] = processValueDeep(value);
    }
    return processed;
};

const processValueDeep = (value) => {
    if (Array.isArray(value)) {
        return value.map(processValueDeep);
    }
    if (value && typeof value === 'object') {
        return processNestedObject(value);
    }
    return convertValue(value);
};

// Utility Functions
const processFilterOptions = (docs) => {
    const filterOptions = {};

    const isBufferField = (key, value) => {
        const isBufferKey = key.toLowerCase() === 'buffer';
        const isBufferValue = value instanceof Buffer || value?.type === 'Buffer';
        return isBufferKey || isBufferValue;
    };

    const processValue = (value, parentNode, key) => {
        if (value === null || value === undefined) return;
        if (isBufferField(key, value)) return;
        if (['_id', '__v', 'createdAt', 'updatedAt'].includes(key)) return;

        if (typeof value === 'object') {
            // Process nested objects
            if (!parentNode[key]) parentNode[key] = {};
            traverseObject(value, parentNode[key]);
        } else {
            // Store primitive values
            if (!parentNode[key]) parentNode[key] = new Set();
            parentNode[key].add(value.toString());
        }
    };

    const traverseObject = (obj, currentNode = filterOptions) => {
        Object.entries(obj).forEach(([key, value]) => {
            if (isBufferField(key, value)) return;

            if (Array.isArray(value)) {
                value.forEach(item => {
                    if (typeof item === 'object') {
                        if (!currentNode[key]) currentNode[key] = {};
                        traverseObject(item, currentNode[key]);
                    } else {
                        processValue(item, currentNode, key);
                    }
                });
            } else {
                processValue(value, currentNode, key);
            }
        });
    };

    docs.forEach(doc => {
        traverseObject(doc);
    });

    // Convert Sets to arrays and clean empty objects
    const cleanOptions = (node) => {
        if (node instanceof Set) return Array.from(node);
        if (typeof node === 'object') {
            const cleaned = {};
            Object.entries(node).forEach(([key, val]) => {
                const cleanedVal = cleanOptions(val);
                if (cleanedVal !== undefined) cleaned[key] = cleanedVal;
            });
            return Object.keys(cleaned).length ? cleaned : undefined;
        }
        return node;
    };

    return cleanOptions(filterOptions);
};

const processFilterObject = (filterObj) => {
    const processed = {};

    for (const [key, value] of Object.entries(filterObj)) {
        if (Array.isArray(value)) {
            // Handle array filters
            if (value.length === 0) continue;

            if (typeof value[0] === 'object') {
                // Array of objects - use $elemMatch
                processed[key] = {
                    $elemMatch: processFilterObject(value[0])
                };
            } else {
                // Array of primitives - use $in with converted values
                processed[key] = {
                    $in: value.map(convertValue)
                };
            }
        } else if (typeof value === 'object' && value !== null) {
            // Handle nested objects recursively
            processed[key] = processFilterObject(value);
        } else {
            // Handle primitive values
            processed[key] = convertValue(value);
        }
    }

    return processed;
};

// Universal type converter
const convertValue = (value) => {
    if (typeof value === 'string') {
        // Convert ObjectIDs
        if (ObjectId.isValid(value) && new ObjectId(value).toString() === value) {
            return new ObjectId(value);
        }
        // Convert ISO Dates
        if (!isNaN(Date.parse(value))) {
            return new Date(value);
        }
        // Convert Booleans
        if (value.toLowerCase() === 'true') return true;
        if (value.toLowerCase() === 'false') return false;
        // Convert Numbers
        if (!isNaN(value) && value.trim() !== '') {
            return parseFloat(value);
        }
    }
    return value;
};

// Recursive query builder
const buildNestedQuery = (filterObj, path = '') => {
    const query = {};

    Object.entries(filterObj).forEach(([key, value]) => {
        const currentPath = path ? `${path}.${key}` : key;

        if (Array.isArray(value)) {
            if (value.length === 0) return;

            if (typeof value[0] === 'object') {
                query[currentPath] = {
                    $elemMatch: buildNestedQuery(value[0])
                };
            } else {
                query[currentPath] = {
                    $in: value.map(convertValue)
                };
            }
        } else if (typeof value === 'object') {
            Object.assign(query, buildNestedQuery(value, currentPath));
        } else {
            query[currentPath] = convertValue(value);
        }
    });

    return query;
};

// Updated buildQuery function
const buildQuery = (filters) => {
    return buildNestedQuery(filters);
};

export const getCollectionData = async (req, res) => {
    try {
        const { collectionName } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const { filters = {}, includeFilterOptions = true } = req.body;

        // Validate collection exists
        if (!collectionsCache || !collectionsCache.includes(collectionName)) {
            return res.status(404).json({
                success: false,
                message: 'Collection not found'
            });
        }

        const Model = getDynamicModel(collectionName);
        const skip = (Math.max(1, page) - 1) * limit;

        // Build query with proper nesting and type conversion
        const query = buildQuery(filters);

        // Get paginated data
        const [data, total] = await Promise.all([
            Model.find(query)
                .skip(skip)
                .limit(Number(limit))
                .lean(),
            Model.countDocuments(query)
        ]);

        // Prepare response
        const response = {
            success: true,
            data,
            pagination: {
                totalItems: total,
                totalPages: Math.ceil(total / limit),
                currentPage: Number(page),
                limit: Number(limit)
            }
        };

        // Process filter options with deep flattening
        if (includeFilterOptions) {
            const sampleDocs = await Model.find().limit(1000).lean();
            response.filterOptions = processFilterOptions(sampleDocs);
        }

        res.status(200).json(response);

    } catch (error) {
        console.error('Query error:', error);
        res.status(500).json({
            success: false,
            message: 'Database operation failed',
            error: error.message
        });
    }
}

// Update Controller
export const updateCollectionItem = async (req, res) => {
    try {
        const { collectionName } = req.params;
        const { updateData, id } = req.body;

        // Validate input
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid document ID'
            });
        }

        if (!updateData || Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No update data provided'
            });
        }

        const Model = getDynamicModel(collectionName);

        const updatedItem = await Model.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).lean();

        if (!updatedItem) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }

        res.status(200).json({
            success: true,
            data: updatedItem
        });

    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({
            success: false,
            message: 'Update operation failed',
            error: error.message
        });
    }
}

// Delete Controller
export const deleteCollectionItem = async (req, res) => {
    try {
        const { collectionName } = req.params;
        const { id } = req.body;

        // Validate ID
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid document ID'
            });
        }

        const Model = getDynamicModel(collectionName);
        const deletedItem = await Model.findByIdAndDelete(id).lean();

        if (!deletedItem) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Document deleted successfully',
            data: deletedItem
        });

    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({
            success: false,
            message: 'Delete operation failed',
            error: error.message
        });
    }
}
