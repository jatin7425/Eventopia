import React, { useState } from "react";
import { motion } from "framer-motion";

const EventDetailsPage = () => {
  // Mock event data - in a real app this would come from props or context
  const [event, setEvent] = useState({
    id: "evt_001",
    title: "Annual Tech Conference 2023",
    organizer: "Tech Innovators Inc.",
    description:
      "Join us for the biggest tech conference of the year featuring cutting-edge technologies and industry leaders.",
    date: "2023-11-15",
    startTime: "09:00",
    endTime: "18:00",
    location: "Convention Center, 123 Tech Street, Silicon Valley",
    image:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    timesheets: [
      {
        id: "ts_001",
        time: "09:00 - 10:00",
        title: "Registration & Breakfast",
        speaker: "",
        description: "",
      },
      {
        id: "ts_002",
        time: "10:00 - 11:00",
        title: "Opening Keynote",
        speaker: "Dr. Sarah Johnson",
        description: "The Future of AI in Business",
      },
      {
        id: "ts_003",
        time: "11:15 - 12:15",
        title: "Panel Discussion",
        speaker: "Industry Leaders",
        description: "Sustainability in Tech",
      },
      {
        id: "ts_004",
        time: "12:15 - 13:30",
        title: "Lunch Break",
        speaker: "",
        description: "",
      },
      {
        id: "ts_005",
        time: "13:30 - 14:30",
        title: "Workshop: Cloud Computing",
        speaker: "Mark Williams",
        description: "Hands-on AWS deployment",
      },
      {
        id: "ts_006",
        time: "14:45 - 15:45",
        title: "Startup Pitch Session",
        speaker: "Various Startups",
        description: "See the next big ideas in tech",
      },
      {
        id: "ts_007",
        time: "16:00 - 17:00",
        title: "Closing Remarks",
        speaker: "CEO Jane Smith",
        description: "Looking ahead to 2024",
      },
    ],
    status: "upcoming", // upcoming, ongoing, completed
    ticketTypes: [
      { id: "tkt_001", name: "General Admission", price: 99, available: true },
      { id: "tkt_002", name: "VIP Pass", price: 249, available: true },
      { id: "tkt_003", name: "Student Pass", price: 49, available: false },
    ],
  });

  const [selectedTicket, setSelectedTicket] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1a1a] dark:text-black text-white">
      {/* Hero Section */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
          <div className="max-w-4xl w-full mx-auto">
            <motion.h1
              className="text-3xl md:text-4xl font-bold text-white"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {event.title}
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
              <span>{event.location}</span>
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
                    {new Date(event.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Time</h3>
                  <p className="text-lg">
                    {event.startTime} - {event.endTime}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Organizer
                  </h3>
                  <p className="text-lg">{event.organizer}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="text-lg capitalize">
                    <span
                      className={`inline-block w-3 h-3 rounded-full mr-2 ${
                        event.status === "upcoming"
                          ? "bg-blue-500"
                          : event.status === "ongoing"
                          ? "bg-green-500"
                          : "bg-gray-500"
                      }`}
                    ></span>
                    {event.status}
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-2">About This Event</h3>
              <p className="text-gray-700">{event.description}</p>
            </div>

            {/* Timesheets */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Event Schedule</h2>
              <div className="space-y-4">
                {event.timesheets.map((session, index) => (
                  <motion.div
                    key={session.id}
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
                          {session.time}
                        </p>
                        <h3 className="text-lg font-semibold">
                          {session.title}
                        </h3>
                        {session.speaker && (
                          <p className="text-gray-600">
                            Speaker: {session.speaker}
                          </p>
                        )}
                      </div>
                      {session.description && (
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          Details
                        </button>
                      )}
                    </div>
                    {session.description && (
                      <p className="text-gray-600 mt-1">
                        {session.description}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
