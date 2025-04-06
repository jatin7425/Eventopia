import React, { useState, useEffect } from "react";
import { Calendar as BigCalendar, Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { io } from "socket.io-client";

const localizer = momentLocalizer(moment);
const socket = io("http://localhost:5000"); // Connect to Node.js backend

const MyCalendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch initial events from backend
    fetch("http://localhost:5000/events")
      .then((res) => res.json())
      .then((data) => setEvents(data));

    // Listen for real-time event updates
    socket.on("eventUpdated", (newEvent) => {
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    });

    return () => socket.off("eventUpdated");
  }, []);

  const handleSelectSlot = ({ start, end }) => {
    const title = prompt("Enter event title");
    if (title) {
      const newEvent = { title, start, end };
      setEvents([...events, newEvent]);
      socket.emit("addEvent", newEvent); // Send event to backend
    }
  };

  return (
    <div className="rounded-lg p-4 h-[90vh] shadow-md border border-gray-300 dark:border-gray-600">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        className="rounded-lg dark:bg-slate-900 dark:text-white"
      />
    </div>
  );
};

export default MyCalendar;
