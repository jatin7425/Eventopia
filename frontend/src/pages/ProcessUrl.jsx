import React from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';

const ProcessUrl = () => {
    const location = useLocation();

    // Create a URLSearchParams object to access query parameters
    const searchParams = new URLSearchParams(location.search);
    const nextUrl = decodeURIComponent(searchParams.get('next') || '')

    const declineEventInvitation = async () => {
        try {
            const res = await axiosInstance.patch(nextUrl);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const callfunction = async () => {
            await declineEventInvitation();
            setTimeout(() => {
                window.close();
            }, 2000);
        }
        callfunction();
    }, [nextUrl]);


    return (
        <div>
            Processing....
        </div>
    );
};

export default ProcessUrl;
