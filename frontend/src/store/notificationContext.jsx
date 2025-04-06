import { createContext, useContext, useState, useEffect } from 'react';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';
import { useEventCart } from './eventCartContext';
const NotificationContext = createContext();

export function useNotification() {
    return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState();

    const getNotification = async () => {
        try {
            const { data } = await axiosInstance.get('/notification/get');
            setNotifications(data);
        } catch (error) {
            console.error("Error getNotification", error);
        }
    }
    
    useEffect(() => {
        getNotification();
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, setNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
}

