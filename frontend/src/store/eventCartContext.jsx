import { createContext, useContext, useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const EventContext = createContext(); // ✅ Named Export Only

export const useEventCart = () => {
    return useContext(EventContext);
};

export const EventCartProvider = ({ children }) => {
    const [eventId, setEventId] = useState(null);
    const [VendorId, setVendorId] = useState(null);
    const [cart, setCart] = useState([]); // Store cart data locally

    useEffect(() => {
        if (!eventId) {
            const storedEventId = sessionStorage.getItem("eventId");
            if (storedEventId) {
                setEventId(storedEventId);
            }
        } else {
            sessionStorage.setItem("eventId", eventId);
        }
    }, [eventId]);



    const addToCart = async (productId, quantity = 1) => {
        console.log(eventId, productId, quantity);
        try {
            const response = await axiosInstance.post(
                `/event/${eventId}/cart/${VendorId}`,
                { productId, quantity }
            );
            getEventCart(1, 10)
            toast.success("Product added to cart!");
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Error adding to cart");
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const response = await axiosInstance.delete(
                `/event/${eventId}/cart/${productId}`
            );
            getEventCart(1, 10)
            toast.success("Product removed from cart!");
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Error removing from cart");
        }
    };

    const updateCartQuantity = async (productId, quantity) => {
        try {
            const response = await axiosInstance.put(
                `/event/${eventId}/cart/${productId}`,
                { quantity }
            );

            getEventCart(1, 10)
            toast.success("Cart updated successfully!");
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating cart");
        }
    };

    const getEventCart = async (page = 1, limit = 10) => {
        if (eventId != undefined) {
            try {
                const response = await axiosInstance.get(
                    `/event/${eventId}/cart?page=${page}&limit=${limit}`
                );
                setCart(response.data);
                return response.data;
            } catch (error) {
                setCart([]);
            }
        }
    };

    const clearEventCart = async (eventId) => {
        try {
            const response = await axiosInstance.delete(
                `/event/${eventId}/cart/clear`
            );
            setCart([]);
            toast.success("Cart cleared successfully!");
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Error clearing cart");
        }
    };

    useEffect(() => {
        getEventCart(1, 10)
    }, [eventId]);


    return (
        <EventContext.Provider
            value={{
                eventId,
                setEventId,
                cart,
                addToCart,
                removeFromCart,
                updateCartQuantity,
                getEventCart,
                clearEventCart,
                setVendorId,
            }}
        >
            {children}
        </EventContext.Provider>
    );
};
