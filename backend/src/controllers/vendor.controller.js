import Vendor from "../models/vendor.model.js"; // Adjust the path as needed
import User from "../models/user.model.js";
import Event from "../models/event.model.js";
import mongoose from "mongoose";
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import orderModel from "../models/order.model.js";


// Helper function to delete old image
const deleteOldImage = (imagePath) => {
    if (imagePath) {
        try {
            // Strip URL prefix
            const cleanPath = imagePath.replace(/^https?:\/\/[^\/]+/, '');

            // Normalize and ensure no directory traversal
            const safePath = path.normalize(cleanPath).replace(/^(\.\.(\/|\\|$))+/, '');

            // Remove leading slash
            const relativePath = safePath.startsWith('/') ? safePath.slice(1) : safePath;

            // Final path
            const fullPath = path.join(process.cwd(), 'public', relativePath);

            console.log('Attempting to delete image at:', fullPath);

            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
                console.log('Successfully deleted image:', fullPath);
            } else {
                console.log('Image file not found:', fullPath);
            }
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    }
};

// **Create a new vendor**
export const createVendor = async (req, res) => {
    try {
        const { user } = req; // The current authenticated user
        const vendorData = req.body;


        const currentUser = await User.findOne(user._id);

        const vendor = await Vendor.create({
            owner: user._id,
            ShopName: vendorData.formData.ShopName,
            ShopPhone: vendorData.formData.ShopPhone,
            ShopEmail: vendorData.formData.ShopEmail,
            ShopDescription: vendorData.formData.ShopDescription,
            ShopAddress: vendorData.formData.ShopAddress,
            ShopCategory: vendorData.shopCategory.charAt(0).toUpperCase() + vendorData.shopCategory.slice(1),
            ShopLocation: vendorData.formData.ShopLocation,
            ShopLogo: req.file ? `/uploads/vendors/${req.file.filename}` : null,
        });


        currentUser.vendorOwnerShip.push(vendor._id);

        await currentUser.save();

        res.status(201).json({
            success: true,
            message: "Vendor created successfully",
            data: vendor,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error creating vendor",
            error: error.message,
        });
    }
};

// **Get all vendors**
export const getAllVendors = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let filter = {}; // Default: Fetch all vendors

        if (req.query.category) {
            filter.ShopCategory = req.query.category; // Apply category filter
        }

        // Fetch vendors without `Products` field
        const vendors = await Vendor.find(filter)
            .select("-Products") // 👈 Excludes the `Products` field
            .skip(skip)
            .limit(limit);

        // Count total vendors based on filter
        const totalVendors = await Vendor.countDocuments(filter);

        res.status(200).json({
            success: true,
            page,
            totalPages: Math.ceil(totalVendors / limit),
            totalVendors,
            data: vendors,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching vendors",
            error: error.message,
        });
    }
};

// **Get a vendor by ID**
export const getVendorById = async (req, res) => {
    try {
        const { id } = req.params;
        const vendor = await Vendor.findById(id);

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found",
            });
        }

        res.status(200).json({
            success: true,
            data: vendor,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error fetching vendor",
            error: error.message,
        });
    }
};

// **Update a vendor**
export const updateVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const { user } = req;
        const updatedVendorData = req.body;

        const vendor = await Vendor.findById(id);

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found",
            });
        }

        // Ensure the user is the owner or a collaborator
        if (vendor.owner.toString() !== user._id.toString() && vendor.collaborators.toString() !== user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to update this vendor",
            });
        }

        const updatedVendor = await Vendor.findByIdAndUpdate(id, updatedVendorData, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            message: "Vendor updated successfully",
            data: updatedVendor,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error updating vendor",
            error: error.message,
        });
    }
};

// **Delete a vendor**
export const deleteVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const { user } = req;

        const vendor = await Vendor.findById(id);

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found",
            });
        }

        // Ensure the user is the owner (collaborators cannot delete)
        if (vendor.owner.toString() !== user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to delete this vendor",
            });
        }

        await Vendor.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Vendor deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting vendor",
            error: error.message,
        });
    }
};

export const addBannerToVendor = async (req, res) => {
    try {
        const { id } = req.params; // Vendor ID
        const { user } = req;
        const banner = req.file;

        console.log(banner)

        const vendor = await Vendor.findById(id);

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found",
            });
        }

        vendor.ShopBanner = req.file ? `/uploads/vendors/${req.file.filename}` : null;
        await vendor.save();

        res.status(200).json({
            success: true,
            message: "Banner added successfully",
            data: vendor,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error adding banner to vendor",
            error: error.message,
        });
    }
}

// **Add a product to a vendor**
export const addProductToVendor = async (req, res) => {
    let newImagePath = null;
    try {
        const { id } = req.params;
        const { user } = req;
        const product = req.body;

        const vendor = await Vendor.findById(id);
        if (!vendor) {
            if (req.file) {
                deleteOldImage(req.file.path);
            }
            return res.status(404).json({
                success: false,
                message: "Vendor not found"
            });
        }

        // Authorization
        const isOwner = vendor.owner.toString() === user._id.toString();
        const isCollaborator = vendor.collaborators.some(c =>
            c.toString() === user._id.toString()
        );
        if (!isOwner && !isCollaborator) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to add products"
            });
        }

        // Image validation
        if (!product.image) {
            return res.status(400).json({
                success: false,
                message: "Product image is required"
            });
        }

        let relativePath;
        // Handle URL image
        if (typeof product.image === 'string' && product.image.startsWith('http')) {
            relativePath = product.image;
        }
        // Handle Base64 image
        else if (typeof product.image === 'object' && product.image.data) {
            const { data } = product.image;
            const base64Data = data.split(';base64,').pop();

            const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
            relativePath = `/uploads/products/${uniqueFilename}`;
            const fullPath = path.join(process.cwd(), 'public', relativePath);
            newImagePath = fullPath;

            // Create directory if needed
            const uploadDir = path.dirname(fullPath);
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            // Save image
            fs.writeFileSync(fullPath, base64Data, { encoding: 'base64' });
        }
        else {
            return res.status(400).json({
                success: false,
                message: "Invalid image format. Use Base64 or URL"
            });
        }

        // Delete old image if exists (local only)
        if (product.productImage && !product.productImage.startsWith('http')) {
            deleteOldImage(product.productImage);
        }

        // Create new product
        const newProduct = {
            productName: product.name,
            productDescription: product.description,
            productPrice: product.price,
            productImage: relativePath,
            available: product.available,
        };

        vendor.Products.push(newProduct);
        await vendor.save();

        res.status(200).json({
            success: true,
            message: "Product added successfully",
            data: vendor,
        });
    } catch (error) {
        // Cleanup new image on error
        if (newImagePath && fs.existsSync(newImagePath)) {
            fs.unlinkSync(newImagePath);
        }
        // Cleanup middleware file
        if (req.file) {
            deleteOldImage(req.file.path);
        }

        res.status(400).json({
            success: false,
            message: "Error adding product",
            error: error.message,
        });
    }
};

// **Get all products of a vendor**
export const getVendorProducts = async (req, res) => {
    try {
        const { id } = req.params; // Vendor ID
        const vendor = await Vendor.findById(id);

        // console.log(id)

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found",
            });
        }

        res.status(200).json({
            success: true,
            data: vendor.Products,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching products",
            error: error.message,
        });
    }
};

// **Update a product**
export const updateProduct = async (req, res) => {
    let newImagePath = null;
    try {
        const { vendorId, productId } = req.params;
        const updateData = req.body;
        const userId = req.user._id;

        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found"
            });
        }

        const product = vendor.Products.id(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Authorization
        const isOwner = vendor.owner.toString() === userId.toString();
        const isCollaborator = vendor.collaborators.some(c =>
            c.toString() === userId.toString()
        );
        if (!isOwner && !isCollaborator) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const updateFields = {};
        if (updateData.name) updateFields["Products.$.productName"] = updateData.name;
        if (updateData.description) updateFields["Products.$.productDescription"] = updateData.description;
        if (updateData.price) updateFields["Products.$.productPrice"] = updateData.price;
        if (updateData.available !== undefined) updateFields["Products.$.available"] = updateData.available;

        // Handle image update
        if (updateData.image) {
            // URL image
            if (typeof updateData.image === 'string' && updateData.image.startsWith('http')) {
                updateFields["Products.$.productImage"] = updateData.image;
            }
            // Base64 image
            else if (typeof updateData.image === 'object' && updateData.image.data) {
                const { data } = updateData.image;
                const base64Data = data.split(';base64,').pop();

                const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
                const relativePath = `/uploads/products/${uniqueFilename}`;
                const fullPath = path.join(process.cwd(), 'public', relativePath);
                newImagePath = fullPath;

                const uploadDir = path.dirname(fullPath);
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }

                // Save new image
                fs.writeFileSync(fullPath, base64Data, { encoding: 'base64' });
                updateFields["Products.$.productImage"] = relativePath;
            }
            else {
                return res.status(400).json({
                    success: false,
                    message: "Invalid image format. Use Base64 or URL"
                });
            }
        } else {
            updateFields["Products.$.productImage"] = product.productImage;
        }

        // Perform update
        const updatedVendor = await Vendor.findOneAndUpdate(
            { _id: vendorId, "Products._id": productId },
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!updatedVendor) {
            // Cleanup if update failed
            if (newImagePath && fs.existsSync(newImagePath)) {
                fs.unlinkSync(newImagePath);
            }
            return res.status(404).json({
                success: false,
                message: "Product update failed"
            });
        }

        // Delete old image AFTER successful update (local only)
        if (updateData.image && product.productImage && !product.productImage.startsWith('http')) {
            deleteOldImage(product.productImage);
        }

        // Find updated product
        const updatedProduct = updatedVendor.Products.find(
            p => p._id.toString() === productId
        );

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct
        });

    } catch (error) {
        // Cleanup new image on error
        if (newImagePath && fs.existsSync(newImagePath)) {
            fs.unlinkSync(newImagePath);
        }

        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// **Delete a product**
export const deleteProduct = async (req, res) => {
    try {
        const { vendorId, productId } = req.params;
        const userId = req.user._id;

        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found",
            });
        }

        const product = vendor.Products.id(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        if (vendor.owner.toString() !== userId.toString() && !vendor.collaborators.includes(userId)) {
            return res.status(403).json({ message: "You do not have permission to delete this product" });
        }

        // Delete product image if it exists
        if (product.productImage) {
            deleteOldImage(product.productImage);
        }

        vendor.Products.pull({ _id: productId });
        await vendor.save();

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error deleting product",
            error: error.message,
        });
    }
};

export const getVendorOfCurrentUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        const vendor = await Vendor.find({ owner: user._id });

        console.log(id + "\n" + "\n" + user + "\n" + "\n" + vendor + "\n")


        res.status(200).json({
            success: true,
            data: vendor,
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error fetching vendor",
            error: error.message,
        });
    }
}

export const getProductByVendorId = async (req, res) => {
    try {
        const { id: vendorId } = req.params;

        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 10);
        const skip = (page - 1) * limit;

        // Fetch vendor details without products
        const vendorDetails = await Vendor.findById(vendorId).select("-Products");
        const Vendors = await Vendor.findById(vendorId).select("Products");

        if (!vendorDetails) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found",
            });
        }

        // Fetch only required `Products` slice using `$slice`
        const vendor = await Vendor.findById(vendorId, {
            Products: { $slice: [skip, limit] } // Paginate products
        });

        if (!vendor || !vendor.Products.length) {
            return res.status(404).json({
                success: false,
                message: "No products found for this vendor",
            });
        }

        const totalProducts = Vendors.Products.length; // Get total product count

        res.status(200).json({
            success: true,
            vendorDetails, // Vendor details without products
            data: vendor.Products, // Paginated product list
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalProducts / limit),
                totalProducts,
                limit,
                nextPage: skip + limit < totalProducts ? page + 1 : null,
                prevPage: page > 1 ? page - 1 : null,
            }
        });

    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching products",
            error: error.message,
        });
    }
};

export const getVendorOrders = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const userId = req.user._id;

        // Validate vendor ID format
        if (!mongoose.Types.ObjectId.isValid(vendorId)) {
            return res.status(400).json({ message: 'Invalid vendor ID format' });
        }

        // Verify vendor ownership/collaboration
        const vendor = await Vendor.findOne({
            _id: vendorId,
            $or: [
                { owner: userId },
                { collaborators: userId }
            ]
        });

        if (!vendor) {
            return res.status(404).json({
                message: 'Vendor not found or unauthorized access'
            });
        }

        // Get all orders for this vendor with event and user populated
        const orders = await orderModel.find({ vendor: vendorId })
            .populate('event', 'name location date startTime endTime')
            .populate('user', 'fullName userName email phone');

        // Group orders by event
        const eventMap = orders.reduce((acc, order) => {
            const eventId = order.event._id.toString();
            if (!acc[eventId]) {
                acc[eventId] = {
                    eventID: order.event._id,
                    eventName: order.event.name,
                    location: order.event.location,
                    date: order.event.date.toISOString().split('T')[0],
                    starttime: order.event.startTime,
                    endtime: order.event.endTime,
                    organiser: order.user.fullName,
                    username: order.user.userName,
                    phone: order.user.phone,
                    email: order.user.email,
                    orders: [],
                    totalOrderAmount: 0,
                    Link: `/vendor/${vendorId}/orders/respond`
                };
            }

            const product = vendor.Products.id(order.product);
            if (product) {
                const orderDetails = {
                    _id: order._id,
                    name: product.productName,
                    img: product.productImage,
                    price: order.price,
                    totalitems: order.quantity,
                    totalPrice: order.total,
                    availability: product.available,
                    status: order.status
                };

                acc[eventId].orders.push(orderDetails);
                acc[eventId].totalOrderAmount += order.total;
            }
            return acc;
        }, {});

        res.status(200).json(Object.values(eventMap));
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching orders',
            error: error.message
        });
    }
};

export const respondToOrders = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const { eventID, orders } = req.body;
        const userId = req.user._id;

        // Validate vendor ID format
        if (!mongoose.Types.ObjectId.isValid(vendorId)) {
            return res.status(400).json({ message: 'Invalid vendor ID format' });
        }

        // Verify vendor access
        const vendor = await Vendor.findOne({
            _id: vendorId,
            $or: [
                { owner: userId },
                { collaborators: userId }
            ]
        });

        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found or unauthorized' });
        }

        // Validate orders array
        if (!Array.isArray(orders) || orders.length === 0) {
            return res.status(400).json({ message: 'Invalid orders format - expected non-empty array' });
        }

        // Validate each order
        const validOrders = orders.every(order =>
            order &&
            typeof order === 'object' &&
            mongoose.Types.ObjectId.isValid(order._id) &&
            ['confirmed', 'declined', 'pending'].includes(order.status)
        );

        if (!validOrders) {
            return res.status(400).json({
                message: 'Invalid order format - each order must have valid _id and status'
            });
        }

        const results = {
            totalOrders: orders.length,
            successfulUpdates: 0,
            failedUpdates: 0,
            notFoundIds: [],
            updatedOrders: []
        };

        // Process order updates
        await Promise.all(orders.map(async (orderRequest) => {
            try {
                const order = await orderModel.findOneAndUpdate(
                    {
                        _id: orderRequest._id,
                        vendor: vendorId,
                        event: eventID
                    },
                    {
                        status: orderRequest.status,
                        updatedAt: Date.now()
                    },
                    { new: true }
                );

                if (!order) {
                    results.notFoundIds.push(orderRequest._id);
                    results.failedUpdates++;
                    return;
                }

                results.successfulUpdates++;
                results.updatedOrders.push({
                    _id: order._id,
                    status: order.status,
                    updatedAt: order.updatedAt
                });
            } catch (error) {
                results.failedUpdates++;
                console.error(`Error updating order ${orderRequest._id}:`, error);
            }
        }));

        // Notification logic
        const event = await Event.findOne({ _id: eventID }).populate('organizer');
        if (!event || !event.organizer) {
            return res.status(404).json({ message: 'Event not found or has no organizer' });
        }

        const existingUser = await User.findById(event.organizer._id).select('+notification');
        if (!existingUser) {
            return res.status(404).json({ message: 'Organizer user not found' });
        }

        const statuses = [...new Set(orders.map(o => o.status))];
        const statusMessage = statuses.length === 1 ?
            `${statuses[0]} by the vendor` :
            'updated by the vendor';

        const notificationPayload = {
            type: 'OrderUpdate',
            sender: userId,
            vendor: new mongoose.Types.ObjectId(vendorId),
            message: `Your ${orders.length} order(s) have been ${statusMessage}.`,
            seen: false,
            createdAt: new Date()
        };

        try {
            const existingNotification = existingUser.notification.find(n =>
                n.type === notificationPayload.type &&
                n.sender.equals(notificationPayload.sender) &&
                n.vendor.equals(notificationPayload.vendor) &&
                n.message === notificationPayload.message
            );

            const updateOperation = existingNotification ? {
                $set: {
                    'notification.$[elem].seen': false,
                    'notification.$[elem].createdAt': new Date(),
                }
            } : {
                $push: { notification: notificationPayload },
                $inc: { notificationCount: 1 }
            };

            const updateOptions = {
                new: true,
                arrayFilters: existingNotification ?
                    [{ 'elem.vendor': notificationPayload.vendor, 'elem.type': notificationPayload.type }] :
                    undefined
            };

            await User.findByIdAndUpdate(
                existingUser._id,
                updateOperation,
                updateOptions
            );
        } catch (error) {
            console.error('Notification error:', error);
        }

        res.status(200).json({
            message: `Processed ${orders.length} orders`,
            ...results,
            successRate: `${(results.successfulUpdates / orders.length * 100).toFixed(1)}%`
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error processing orders',
            error: error.message
        });
    }
};
