import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import { Link } from "react-router-dom";
import { useEvent } from "../store/eventContext";
import { useAuth } from "../store/auth";
import { ButtonBtmUp } from "./Button";
import VendorProductsComponent from "./Vendor/VendorProductsComponent";
import toast from "react-hot-toast";
import { useEventCart } from "../store/eventCartContext";
import { ShoppingCart, ClipboardList, Users } from "lucide-react";

const EventManager = ({}) => {
  const dropdownRef = useRef(null);
  const { event, getEventById } = useEvent();
  const { user } = useAuth();
  const { cart, setEventId } = useEventCart();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [eventAccodCategory, setEventAccodCategory] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showDescriptionBox, setShowDescriptionBox] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  // console.log(cart)

  const handleIsDescriptionOpen = () => {
    setIsDescriptionOpen(!isDescriptionOpen);
  };

  // Category selection handler
  const handleCategorySelection = (category) => {
    setSelectedCategory(category);
    const filteredEvents = events.filter(
      (event) => event.category === category
    );
    setEventAccodCategory(filteredEvents);
    if (filteredEvents.length > 0) {
      setSelectedEvent(filteredEvents[0]); // Ensure a valid event is selected
    }
    setEventId(selectedEvent?._id);
  };

  // Initialize events & selected event
  useEffect(() => {
    if (user?.event?.length > 0) {
      setEvents(user.event);

      if (!selectedEvent) {
        setSelectedEvent(user.event[0]);
      }

      if (!selectedCategory) {
        setSelectedCategory(user.event[0].category);
      }

      // Extract unique categories only once
      const uniqueCategories = [...new Set(user.event.map((e) => e.category))];
      setCategories(uniqueCategories);
    }
    setEventId(selectedEvent?._id);
  }, [user?.event]);

  useEffect(() => {
    if (user?.event?.length > 0 && selectedCategory) {
      const filteredCategories = user.event
        .filter((item) => item.category === selectedCategory)
        .map((item) => item);

      setEventAccodCategory(filteredCategories);
    }
    setEventId(selectedEvent?._id);
  }, [user?.event, selectedCategory]);

  // Fetch selected event details
  useEffect(() => {
    if (selectedEvent?._id) {
      getEventById(selectedEvent._id);
    }
    setEventId(selectedEvent?._id);
  }, [selectedEvent]);

  // Track cursor position for tooltip
  const handleMouseMove = (e) => {
    setCursorPosition({
      x: e.clientX + 10 + window.scrollX,
      y: e.clientY + 10 + window.scrollY,
    });
  };

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

   const [isDescriptionOpen2, setIsDescriptionOpen2] = useState(false);

   const handleIsDescriptionOpen2 = () => {
     setIsDescriptionOpen2(!isDescriptionOpen2);
   };

  const [attendeesOption, setAttendeesOption] = useState(false);
  const [addTodoOption, setaddTodoOption] = useState(false);
  const [openCartOption, setOpenCartOption] = useState(true);

  const handleAttendeesOption = () => {
    setAttendeesOption(true);
    setaddTodoOption(false);
    setOpenCartOption(false);
  };

  const handleAddTodoOption = () => {
    setaddTodoOption(true);
    setOpenCartOption(false);
    setAttendeesOption(false);
  };

  const handleOpenCartOption = () => {
    setOpenCartOption(true);
    setaddTodoOption(false);
    setAttendeesOption(false);
  };

  return (
    <div
      className="min-w-screen h-fit bg-white dark:bg-[#1a1a1a] dark:text-white"
      onMouseMove={handleMouseMove}
    >
      <header className="w-full h-16 border-b py-4 px-3 mb-4">
        <div className="flex justify-between items-center">
          <div className="w-full max-lg:text-center">
            <h1 className="text-2xl font-bold w-full text-black dark:text-white">
              My Events
            </h1>
          </div>
          <Link
            to="/eventSelection"
            className="whitespace-nowrap cursor-pointer mx-4"
          >
            <ButtonBtmUp
              title="Create Events"
              bgColor="bg-blue-600"
              textColor="text-white"
              hoverBgColor="bg-blue-700"
              hoverTextColor="text-white"
              rounded="rounded-lg"
              w="w-fit"
              h="h-10"
              p="px-4"
              display="max-md:hidden"
              displayTitle2="md:hidden"
              title2="+"
            />
          </Link>
        </div>
      </header>

      {/* --------------------------Event Description------------------------- */}
      <div className="w-full flex max-md:flex-col gap-5 items-center justify-between md:px-10 px-5 pt-10 z-10">
        <div className="h-full">
          <h1 className="text-3xl font-bold">Event Description</h1>
        </div>

        {/* ------------------------Category Dropdown------------------------- */}
        <div
          className="h-full text-end md:w-64 w-full dark:text-black z-[99]"
          ref={dropdownRef}
        >
          <div className="relative md:w-64 w-full mx-auto">
            <button
              className={`w-full flex justify-between items-center px-4 py-2 bg-white dark:bg-zinc-700 
            ${isOpen ? "rounded-t-lg" : "rounded-lg shadow-md"} 
            dark:shadow-zinc-300/20 border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-white`}
              onClick={() => setIsOpen(!isOpen)}
            >
              {selectedEvent?.category || "Select Category"}
              <ChevronDown
                className="w-5 h-5 transition-transform"
                style={{
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute w-full mt-1 bg-white dark:bg-zinc-700 shadow-lg rounded-b-lg border border-gray-300 dark:border-zinc-600 overflow-hidden"
                >
                  {categories.map((category, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 text-center cursor-pointer rounded-r-lg hover:bg-gray-100 dark:hover:bg-zinc-600 text-gray-700 dark:text-white"
                      onClick={() => {
                        handleCategorySelection(category);
                        setIsOpen(false); // Close dropdown after selection
                      }}
                    >
                      {category}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* -----------------------Event Details--------------------- */}
      <div className="min-h-56 h-[20vw] flex pb-4 md:mx-10 mx-5 text-5xl font-bold z-30 overflow-hidden">
        <motion.div
          className="relative text-sm min-h-24 w-full p-2 overflow-x-auto border-2 mt-5 border-gray-300 dark:border-zinc-600 rounded-lg z-30 flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className={
              `sm:max-w-96 w-1/3 min-w-fit max-sm:w-full h-full pr-2 overflow-y-auto flex flex-col gap-2 overflow-hidden ` +
              (isDescriptionOpen2 ? "max-sm:hidden" : "")
            }
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {eventAccodCategory?.map((item) => (
              <motion.div
                key={item._id}
                className={
                  `relative flex items-center justify-between px-5 pl-10 py-2 rounded-lg cursor-pointer z-20 whitespace-nowrap ` +
                  (selectedEvent?._id === item._id
                    ? "bg-zinc-200 dark:bg-zinc-800"
                    : "")
                }
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleIsDescriptionOpen2();
                }}
              >
                <span className="flex-1" onClick={() => setSelectedEvent(item)}>
                  {item?.name || "Unnamed Event"}
                </span>
                <button className="sm:hidden z-50 cursor-pointer">
                  {isDescriptionOpen2 ? "<" : ">"}
                </button>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className={`sm:w-2/3 h-full w-full overflow-hidden bg-zinc-200 dark:bg-zinc-800 rounded-lg flex flex-col sm:justify-center items-center max-sm:${
              !isDescriptionOpen2 && "hidden"
            }`}
            initial={{ opacity: 0, rotateY: -90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button
              className="sm:hidden absolute z-50 top-[10px] right-4 bg-black/50 px-3 py-2 rounded-md"
              onClick={handleIsDescriptionOpen2}
            >
              {isDescriptionOpen2 ? "<" : ">"}
            </button>
            <motion.h1
              className="text-2xl max-sm:py-1 max-sm:bg-zinc-600/50 w-full text-center font-bold"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {selectedEvent?.name || "No Event Selected"}
            </motion.h1>
            <motion.p
              className="text-sm text-gray-500 max-sm:pt-1 dark:text-zinc-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {selectedEvent?.description || "No description provided"}
            </motion.p>
          </motion.div>
        </motion.div>
      </div>

      <div className="h-fit px-6 md:px-10 py-4 space-y-6">
        {/* Top Buttons Section */}
        <div className="flex justify-end items-center gap-3 md:gap-5">
          {/* View Cart Button */}
          <span onClick={handleOpenCartOption}>
            <ButtonBtmUp
              title="View Cart"
              icon={<ShoppingCart size={18} />}
              bgColor="bg-blue-600"
              textColor="text-white"
              hoverBgColor="bg-blue-700"
              rounded="rounded-lg"
              w="w-32"
              h="h-10"
              onClick={() => setOpenCartOption(!openCartOption)}
              
            />
          </span>

          {/* Attendees Button */}
          <span onClick={handleAttendeesOption}>
            <ButtonBtmUp
              title="Attendees"
              icon={<Users size={18} />}
              bgColor="bg-blue-600"
              textColor="text-white"
              hoverBgColor="bg-blue-700"
              activeBgColor="bg-blue-700"
              rounded="rounded-lg"
              w="w-32"
              h="h-10"
              
            />
          </span>

          {/* Todo Button */}
          <span onClick={handleAddTodoOption}>
            <ButtonBtmUp
              title={addTodoOption ? "Close Todo" : "View Todo"}
              icon={<ClipboardList size={18} />}
              bgColor="bg-blue-600"
              textColor="text-white"
              hoverBgColor="bg-blue-700"
              rounded="rounded-lg"
              w="w-32"
              h="h-10"
            />
          </span>
        </div>

        {/* Main Content Section */}

        {attendeesOption && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full h-fit border border-zinc-500 rounded-lg  overflow-hidden"
          >
            <div className="flex max-md:flex-col-reverse items-center justify-between gap-5 ">
              <div className="w-full h-fit flex">
                <div className="w-full min-h-[20vw] bg-zinc-100 dark:bg-zinc-800 border-r px-4 py-2 ">
                  Accept
                </div>
                <div className="w-full min-h-[20vw] bg-zinc-100 dark:bg-zinc-800 border-r px-4 py-2 ">
                  Not Response
                </div>
                <div className="w-full min-h-[20vw] bg-zinc-100 dark:bg-zinc-800 px-4 py-2 ">
                  Decline
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {addTodoOption && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full h-fit"
          >
            <div className="h-full flex max-md:flex-col-reverse items-center justify-between gap-5 md:px-10 px-4 pb-10">
              <TodoList event={event} />
              <TodoForm selectedEvent={selectedEvent} />
            </div>
          </motion.div>
        )}

        {openCartOption && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full h-fit border-t-2 border-zinc-500"
          >
            <hr className="border-gray-300 dark:border-zinc-500" />
            <VendorProductsComponent event={event} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EventManager;
