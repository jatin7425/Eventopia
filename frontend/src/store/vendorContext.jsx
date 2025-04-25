import { createContext, useContext, useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const VendorContext = createContext();

export function useVendor() {
    return useContext(VendorContext);
}

export function VendorProvider({ children }) {
    const [vendors, setVendors] = useState([]); // All vendors
    const [vendor, setVendor] = useState(null); // Single vendor details
    const [products, setProducts] = useState([]); // Products of a vendor
    const [isVendorLoading, setIsVendorLoading] = useState(false);
    const [productUpdated, setProductUpdated] = useState(0);


    // Fetch all vendors
    const fetchVendors = async () => {
        setIsVendorLoading(true);
        try {
            const res = await axiosInstance.get("/vendor/getAllVendors");
            setVendors(res.data);
        } catch (error) {
            console.error("Error fetching vendors", error);
        } finally {
            setIsVendorLoading(false);
        }
    };

    // Add a banner to a vendor
    const addBannerToVendor = async (vendorId, banner) => {
        setIsVendorLoading(true);
        try {
            const res = await axiosInstance.post(`/vendor/addBannerToVendor/${vendorId}`, banner);
            fetchVendorById(vendorId);
            fetchVendors();
            toast.success("Banner added successfully");
        } catch (error) {
            console.error("Error adding banner to vendor", error);
        } finally {
            setIsVendorLoading(false);
        }
    }

    // Fetch a single vendor by ID
    const fetchVendorById = async (vendorId) => {
        setIsVendorLoading(true);
        try {
            const res = await axiosInstance.get(`/vendor/getVendorById/${vendorId}`);
            console.log(res?.data?.Products)
            setVendor(res.data);
            setProducts(res.data.Products);
            fetchVendors();
        } catch (error) {
            console.error("Error fetching vendor", error);
        } finally {
            setIsVendorLoading(false);
        }
    };

    // Add a rating to a vendor
    const rateVendor = async (vendorId, rating) => {
        setIsVendorLoading(true);
        try {
            const res = await axiosInstance.post(`/vendor/addVendorRating/${vendorId}/rate`, { rating });
            fetchVendorById(vendorId);
            fetchVendors();
            toast.success("Vendor rated successfully");
        } catch (error) {
            console.error("Error rating vendor", error);
        } finally {
            setIsVendorLoading(false);
        }
    };

    // Add a rating to a product
    const rateProduct = async (vendorId, productId, rating) => {
        setIsVendorLoading(true);
        try {
            const res = await axiosInstance.post(`/vendor/addProductRating/${vendorId}/products/${productId}/rate`, { rating });
            fetchVendorById(vendorId);
            fetchVendors();
            toast.success("Product rated successfully");
        } catch (error) {
            console.error("Error rating product", error);
        } finally {
            setIsVendorLoading(false);
        }
    };

    // Add a new vendor
    const addVendor = async (vendorData) => {
        setIsVendorLoading(true);
        try {
            const res = await axiosInstance.post("/vendor/createVendor", vendorData);
            fetchVendors();
            toast.success("Vendor added successfully");
        } catch (error) {
            console.error("Error adding vendor", error);
        } finally {
            setIsVendorLoading(false);
        }
    };

    // Update vendor details
    const updateVendor = async (vendorId, vendorData) => {
        setIsVendorLoading(true);
        try {
            const res = await axiosInstance.put(`/vendor/updateVendor/${vendorId}`, vendorData);
            fetchVendorById(vendorId);
            fetchVendors();
            toast.success("Vendor updated successfully");
        } catch (error) {
            console.error("Error updating vendor", error);
        } finally {
            setIsVendorLoading(false);
        }
    };

    // Delete a vendor
    const deleteVendor = async (vendorId) => {
        setIsVendorLoading(true);
        try {
            await axiosInstance.delete(`/vendor/deleteVendor/${vendorId}`);
            fetchVendors();
            toast.success("Vendor deleted successfully");
        } catch (error) {
            console.error("Error deleting vendor", error);
        } finally {
            setIsVendorLoading(false);
        }
    };

    // Add a product to a vendor
    const addProduct = async (vendorId, productData) => {
        setIsVendorLoading(true);
        try {
            const res = await axiosInstance.post(`/vendor/addProductToVendor/${vendorId}/products`, productData);
            fetchVendorById(vendorId);
            fetchVendors();
            toast.success("Product added successfully");
        } catch (error) {
            console.error("Error adding product", error);
        } finally {
            setIsVendorLoading(false);
        }
    };

    // Update a product
    const updateProduct = async (vendorId, productId, productData, image) => {
        setIsVendorLoading(true);
        try {
            let config = {};
            
            // If productData is FormData (has image)
            if (productData instanceof FormData) {
                config = {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                };
            } else {
                // If regular JSON data (no image)
                config = {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                };
            }

            const res = await axiosInstance.put(
                `/vendor/updateProduct/${vendorId}/products/${productId}`, 
                productData,
                image,
                config
            );
            
            toast.success("Product updated successfully");
            fetchVendorById(vendorId);
            fetchVendors();
            setProductUpdated(prev => prev + 1);
        } catch (error) {
            console.error("Error updating product", error);
        } finally {
            setIsVendorLoading(false);
        }
    };

    // Delete a product
    const deleteProduct = async (vendorId, productId) => {
        setIsVendorLoading(true);
        try {
            await axiosInstance.delete(`/vendor/deleteProduct/${vendorId}/products/${productId}`);
            fetchVendorById(vendorId);
            fetchVendors();
            toast.success("Product deleted successfully");
        } catch (error) {
            console.error("Error deleting product", error);
        } finally {
            setIsVendorLoading(false);
        }
    };

    const getVendorOrders = async (vendorId) => {
        try {
            const res = await axiosInstance.get(`/vendor/protectRoute/${vendorId}`);
            return res.data
        } catch (error) {
            console.error("Error deleting product", error);
        }
    }

    useEffect(() => {
        fetchVendors(); // Automatically fetch all vendors on mount
    }, []);

    return (
        <VendorContext.Provider
            value={{
                vendors,
                vendor,
                products,
                isVendorLoading,
                productUpdated,
                setIsVendorLoading,
                fetchVendorById,
                addVendor,
                updateVendor,
                deleteVendor,
                addProduct,
                updateProduct,
                deleteProduct,
                rateVendor,
                rateProduct,
                addBannerToVendor,
                getVendorOrders,
            }}
        >
            {children}
        </VendorContext.Provider>
    );
}