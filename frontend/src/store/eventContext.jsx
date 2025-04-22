import { createContext, useContext, useState, useEffect } from 'react';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';
import { useEventCart } from './eventCartContext';
const EventContext = createContext();


export function useEvent() {
    return useContext(EventContext);
}

export function EventProvider({ children }) {
    const [events, setEvents] = useState([]);
    const [event, setEvent] = useState(null);
    const [isEventLoading, setIsEventLoading] = useState(false);
    const { setEventId } = useEventCart();
    const [attendeeStatsdets, setAttendeeStatsdets] = useState()
    const [addedAttendee, setAddedAttendee] = useState()
    const [calendarEntries, setCalendarEntries] = useState([]);
    const [selectedCalendarEntry, setSelectedCalendarEntry] = useState(null);

    // Get all events with optional filters
    const getEvents = async (filters = {}) => {
        setIsEventLoading(true);
        try {
            const { data } = await axiosInstance.get('/event/getEvents', { params: filters });
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events', error);
            toast.error(error.response?.data?.message || 'Error fetching events');
        } finally {
            setIsEventLoading(false);
        }
    };

    // Get a single event by ID
    const getEventById = async (eventId) => {
        setIsEventLoading(true);
        try {
            const { data } = await axiosInstance.get(`/event/getEventById/${eventId}`);
            setEvent(data);
        } catch (error) {
            console.error('Error fetching event by ID', error);
            toast.error(error.response?.data?.message || 'Error fetching event');
        } finally {
            setIsEventLoading(false);
        }
    };

    // Create a new event
    const createEvent = async (eventData) => {
        console.log(eventData);
        setIsEventLoading(true);
        try {
            const data = await axiosInstance.post('/event/createEvent', eventData);
            toast.success(data.data.message);
            setEventId(data.data._id);
            getEvents();
            window.location.href = "/vendorCollection";
        } catch (error) {
            console.error('Error creating event', error);
            toast.error(error.response?.data?.message || 'Error creating event');
        } finally {
            setIsEventLoading(false);
        }
    };

    // Update an event
    const updateEvent = async (eventId, updatedData) => {
        setIsEventLoading(true);
        try {
            const { data } = await axiosInstance.put(`/event/updateEvent/${eventId}`, updatedData);
            toast.success(data.message);
            getEventById(eventId);  // Fetch updated event
        } catch (error) {
            console.error('Error updating event', error);
            toast.error(error.response?.data?.message || 'Error updating event');
        } finally {
            setIsEventLoading(false);
        }
    };

    // Delete an event
    const deleteEvent = async (eventId) => {
        setIsEventLoading(true);
        try {
            const { data } = await axiosInstance.delete(`/event/deleteEvent/${eventId}`);
            toast.success(data.message);
            getEvents();  // Refresh the events list
        } catch (error) {
            console.error('Error deleting event', error);
            toast.error(error.response?.data?.message || 'Error deleting event');
        } finally {
            setIsEventLoading(false);
        }
    };

    // Add a service to an event
    const addServiceToEvent = async (eventId, serviceData) => {
        setIsEventLoading(true);
        try {
            const { data } = await axiosInstance.post(`/event/addServiceToEvent/${eventId}/service`, serviceData);
            toast.success(data.message);
            getEventById(eventId);  // Fetch updated event with new service
        } catch (error) {
            console.error('Error adding service to event', error);
            toast.error(error.response?.data?.message || 'Error adding service');
        } finally {
            setIsEventLoading(false);
        }
    };

    // Add feedback to an event
    const addFeedbackToEvent = async (eventId, feedbackData) => {
        setIsEventLoading(true);
        try {
            const { data } = await axiosInstance.post(`/event/addFeedbackToEvent/${eventId}/feedback`, feedbackData);
            toast.success(data.message);
            getEventById(eventId);  // Fetch updated event with new feedback
        } catch (error) {
            console.error('Error adding feedback to event', error);
            toast.error(error.response?.data?.message || 'Error adding feedback');
        } finally {
            setIsEventLoading(false);
        }
    };

    const addAttendiesToEvent = async (eventId, attendees) => {
        setIsEventLoading(true);
        try {
            const { data } = await axiosInstance.post(`/event/${eventId}/attendees`, attendees);
            toast.success(data.message);
            setAddedAttendee(data.attendee);
            getEventById(eventId);  // Fetch updated event with new feedback
        } catch (error) {
            console.error('Error adding feedback to event', error);
            toast.error(error.response?.data?.message || 'Error adding feedback');
        } finally {
            setIsEventLoading(false);
        }
    };

    const updateStatus = async (eventId, attendeeId, status) => {
        setIsEventLoading(true);
        try {
            const { data } = await axiosInstance.put(`/event/${eventId}/attendees/${attendeeId}`, { status });
            toast.success(data.message);
            getEventById(eventId);  // Fetch updated event with new feedback
        } catch (error) {
            console.error('Error adding feedback to event', error);
            toast.error(error.response?.data?.message || 'Error adding feedback');
        } finally {
            setIsEventLoading(false);
        }
    };

    const attendeeStats = async (eventId) => {
        setIsEventLoading(true);
        console.log(eventId)
        try {
            const { data } = await axiosInstance.get(`/event/${eventId}/stats`);
            setAttendeeStatsdets(data);
            return data
        } catch (error) {
            console.error('Error adding feedback to event', error);
            toast.error(error.response?.data?.message || 'Error adding feedback');
        } finally {
            setIsEventLoading(false);
        }
    }

    // Calendar Operations
    const addCalendarToEvent = async (eventId, calendarData) => {
        setIsEventLoading(true);
        try {
            const { data } = await axiosInstance.post(
                `/event/${eventId}/calendar`,
                calendarData
            );
            toast.success(data.message);
            getEventById(eventId); // Refresh event data
            getCalendarEntries(eventId);
            return data;
        } catch (error) {
            console.error('Error adding calendar entry', error);
            toast.error(error.response?.data?.message || 'Error adding calendar entry');
            throw error;
        } finally {
            setIsEventLoading(false);
        }
    };

    const updateCalendarEntry = async (eventId, calendarId, updates) => {
        setIsEventLoading(true);
        try {
            const { data } = await axiosInstance.put(
                `/event/${eventId}/calendar/${calendarId}`,
                updates
            );
            toast.success('Calendar entry updated successfully');
            getEventById(eventId); // Refresh event data
            return data;
        } catch (error) {
            console.error('Error updating calendar entry', error);
            toast.error(error.response?.data?.message || 'Error updating calendar entry');
            throw error;
        } finally {
            setIsEventLoading(false);
        }
    };

    const deleteCalendarEntry = async (eventId, calendarId) => {
        setIsEventLoading(true);
        try {
            await axiosInstance.delete(`/event/${eventId}/calendar/${calendarId}`);
            toast.success('Calendar entry deleted successfully');
            getEventById(eventId); // Refresh event data
        } catch (error) {
            console.error('Error deleting calendar entry', error);
            toast.error(error.response?.data?.message || 'Error deleting calendar entry');
            throw error;
        } finally {
            setIsEventLoading(false);
        }
    };

    const getCalendarEntries = async (eventId, date = null, filters = []) => {
        setIsEventLoading(true);
        try {
            const { data } = await axiosInstance.get(`/event/${eventId}/calendar`, {
                body: {date, filters}
            });
            setCalendarEntries(data);
            return data;
        } catch (error) {
            console.error('Error fetching calendar entries', error);
            toast.error(error.response?.data?.message || 'Error fetching calendar entries');
            // throw error;
        } finally {
            setIsEventLoading(false);
        }
    };

    useEffect(() => {
        getEvents(); // Fetch all events when the component mounts
    }, []);

    return (
        <EventContext.Provider value={{
            isEventLoading,
            events,
            event,
            attendeeStatsdets,
            addedAttendee,
            calendarEntries,
            selectedCalendarEntry,
            createEvent,
            getEvents,
            getEventById,
            updateEvent,
            deleteEvent,
            addServiceToEvent,
            addFeedbackToEvent,
            addAttendiesToEvent,
            updateStatus,
            attendeeStats,
            addCalendarToEvent,
            updateCalendarEntry,
            deleteCalendarEntry,
            getCalendarEntries,
            setSelectedCalendarEntry,
        }}>
            {children}
        </EventContext.Provider>
    );
}