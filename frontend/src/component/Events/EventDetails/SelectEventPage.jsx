import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SelectEventPage = () => {
  // Mock data - in a real app this would come from props or context
  const [events, setEvents] = useState([
    {
      id: "evt_001",
      title: "Annual Tech Conference",
      date: "2023-11-15",
      time: "09:00 - 18:00",
      location: "Convention Center, Silicon Valley",
      organizer: "Tech Innovators Inc.",
      image:
        "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      status: "upcoming",
      unread: true,
    },
    {
      id: "evt_002",
      title: "Product Launch Party",
      date: "2023-12-05",
      time: "19:00 - 23:00",
      location: "Downtown Event Space",
      organizer: "NextGen Products",
      image:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      status: "upcoming",
      unread: false,
    },
    {
      id: "evt_003",
      title: "Team Building Workshop",
      date: "2023-10-20",
      time: "10:00 - 16:00",
      location: "Mountain Resort",
      organizer: "HR Department",
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      status: "past",
      unread: false,
    },
    {
      id: "evt_004",
      title: "Tech Expo",
      date: "2023-09-10",
      time: "09:00 - 18:00",
      location: "Convention Center, Silicon Valley",
      organizer: "Tech Innovators Inc.",
      image:
        "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      status: "past",
      unread: false,
    },
    {
      id: "evt_005",
      title: "Annual Charity Gala",
      date: "2023-11-30",
      time: "18:00 - 23:00",
      location: "Grand Ballroom, City Center",
      organizer: "Charity Organization",
      image:
        "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      status: "upcoming",
      unread: true,
    },
    {
      id: "evt_006",
      title: "Product Launch Party",
      date: "2023-12-05",
      time: "19:00 - 23:00",
      location: "Downtown Event Space",
      organizer: "NextGen Products",
      image:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      status: "upcoming",
      unread: false,
    },
    {
      id: "evt_007",
      title: "Team Building Workshop",
      date: "2023-10-20",
      time: "10:00 - 16:00",
      location: "Mountain Resort",
      organizer: "HR Department",
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      status: "past",
      unread: false,
    },
    {
      id: "evt_008",
      title: "Tech Expo",
      date: "2023-09-10",
      time: "09:00 - 18:00",
      location: "Convention Center, Silicon Valley",
      organizer: "Tech Innovators Inc.",
      image:
        "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      status: "past",
      unread: false,
    },
  ]);

  const [selectedFilter, setSelectedFilter] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = events.filter((event) => {
    // Filter by status
    if (selectedFilter === "upcoming" && event.status !== "upcoming")
      return false;
    if (selectedFilter === "past" && event.status !== "past") return false;

    // Filter by search query
    if (
      searchQuery &&
      !event.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;

    return true;
  });

  const markAsRead = (eventId) => {
    setEvents(
      events.map((event) =>
        event.id === eventId ? { ...event, unread: false } : event
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1a1a] dark:text-white text-black p-4 md:p-8 font-['Gilroy'] ">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            className="text-2xl md:text-3xl font-bold dark:text-white text-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Your Events
          </motion.h1>

          <div className="relative">
            <input
              type="text"
              placeholder="Search events..."
              className="pl-10 pr-4 py-2 border rounded-lg dark:text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Filter Tabs */}
        <motion.div
          className="flex space-x-2 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedFilter === "all"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setSelectedFilter("all")}
          >
            All Events
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedFilter === "upcoming"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setSelectedFilter("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedFilter === "past"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setSelectedFilter("past")}
          >
            Past Events
          </button>
        </motion.div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <AnimatePresence>
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  layout
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  onClick={() => markAsRead(event.id)}
                >
                  <div className="relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                    {event.unread && (
                      <motion.div
                        className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <motion.h3
                        className="text-xl font-bold text-white"
                        whileHover={{ scale: 1.02 }}
                      >
                        {event.title}
                      </motion.h3>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center text-gray-500 mb-3">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                        {" • "}
                        {event.time}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-500 mb-4">
                      <svg
                        className="w-5 h-5 mr-2"
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
                      <span>{event.location}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        By {event.organizer}
                      </span>
                      <motion.button
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          event.status === "upcoming"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {event.status === "upcoming"
                          ? "Upcoming"
                          : "Past Event"}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            className="bg-white rounded-xl shadow-sm p-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No events found
            </h3>
            <p className="text-gray-500">
              {selectedFilter === "all"
                ? "You don't have any events yet"
                : `You don't have any ${selectedFilter} events`}
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default SelectEventPage;
