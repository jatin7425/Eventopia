import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useEvent } from "../../../store/eventContext";
import { useAuth } from "../../../store/auth";
import { axiosInstance } from "../../../lib/axios";
import toast from "react-hot-toast";
import { ArrowDownLeft } from "lucide-react";

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { eventId } = useEvent();
  const { userdata } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [userEvents, setUserEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [event, setEvent] = useState(null);

  const backToselectEvent = () => {
    navigate("/event")
  }

  // Fetch user events
  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        const user = await userdata();
        setUserEvents(user.event || []);

        // If URL has an ID, try to find it in user's events
        if (id) {
          const foundEvent = user.event.find(e => e._id === id);
          if (foundEvent) {
            setSelectedEvent(foundEvent._id);
            getEventData(foundEvent._id);
          } else {
            toast.error("Event not found in your list");
          }
        }
      } catch (error) {
        console.error("Error fetching user events:", error);
        toast.error("Failed to load your events");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserEvents();
  }, [id, userdata]);

  // Fetch event details
  const getEventData = async (eventId) => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.get(`/event/getEventById/${eventId}`);
      setEvent(data);
    } catch (error) {
      console.error('Error fetching event by ID', error);
      toast.error(error.response?.data?.message || 'Error fetching event');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle event selection
  const handleEventSelect = (eventId) => {
    setSelectedEvent(eventId);
    navigate(`/event/${eventId}`);
    getEventData(eventId);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading event details...</p>
        </div>
      </div>
    );
  }

  // Show event selection if no event is selected
  if (!selectedEvent) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#1a1a1a] p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Select an Event</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userEvents.map((event) => (
            <motion.div
              key={event._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
              whileHover={{ y: -5 }}
              onClick={() => handleEventSelect(event._id)}
            >
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{event.name}</h2>
              <p className="text-gray-600 dark:text-gray-300">{event.category}</p>
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                View Details
              </button>
            </motion.div>
          ))}

          {userEvents.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                You don't have any events yet. Create one to get started!
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show event details
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1a1a] dark:text-black text-white">
      {/* Hero Section */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <a href="/event" className="absolute top-4 left-4 cursor-pointer z-10">
          <ArrowDownLeft className="absolute top-4 left-4 cursor-pointer rotate-45" />
        </a>
        {event?.media?.length > 0 ? (
          <img
            src={event.media[0]}
            alt={event.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="bg-gray-200 border-2 border-dashed w-full h-full flex items-center justify-center">
            <span className="text-gray-500">No Image Available</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
          <div className="max-w-4xl w-full mx-auto">
            <motion.h1
              className="text-3xl md:text-4xl font-bold text-white"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {event?.name}
            </motion.h1>
            <div className="flex items-center mt-2 text-white/90">
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>{event?.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Event Details */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Event Details</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date</h3>
                  <p className="text-lg">
                    {event?.date ? new Date(event.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }) : "N/A"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Time</h3>
                  <p className="text-lg">
                    {event?.startTime} - {event?.endTime}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Category
                  </h3>
                  <p className="text-lg">{event?.category}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="text-lg capitalize">
                    <span
                      className={`inline-block w-3 h-3 rounded-full mr-2 ${event?.status === "Upcoming"
                        ? "bg-blue-500"
                        : event?.status === "Ongoing"
                          ? "bg-green-500"
                          : "bg-gray-500"
                        }`}
                    ></span>
                    {event?.status}
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-2">About This Event</h3>
              <p className="text-gray-700">{event?.description}</p>
            </div>

            {/* Calendar Events */}
            {event?.calendar?.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6">Event Schedule</h2>
                <div className="space-y-4">
                  {event.calendar.map((session, index) => (
                    <motion.div
                      key={session._id}
                      className="border-l-4 pl-4 py-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      style={{
                        borderColor: index % 2 === 0 ? "#3B82F6" : "#10B981",
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            {session.startTime} - {session.endTime}
                          </p>
                          <h3 className="text-lg font-semibold">
                            {session.title}
                          </h3>
                          {session.description && (
                            <p className="text-gray-600">{session.description}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;