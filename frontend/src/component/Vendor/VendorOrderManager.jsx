import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { useVendor } from "../../store/vendorContext";
import { axiosInstance } from "../../lib/axios";

const VendorOrderManager = ({ vendorId }) => {
  const { getVendorOrders } = useVendor();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionStatus, setActionStatus] = useState(null);
  const [showOrderPanel, setShowOrderPanel] = useState(false);
  const [showEventList, setShowEventList] = useState(true);
  const [prodstatus, setProdstatus] = useState([]);

  useEffect(() => {
    async function fetchData() {
      let orders = await getVendorOrders(vendorId);
      if (orders) {
        setEvents(orders);
      }
    }
    fetchData();
  }, []);

  const getDataToRender = (orders) => {
    return orders.map((order) => {
      const modifiedOrder = prodstatus.find((item) => item._id === order._id);
      return modifiedOrder ? { ...order, status: modifiedOrder.status } : order;
    });
  };

  const handleSelectedEvent = (event) => {
    setSelectedEvent(event);
    setActionStatus(null);

    // For mobile views
    if (window.innerWidth < 768) {
      setShowEventList(false);
      setShowOrderPanel(true);
    }
  };

  const handleBackToEvents = () => {
    setShowEventList(true);
    setShowOrderPanel(false);
  };

  const handleOrderAction = (action) => {
    setIsSubmitting(true);
    setActionStatus(null);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setActionStatus(action);
      setTimeout(() => setActionStatus(null), 3000);
    }, 1500);
  };

  const handleOrderResponse = async () => {
    try {
      // Send updates to API
      const res = await axiosInstance.put(selectedEvent.Link, {
        eventID: selectedEvent.eventID,
        orders: prodstatus,
      });

      // Handle successful response
      if (res.data.success) {
        toast.success("Orders updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update orders");
      console.error("Error updating orders:", error);
    }
  };

  // Toggle button handler
  const handleStatusToggle = (orderId, newStatus) => {
    setProdstatus((prevProdstatus) => {
      const index = prevProdstatus.findIndex((item) => item._id === orderId);

      let updatedProdstatus;

      if (index !== -1) {
        // Update the existing one
        updatedProdstatus = [...prevProdstatus];
        updatedProdstatus[index] = {
          ...updatedProdstatus[index],
          status: newStatus,
        };
      } else {
        // Add a new one
        updatedProdstatus = [
          ...prevProdstatus,
          { _id: orderId, status: newStatus },
        ];
      }

      return updatedProdstatus;
    });
  };

  console.log(events);

  return (
    <div className="p-4">
      <motion.h2
        className="text-2xl font-bold mb-6 text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Manage Orders
      </motion.h2>

      <div className="space-y-4">
        {/* Desktop View (lg and above) */}
        <div className="hidden md:flex gap-4 h-[60vh]">
          {/* Events List - Always visible on desktop */}
          <motion.div
            className="bg-zinc-800 w-1/2 rounded-lg overflow-y-auto shadow-lg"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <div className="flex flex-col gap-3 p-4">
              {events.length > 0 ? (
                events.map((event) => (
                  <motion.div
                    key={event.eventID}
                    onClick={() => handleSelectedEvent(event)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`${selectedEvent?.eventID === event.eventID
                      ? "bg-zinc-700 ring-2 ring-blue-500"
                      : "bg-zinc-800 hover:bg-zinc-750"
                      } cursor-pointer p-4 rounded-lg transition-all duration-200 border border-zinc-700`}
                    layout
                  >
                    <h3 className="text-lg font-semibold text-white">
                      {event.eventName}
                    </h3>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <p className="text-sm text-zinc-400">Organiser</p>
                        <p className="text-zinc-300">{event.organiser}</p>
                      </div>
                      <div>
                        <p className="text-sm text-zinc-400">Location</p>
                        <p className="text-zinc-300">{event.location}</p>
                      </div>
                      <div>
                        <p className="text-sm text-zinc-400">Date</p>
                        <p className="text-zinc-300">{event.date}</p>
                      </div>
                      <div>
                        <p className="text-sm text-zinc-400">Time</p>
                        <p className="text-zinc-300">
                          {event.starttime} - {event.endtime}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center p-6 text-zinc-400">
                  No events available
                </div>
              )}
            </div>
          </motion.div>

          {/* Orders Panel - Always visible on desktop */}
          <motion.div
            className="bg-zinc-800 w-1/2 rounded-lg overflow-y-auto shadow-lg"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, type: "spring", delay: 0.1 }}
            layout
          >
            <AnimatePresence mode="wait">
              {selectedEvent ? (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-full flex flex-col"
                >
                  <div className="p-4 border-b border-zinc-700">
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {selectedEvent.eventName}
                    </h3>
                    <p className="text-zinc-400">Order Details</p>
                    <p className="text-zinc-400">
                      Contacts: {selectedEvent.phone} | {selectedEvent.email}
                    </p>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {selectedEvent.orders?.length > 0 ? (
                      getDataToRender(selectedEvent.orders).map((order) => (
                        <motion.div
                          key={order._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-zinc-700 p-4 rounded-lg shadow border border-zinc-600"
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-lg font-medium text-white">
                                {order.name}
                              </h4>
                              <p className="text-zinc-300">
                                ₹{order.price} × {order.totalitems}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-white font-medium">
                                ₹{order.totalPrice}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex justify-between items-center">
                            <span
                              className={`px-2 py-1 rounded text-xs ${order.availability
                                ? "bg-green-800 text-green-200"
                                : "bg-red-800 text-red-200"
                                }`}
                            >
                              {order.availability ? "In Stock" : "Out of Stock"}
                            </span>
                            <div
                              className="flex items-center rounded-full overflow-hidden text-xs border"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {/* Confirm Button */}
                              <button
                                className={`px-3 py-2 text-white transition-all duration-200 active:scale-90 ${order.status === 'confirmed' ? 'bg-green-500' : ''}`}
                                onClick={() => handleStatusToggle(order._id, "confirmed")}
                              >
                                ✔️
                              </button>

                              {/* Middle Button (Pending) */}
                              <div
                                className={`px-6 py-2 border-x border-white flex items-center justify-center transition-all duration-200 active:scale-90 ${order.status === 'pending' ? 'bg-yellow-500' : ''}`}
                                onClick={() => handleStatusToggle(order._id, "pending")}
                              >
                                🕒
                              </div>

                              {/* Decline Button */}
                              <button
                                className={`px-3 py-2 text-white transition-all duration-200 active:scale-90 ${order.status === 'declined' ? 'bg-red-500' : ''}`}
                                onClick={() => handleStatusToggle(order._id, "declined")}
                              >
                                ❌
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center p-6 text-zinc-400">
                        No orders for this event
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-center h-full"
                >
                  <div className="text-center p-6">
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                      className="text-5xl mb-4"
                    >
                      📦
                    </motion.div>
                    <p className="text-zinc-400 text-lg">
                      Select an event to view orders
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Mobile View ) */}
        <div className="md:hidden">
          {/* Events List */}
          <AnimatePresence>
            {showEventList && (
              <motion.div
                className="bg-zinc-800 rounded-lg overflow-y-auto shadow-lg mb-4"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col gap-3 p-4">
                  {events.map((event) => (
                    <motion.div
                      key={event.eventID}
                      onClick={() => handleSelectedEvent(event)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`${selectedEvent?.eventID === event.eventID
                        ? "bg-zinc-700 ring-2 ring-blue-500"
                        : "bg-zinc-800 hover:bg-zinc-750"
                        } cursor-pointer p-4 rounded-lg transition-all duration-200 border border-zinc-700`}
                    >
                      <h3 className="text-lg font-semibold text-white">
                        {event.eventName}
                      </h3>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <p className="text-sm text-zinc-400">Organiser</p>
                          <p className="text-zinc-300">{event.organiser}</p>
                        </div>
                        <div>
                          <p className="text-sm text-zinc-400">Location</p>
                          <p className="text-zinc-300">{event.location}</p>
                        </div>
                        <div>
                          <p className="text-sm text-zinc-400">Date</p>
                          <p className="text-zinc-300">{event.date}</p>
                        </div>
                        <div>
                          <p className="text-sm text-zinc-400">Time</p>
                          <p className="text-zinc-300">
                            {event.starttime} - {event.endtime}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-zinc-400">Contacts</p>
                          <p className="text-zinc-300">{event.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-zinc-400">Email</p>
                          <p className="text-zinc-300">{event.email}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Orders Panel */}
          <AnimatePresence>
            {showOrderPanel && selectedEvent && (
              <motion.div
                className="bg-zinc-800 rounded-lg overflow-y-auto shadow-lg max-h-[75vh]"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-4 border-b border-zinc-700 flex justify-between items-center">
                  <button
                    onClick={handleBackToEvents}
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Back to Events
                  </button>
                  <h3 className="text-xl font-semibold text-white">
                    {selectedEvent.eventName}
                  </h3>
                </div>

                <div className="p-4 space-y-3 overflow-y-auto">
                  {getDataToRender(selectedEvent.orders).map((order) => (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-zinc-700 p-4 rounded-lg shadow border border-zinc-600"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-medium text-white">
                            {order.name}
                          </h4>
                          <p className="text-zinc-300">
                            ₹{order.price} × {order.totalitems}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">
                            ₹{order.totalPrice}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-between items-center">
                        <span
                          className={`px-2 py-1 rounded text-xs ${order.availability
                            ? "bg-green-800 text-green-200"
                            : "bg-red-800 text-red-200"
                            }`}
                        >
                          {order.availability ? "In Stock" : "Out of Stock"}
                        </span>
                        <div
                          className="flex items-center rounded-full overflow-hidden text-xs border"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Confirm Button */}
                          <button
                            className="px-3 py-2 text-white transition-all duration-200 active:scale-90"
                            onClick={() => handleStatusToggle(order._id, "confirmed")}
                          >
                            ✔️
                          </button>

                          {/* Middle Button (Pending) */}
                          <div className="px-4 py-2 border-x border-white flex items-center justify-center transition-all duration-200 active:scale-90">
                            🕒
                          </div>

                          {/* Decline Button */}
                          <button
                            className="px-3 py-2 text-white transition-all duration-200 active:scale-90"
                            onClick={() => handleStatusToggle(order._id, "declined")}
                          >
                            ❌
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order Summary - Shown when event is selected */}
        <AnimatePresence>
          {selectedEvent && (
            <motion.div
              className="bg-zinc-800 rounded-lg p-6 shadow-lg border border-zinc-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Order Summary
                  </h3>
                  <motion.p
                    className="text-2xl font-bold text-white"
                    key={selectedEvent?.totalOrderAmount}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" }}
                  >
                    ₹{selectedEvent?.totalOrderAmount}
                  </motion.p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
                  <AnimatePresence mode="wait">
                    {actionStatus === "confirmed" && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="px-4 py-2 bg-green-800 text-green-200 rounded-lg"
                      >
                        Order Confirmed!
                      </motion.div>
                    )}
                    {actionStatus === "declined" && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="px-4 py-2 bg-red-800 text-red-200 rounded-lg"
                      >
                        Order Declined
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <motion.button
                      className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium disabled:opacity-50 flex-1 whitespace-nowrap"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        handleOrderAction("confirmed");
                        handleOrderResponse();
                      }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting && actionStatus !== "confirmed" ? (
                        <span className="flex items-center justify-center gap-2">
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="inline-block"
                          >
                            ⏳
                          </motion.span>
                          Processing...
                        </span>
                      ) : (
                        "Confirm Order"
                      )}
                    </motion.button>

                    <motion.button
                      className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium disabled:opacity-50 flex-1"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setEvents((prev) =>
                          prev.map((event) =>
                            event.eventID === selectedEvent.eventID
                              ? {
                                ...event,
                                orders: event.orders.map((order) => ({
                                  ...order,
                                  status: "declined",
                                })),
                              }
                              : event
                          )
                        );
                        handleOrderAction("declined");
                        handleOrderResponse();
                      }}
                      disabled={isSubmitting}
                    >
                      Decline Order
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VendorOrderManager;
