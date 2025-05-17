import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../store/auth";
import { useEvent } from "../../store/eventContext"; 
import {useEventCart} from "../../store/eventCartContext"

const CartComponent = () => {
  const [products, setProducts] = useState([]); // Ensure products is always an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dropdownRef = useRef(null);
  const { event, getEventById } = useEvent();
  const { user } = useAuth();
  const { eventId, setEventId } = useEventCart();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [eventAccodCategory, setEventAccodCategory] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  // Fetch cart items
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`/${eventId}/cart/`);
        setProducts(response.data?.cart || []);
        console.log(response.data?.cart);
      } catch (err) {
        console.error("Error fetching cart data:", err);
        setError("Failed to load cart data");
      } finally {
        setLoading(false);
      }
    })();
  }, [eventId]);

  // Category selection handler
  const handleCategorySelection = (category) => {
    setSelectedCategory(category);
    const filteredEvents = events.filter(
      (event) => event.category === category
    );
    setEventAccodCategory(filteredEvents);

    if (filteredEvents.length > 0) {
      setSelectedEvent(filteredEvents[0]);
      setEventId(filteredEvents[0]._id);
    }
  };

  // Initialize events & selected event
  useEffect(() => {
    if (user?.event?.length > 0) {
      setEvents(user.event);

      const firstEvent = user.event[0];

      if (!selectedEvent) {
        setSelectedEvent(firstEvent);
        setEventId(firstEvent._id);
      }

      if (!selectedCategory) {
        setSelectedCategory(firstEvent.category);
      }

      // Extract unique categories
      const uniqueCategories = [...new Set(user.event.map((e) => e.category))];
      setCategories(uniqueCategories);
    }
  }, [user?.event]);

  useEffect(() => {
    if (user?.event?.length > 0 && selectedCategory) {
      const filteredCategories = user.event.filter(
        (item) => item.category === selectedCategory
      );
      setEventAccodCategory(filteredCategories);

      if (!selectedEvent && filteredCategories.length > 0) {
        setSelectedEvent(filteredCategories[0]);
        setEventId(filteredCategories[0]._id);
      }
    }
  }, [user?.event, selectedCategory]);

  // Fetch selected event details
  useEffect(() => {
    if (selectedEvent?._id) {
      getEventById(selectedEvent._id);
      setEventId(selectedEvent._id);
    }
  }, [selectedEvent]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-5">
        <div className="text-2xl">
          Cart of Event: {selectedEvent?.name || "Birthday"}
        </div>
        <Link
          to={"/vendorCollection"}
          className="bg-blue-600 px-3 py-2 rounded-lg text-white"
        >
          Add more items
        </Link>
      </div>

      {/* Loading & Error Handling */}
      {loading ? (
        <p className="text-gray-500 text-center">Loading cart...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="px-5 py-2 border-t">
          <div>Products ({products.length})</div>
          <div>
            {products.length > 0 ? (
              products.map((cartItem, index) => (
                <div
                  key={index}
                  className="border p-3 my-2 flex items-center space-x-4"
                >
                  <img
                    src={cartItem?.product?.productImage || "placeholder.jpg"}
                    alt={cartItem?.product?.productName || "Product"}
                    className="w-20 h-20 object-cover"
                    loading="lazy"
                  />
                  <div>
                    <h3 className="font-bold">
                      {cartItem?.product?.productName || "No Name"}
                    </h3>
                    <p>
                      {cartItem?.product?.productDescription ||
                        "No description available"}
                    </p>
                    <p className="text-green-600 font-semibold">
                      Price: ${cartItem?.product?.productPrice || "N/A"}
                    </p>
                    <p>Quantity: {cartItem?.quantity || 0}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No items in the cart</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartComponent;
