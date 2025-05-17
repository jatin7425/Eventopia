import { createContext, useContext, useEffect, useState } from 'react'
import { axiosInstance } from '../lib/axios';

const contactContext = createContext();

export function usecontact() {
    return useContext(contactContext);
}

// Fixed component name to PascalCase
export function ContactProvider({ children }) {
    const [contactResponse, setContactResponse] = useState()

    // Accept data object instead of individual parameters
    const createContact = async (data) => {
        try {
            const response = await axiosInstance.post('/contact/createContact', data);
            setContactResponse(response.data);
            return response.data;
        } catch (error) {
            console.log(`Error in createContact: ${error}`);
        }
    }

    return (
        <contactContext.Provider value={{
            contactResponse,
            createContact
        }}>
            {children}
        </contactContext.Provider>
    );
}