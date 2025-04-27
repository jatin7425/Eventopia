import { createContext, useContext, useEffect, useState } from 'react'
import { axiosInstance } from '../lib/axios';

const AdminContext = createContext();

export function useAdmin() {
    return useContext(AdminContext);
}

// Renamed to AdminProvider for clarity
export function AdminProvider({ children }) {
    const [Collections, setCollections] = useState([]);
    const [CollectionData, setCollectionData] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getCollection = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(`/admin/listCollection`);

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

    const getCollectionData = async (collectionName, page = 1, limit = 10, filters = {}, includeFilterOptions = true) => {
        try {
            console.log("getCollectionData called")
            console.log(" ")
            console.log("filters: ", filters);
            setLoading(true);
            const res = await axiosInstance.post(`/admin/selecteColection/${collectionName}/?page=${page}&limit=${limit}`,
                {
                    filters,
                    includeFilterOptions
                }
            );

            if (!res.data.success) {
                throw new Error(res.data.message || 'Failed to fetch collection data');
            }

            setCollectionData([]);
            setCollectionData(res.data || []);
            setError(null);

            return res.data || [];

        } catch (error) {
            console.error("Error in getCollectionData", error);
            setError(error.message);
            setCollectionData([]);
        } finally {
            setLoading(false);
        }
    };

    const updateCollectionItem = async (collectionName, id, updateData) => {
        try {
            setLoading(true);
            const res = await axiosInstance.put(
                `/admin/collections/${collectionName}`,
                {
                    id,
                    updateData
                }
            );

            if (!res.data.success) {
                throw new Error(res.data.message || 'Update failed');
            }

            // Refresh the data after update
            await getCollectionData(collectionName);
            return res.data;

        } catch (error) {
            console.error("Error in updateCollectionItem", error);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deleteCollectionItem = async (collectionName, id) => {
        console.log(collectionName, id)
        try {
            setLoading(true);
            const res = await axiosInstance.delete(
                `/admin/collections/${collectionName}`,
                { data: { id } } // Proper way to send body in DELETE requests
            );

            if (!res.data.success) {
                throw new Error(res.data.message || 'Delete failed');
            }

            // Refresh the data after deletion
            await getCollectionData(collectionName);
            return res.data;

        } catch (error) {
            console.error("Error in deleteCollectionItem", error);
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCollection();
    }, []);

    return (
        <AdminContext.Provider value={{
            Collections,
            CollectionData,
            loading,
            error,
            setCollectionData,
            getCollection,
            getCollectionData,
            updateCollectionItem,
            deleteCollectionItem
        }}>
            {children}
        </AdminContext.Provider>
    );
}