import { createContext, useContext, useState, useEffect } from 'react';
import { axiosInstance } from '../lib/axios';
const NotificationContext = createContext();

export function useNotification() {
    return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState();
    const [notificationFilters, setNotificationFilters] = useState()
    const [filters, setFilters] = useState({
        type: null,
        sender: null,
        startDate: null,
        endDate: null,
        search: '',
        seen: null,
        page: 1,
        limit: 20
    });

    const getNotification = async () => {
        try {
            const params = {
                page: filters.page,
                limit: filters.limit,
                type: filters.type,
                sender: filters.sender,
                startDate: filters.startDate,
                endDate: filters.endDate,
                search: filters.search,
                seen: filters.seen
            };
            const res = await axiosInstance.get('/notification/get', { params });
            setNotifications(res.data);
        } catch (error) {
            console.error("Error getNotification", error);
        }
    }

    const seeNotification = async () => {
        try {
            const res = await axiosInstance.patch('/notification/seeNotification')
            console.log(res)
            getNotification()
        } catch (error) {
            console.error(error)
        }
    }

    const getNotificationFilters = async () => {
        try {
            const res = await axiosInstance.get('/notification/getFilters');
            setNotificationFilters(res)
        } catch (error) {
        }
    }

    useEffect(() => {
        getNotification();
    }, [filters])

    useEffect(() => {
        getNotificationFilters();
    })

    return (
        <NotificationContext.Provider value={{
            notifications,
            notificationFilters,
            filters,
            setFilters,
            setNotifications,
            getNotification,
            getNotificationFilters,
            seeNotification
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

