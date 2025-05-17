import express from "express";
import { Router } from 'express';
import { uploadProduct, uploadVendorImage, uploadVendorBanner } from '../utils/fileUpload.js';
import { protectRoute } from "../middleware/auth.middleware.js";  // Assuming protectRoute middleware is used
import {
    createVendor,
    getAllVendors,
    getVendorById,
    updateVendor,
    deleteVendor,
    addProductToVendor,
    getVendorProducts,
    deleteProduct,
    updateProduct,
    getVendorOfCurrentUser,
    addBannerToVendor,
    getProductByVendorId,
    getVendorOrders,
    respondToOrders,
} from "../controllers/vendor.controller.js";


const router = express.Router();

// Create a middleware to parse base64 images
const handleBase64Image = (req, res, next) => {
    // If the request is JSON and contains base64 image data
    if (req.headers['content-type'] === 'application/json' && req.body.image) {
        console.log('Processing base64 image data');
        next();
    } 
    // If it's a multipart form request
    else if (req.headers['content-type']?.includes('multipart/form-data')) {
        console.log('Processing multipart form data');
        uploadProduct.single('image')(req, res, (err) => {
            if (err) {
                console.error('File upload error:', err);
                return res.status(400).json({ 
                    success: false, 
                    message: "File upload error", 
                    error: err.message 
                });
            }
            next();
        });
    } 
    // If no image is being sent
    else {
        console.log('No image data detected');
        next();
    }
};

router.post("/createVendor", protectRoute, uploadVendorImage.single('ShopLogo'), createVendor); // Create a new vendor
router.get("/getAllVendors", getAllVendors); // Get all vendors
router.get("/getAllVendorsOfCurrentUser", getVendorOfCurrentUser); // Get all vendors
router.get("/getVendorById/:id", getVendorById); // Get vendor by ID
router.put("/updateVendor/:id", protectRoute, updateVendor); // Update vendor
router.delete("/deleteVendor/:id", deleteVendor); // Delete vendor
router.post("/addProductToVendor/:id/products", protectRoute, handleBase64Image, addProductToVendor); // Add product to vendor
router.get("/getVendorProducts/:id/products", getVendorProducts); // Get all products of a vendor
router.put("/updateProduct/:vendorId/products/:productId", protectRoute, handleBase64Image, updateProduct); // Update a product
router.delete("/deleteProduct/:vendorId/products/:productId", protectRoute, deleteProduct); // Delete a product
router.post("/addBannerToVendor/:id", protectRoute, uploadVendorBanner.single('ShopBanner'), addBannerToVendor); // Add banner to vendor
router.get("/getProductByVendorId/:id", getProductByVendorId); // Get product by vendor
router.get("/protectRoute/:vendorId", protectRoute, getVendorOrders);
router.put("/:vendorId/orders/respond/", protectRoute, respondToOrders);

export default router;