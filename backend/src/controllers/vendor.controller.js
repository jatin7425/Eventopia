import Vendor from "../models/vendor.model.js"; // Adjust the path as needed
import User from "../models/user.model.js";
import Event from "../models/event.model.js";
import mongoose from "mongoose";
import path from 'path';
import fs from 'fs';


// Helper function to delete old image
const deleteOldImage = (imagePath) => {
    if (imagePath) {
        // Remove any URL prefix if present (e.g., http://localhost:3000/)
        const cleanPath = imagePath.replace(/^https?:\/\/[^\/]+/, '');

        // Remove leading slash if present
        const relativePath = cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath;

        // Construct the full path
        const fullPath = path.join(process.cwd(), 'public', relativePath);

        console.log('Attempting to delete image at:', fullPath); // Debug log

        try {
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
                console.log('Successfully deleted image:', fullPath); // Debug log
            } else {
                console.log('Image file not found:', fullPath); // Debug log
            }
        } catch (error) {
            console.error('Error deleting image:', error); // Error log
        }
    }
};

// **Create a new vendor**
export const createVendor = async (req, res) => {
    try {
        const user = req.user; // The current authenticated user
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
        const user = req.user;
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
        const user = req.user;

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
        const user = req.user;
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
    try {
        const { id } = req.params; // Vendor ID
        const user = req.user;
        const product = req.body;

        const vendor = await Vendor.findById(id);

        if (!vendor) {
            // Delete uploaded file if vendor not found
            if (req.file) {
                deleteOldImage(req.file.path);
            }
            return res.status(404).json({
                success: false,
                message: "Vendor not found",
            });
        }

        // Ensure the user is the owner or a collaborator
        if (vendor.owner.toString() !== user._id.toString() && vendor.collaborators.toString() !== user._id.toString()) {
            if (req.file) {
                deleteOldImage(req.file.path);
            }
            return res.status(403).json({
                success: false,
                message: "You do not have permission to add a product to this vendor",
            });
        }

        const newProduct = {
            productName: product.name,
            productDescription: product.description,
            productPrice: product.price,
            productImage: req.file ? `/uploads/products/${req.file.filename}` : null,
            available: product.available,
        }

        vendor.Products.push(newProduct);
        await vendor.save();

        res.status(200).json({
            success: true,
            message: "Product added successfully",
            data: vendor,
        });
    } catch (error) {
        // Delete uploaded file if error occurs
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

// Add or Update Vendor Rating
export const addVendorRating = async (req, res) => {
    try {
        const { id } = req.params; // Vendor ID
        const { rating, comment } = req.body;
        const userId = req.user._id; // Extract userId from the authenticated user

        const vendor = await Vendor.findById(id);
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found",
            });
        }

        // Check if user has already rated
        const existingRating = vendor.VendorRatings.find((r) => r.userId.toString() === userId);

        if (existingRating) {
            // Update existing rating
            existingRating.rating = rating;
            existingRating.comment = comment;
        } else {
            // Add new rating
            vendor.VendorRatings.push({ userId, rating, comment });
        }

        // Update the average rating
        const totalRatings = vendor.VendorRatings.reduce((acc, r) => acc + r.rating, 0);
        vendor.averageVendorRating = totalRatings / vendor.VendorRatings.length;

        await vendor.save();

        res.status(200).json({
            success: true,
            message: "Vendor rating added/updated successfully",
            data: vendor,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error adding/updating vendor rating",
            error: error.message,
        });
    }
};

// Add or Update Product Rating
export const addProductRating = async (req, res) => {
    try {
        const { vendorId, productId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user._id; // Extract userId from the authenticated user

        // Find the vendor
        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found",
            });
        }

        // Find the product within the vendor's products
        const product = vendor.Products.id(productId); // Find the product by ID
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // Check if user has already rated this product
        const existingRating = product.productRatings.find((r) => r.userId.toString() === userId.toString());

        if (existingRating) {
            // Update existing rating if found
            existingRating.rating = rating;
            existingRating.comment = comment;
        } else {
            // Add new rating if not found
            product.productRatings.push({ userId, rating, comment });
        }

        // Update the average rating for the product
        const totalRatings = product.productRatings.reduce((acc, r) => acc + r.rating, 0);
        product.averageRating = totalRatings / product.productRatings.length;

        // Save the vendor document (this will save the product as well)
        await vendor.save();

        res.status(200).json({
            success: true,
            message: "Product rating added/updated successfully",
            data: product,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error adding/updating product rating",
            error: error.message,
        });
    }
};

// **Update a product**
export const updateProduct = async (req, res) => {
    try {
        const { vendorId, productId } = req.params;
        const updateData = req.body;
        const userId = req.user._id;

        console.log('Received update data:', {
            ...updateData,
            image: updateData.image ? 'Image data exists' : 'No image'
        });

        // Find vendor and validate ownership
        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ success: false, message: "Vendor not found" });
        }

        // Find product
        const product = vendor.Products.id(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Check authorization
        if (vendor.owner.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        // Create update object
        const updateFields = {};

        // Update basic fields if provided
        if (updateData.name) updateFields["Products.$.productName"] = updateData.name;
        if (updateData.description) updateFields["Products.$.productDescription"] = updateData.description;
        if (updateData.price) updateFields["Products.$.productPrice"] = updateData.price;
        if (updateData.available !== undefined) updateFields["Products.$.available"] = updateData.available;

        // Handle image update if provided
        if (updateData.image && updateData.image.data) {
            try {
                // Extract base64 data and metadata
                const { data } = updateData.image;

                // Remove the data:image/xxx;base64, prefix
                const base64Data = data.split(';base64,').pop();

                // Generate unique filename
                const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
                const relativePath = `/uploads/products/${uniqueFilename}`;
                const fullPath = path.join(process.cwd(), 'public', relativePath);

                // Ensure directory exists
                const uploadDir = path.dirname(fullPath);
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }

                // Delete old image if exists
                if (product.productImage) {
                    deleteOldImage(product.productImage);
                }

                // Save new image
                fs.writeFileSync(fullPath, base64Data, { encoding: 'base64' });

                // Update image path in database
                updateFields["Products.$.productImage"] = relativePath;

                // console.log('Image saved successfully:', relativePath);
            } catch (error) {
                // console.error('Error processing image:', error);
                return res.status(400).json({
                    success: false,
                    message: "Error processing image",
                    error: error.message
                });
            }
        }

        // Update the product
        const updatedVendor = await Vendor.findOneAndUpdate(
            { _id: vendorId, "Products._id": productId },
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!updatedVendor) {
            return res.status(404).json({
                success: false,
                message: "Product update failed"
            });
        }

        // Get the updated product
        const updatedProduct = updatedVendor.Products.find(
            p => p._id.toString() === productId
        );

        console.log('Product updated successfully:', {
            productId,
            updatedFields: Object.keys(updateFields)
        });

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct
        });

    } catch (error) {
        console.error("Error in updateProduct:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
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
        console.log(totalProducts);

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

        // Get all orders for this vendor
        const orders = vendor.Orders;

        // Get unique event IDs from orders
        const eventIds = [...new Set(orders.map(o => o.event.toString()))];

        // Get event details
        const events = await Event.find({ _id: { $in: eventIds } })
            .populate('organizer');

        // Create event-order mapping
        const eventOrderMap = await Promise.all(events.map(async (event) => {
            const eventOrders = orders.filter(o =>
                o.event.toString() === event._id.toString()
            );

            // Resolve product details for each order
            const orderDetails = await Promise.all(eventOrders.map(async (order) => {
                const product = vendor.Products.id(order.product);
                if (!product) return null;

                return {
                    _id: order._id,
                    name: product.productName,
                    img: product.productImage,
                    price: product.productPrice,
                    totalitems: order.quantity,
                    totalPrice: product.productPrice * order.quantity,
                    availability: product.available,
                    status: order.status || 'pending'
                };
            }));

            return {
                eventID: event._id,
                eventName: event.name,
                organiser: event.organizer.fullName || 'N/A',
                username: event.organizer.userName || 'N/A',
                location: event.location,
                date: event.date.toISOString().split('T')[0],
                starttime: event.startTime,
                endtime: event.endTime,
                phone: event.organizer.phone || 'N/A',
                email: event.organizer.email || 'N/A',
                orders: orderDetails.filter(Boolean),
                totalOrderAmount: orderDetails.reduce((sum, o) => sum + (o?.totalPrice || 0), 0),
                Link: `/vendor/${vendorId}/orders/respond`
            };
        }));

        res.status(200).json(eventOrderMap);
    } catch (error) {
        console.log(error)
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

        // Validate event ID format
        if (!mongoose.Types.ObjectId.isValid(eventID)) {
            return res.status(400).json({ message: 'Invalid event ID format' });
        }

        // Validate orders array
        if (!Array.isArray(orders) || orders.length === 0) {
            return res.status(400).json({ message: 'Invalid orders format - expected non-empty array' });
        }

        const user = User.findById(userId);

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

        // Find vendor and validate access
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
                const order = vendor.Orders.id(orderRequest._id);
                if (!order) {
                    results.notFoundIds.push(orderRequest._id);
                    results.failedUpdates++;
                    return;
                }

                order.status = orderRequest.status;
                order.updatedAt = new Date();
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

        // Save vendor changes first
        await vendor.save();

        // Notification logic
        const event = await Event.findOne({ _id: eventID }).populate('organizer');
        if (!event || !event.organizer) {
            return res.status(404).json({ message: 'Event not found or has no organizer' });
        }

        const existingUser = await User.findById(event.organizer._id).select('+notification');
        if (!existingUser) {
            return res.status(404).json({ message: 'Organizer user not found' });
        }

        // Determine notification message
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
            // Check for existing notification
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
            // Don't fail the request, just log the error
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
