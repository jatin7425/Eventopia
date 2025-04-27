import { createContext, useContext, useEffect, useState } from 'react'
import { axiosInstance } from '../lib/axios';

const AdminContext = createContext();

export function useAdmin() {
    return useContext(AdminContext);
}

// Renamed to AdminProvider for clarity
export function AdminProvider({ children }) {
    const [Collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getCollection = async (page = 1, limit = 10) => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(`/admin/listCollection/?page=${page}&limit=${limit}`);

            if (!res.data.success) {
                throw new Error(res.data.message || 'Failed to fetch collections');
            }

            // Access the correct response property
            setCollections(res.data.data || []);
            setError(null);
        } catch (error) {
            console.error("Error in getCollection", error);
            setError(error.message);
            setCollections([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCollection();
    }, []);

    return (
        <AdminContext.Provider value={{ Collections, loading, error, refresh: getCollection }}>
            {children}
        </AdminContext.Provider>
    );
}