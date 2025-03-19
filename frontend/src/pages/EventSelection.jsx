// src/App.js
import React, { useState, useEffect } from "react";
import business from "../assets/bussiness.jpg";
import conference from "../assets/Conference.jpg";
import family from "../assets/Family.jpg";
import travel from "../assets/travel.jpg";
import { FaArrowRight, FaPlus } from "react-icons/fa6";
import { useAuth } from "../store/auth";
import { OchiFooter } from "../component/Footer";
import { BorderAnimaButton, ButtonBtmUp } from "../component/Button";
import gsap from "gsap";
import { NavBar } from "../component/NavBar";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEvent } from "../store/eventContext";

const cardVariants = {
  hidden: { y: 100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.9,
      delay: 0.6,
      ease: "easeOut",
      bounce: 0.4,
    },
  },
};

const cardVariants2 = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      bounce: 0.4,
    },
  },
};

const EventSelection = () => {
  const { isLoggedin, user } = useAuth();

  const [restaurants, setRestaurants] = useState([]);
  const [isRestaurantLoading, setIsRestaurantLoading] = useState(false);
  const [bakeries, setBakeries] = useState([]);
  const [isBakeryLoading, setIsBakeryLoading] = useState(false);
  const [halls, setHalls] = useState([]);
  const [isHallLoading, setIsHallLoading] = useState(false);
  const [decorators, setDecorators] = useState([]);
  const [isDecoratorLoading, setIsDecoratorLoading] = useState(false);
  const [ref, inView] = useInView({ threshold: 0.2 });
  const [footerRef, footerInView] = useInView({ threshold: 0.2 });

  // Fetch all vendors
  const fetchVendors = async (category, page = 1, limit = 10) => {
    let data = [];
    setIsVendorLoading(true);
    try {
      const res = await axiosInstance.get(
        `/vendor/getAllVendors?category=${category}&page=${page}&limit=${limit}`
      );
      data = res.data;
    } catch (error) {
      console.error("Error fetching vendors", error);
      data = [];
    } finally {
      setIsVendorLoading(false);
    }
    return data;
  };

  const cards = [
    {
      link: "familyEvent",
      category: "Family Function",
      title: "The Ultimate Guide for Family Events.",
      img: family,
      alt: "Family Event",
    },
    {
      category: "Conference",
      title: "Live interviews from conference.",
      img: conference,
      alt: "Conference Event",
    },
    {
      category: "Business Meeting",
      title: "Expert business event management services designed.",
      img: business,
      alt: "Business Event",
    },
    {
      category: "Travels",
      title:
        "Comprehensive travel event management services, offering seamless planning.",
      img: travel,
      alt: "Travel Event",
    },
  ];

  const [showCards, setShowCards] = useState(false);

  const [showCreateEventForm, setShowCreateEventForm] = useState(false);

  const handleShowCreateEventForm = () => {
    setShowCreateEventForm(!showCreateEventForm);
  };

  const [category, setCategory] = useState("Family Function");

  return (
    <div className="font-sans overflow-hidden min-h-screen">
      {/* Navbar */}
      <div className="h-20 w-full">
        <NavBar homeLink="/" aniDelay={0.7} />
      </div>

      {showCreateEventForm && (
        <CreateEventForm
          category={category}
          handleShowCreateEventForm={handleShowCreateEventForm}
        />
      )}

      {/* Uncommented Header component */}
      {/* <HomePage/> */}

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="bg-white h-[20vw] overflow-hidden dark:bg-[#1a1a1a]"
      >
        <motion.div className="container mx-auto px-6 py-5 flex flex-col justify-center items-center h-full overflow-hidden">
          <h1 className="text-4xl font-bold mb-6 pt-5 ">
            We Help You To Create Unforgettable Events
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Stay ahead with the latest trends and insights in event management.
          </p>
        </motion.div>
      </motion.section>

      {/* Blog Grid */}
      <section
        ref={ref}
        className="h-full container mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {cards.map((post, index) => (
          <div
            onClick={() => {
              handleShowCreateEventForm();
              setCategory(post.category);
            }}
            key={index}
            className="relative w-full "
          >
            <motion.div
              initial="hidden"
              animate={inView && "visible"}
              variants={cardVariants}
              custom={index}
              className="h-full bg-white dark:bg-zinc-800 shadow-lg dark:shadow-white/10 rounded overflow-hidden group z-[3] my-4"
            >
              <div className="h-48 bg-gray-300">
                <img
                  src={post.img}
                  alt={post.alt}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4 flex flex-col justify-between h-fit">
                <span className="text-sm text-[#6366F1] dark:text-gray-400 font-semibold">
                  {post.category}
                </span>
                <h3 className="text-lg font-bold mt-2">{post.title}</h3>
                <div className="flex items-center  gap-1 mt-2">
                  <div className="group flex items-center justify-center gap-1">
                    <a
                      className="text-xs font-semibold text-zinc-500 dark:text-gray-300 dark:group-hover:text-gray-100 group-hover:text-zinc-700"
                      href=""
                    >
                      <BorderAnimaButton
                        title={"Create Event"}
                        textColor={"text-zinc-700 , dark:text-zinc-400"}
                        borderColor={
                          "border-zinc-400 group-hover:border-zinc-900 dark:group-hover:border-zinc-100 dark:border-zinc-400"
                        }
                        hoverTextColor={
                          "group-hover:text-black , dark:group-hover:text-white dark:text-zinc-300"
                        }
                        h={"h-10"}
                      />
                    </a>
                    <div className="text-zinc-500 mt-[6px] group-hover:text-blue-600 dark:group-hover:text-blue-500 -rotate-45 dark:text-gray-400">
                      <FaArrowRight size={18} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </section>

      {/* Footer */}
      <motion.div
        ref={footerRef}
        initial="hidden"
        animate={footerInView ? "visible" : "hidden"}
        variants={cardVariants2}
        className="w-full h-max border-t-2"
      >
        <OchiFooter marginTop={20} />
      </motion.div>
    </div>
  );
};


import { FaTimes } from "react-icons/fa";

const CreateEventForm = ({ category, handleShowCreateEventForm }) => {
  const { createEvent } = useEvent();
  const [step, setStep] = useState(1); // Step tracker

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    category: category,
    status: "Upcoming",
    budget: "",
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    createEvent(formData);
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="w-full h-full bg-black/60 fixed top-0 left-0 z-50 flex justify-center items-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-lg w-full bg-white dark:bg-zinc-800 shadow-xl rounded-lg p-6 relative"
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-red-500 transition-all"
          onClick={handleShowCreateEventForm}
        >
          <FaTimes className="text-xl" />
        </button>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
          Create <span className="text-blue-600">{category}</span> Event
        </h1>

        {/* Steps Indicator */}
        <div className="flex justify-center items-center mt-4">
          {["Event Info", "Schedule", "Budget"].map((label, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`w-8 h-8 flex items-center justify-center text-sm font-semibold rounded-full ${step === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-700"
                  }`}
              >
                {index + 1}
              </div>
              {index < 2 && <div className="w-8 h-1 bg-gray-400 mx-2"></div>}
            </div>
          ))}
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Step 1: Event Info */}
          {step === 1 && (
            <>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Event Name
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                name="name"
                onChange={handleChange}
                value={formData.name}
                type="text"
                placeholder="Enter event name"
                required
                className="px-4 py-3 rounded-md bg-zinc-200 dark:bg-zinc-700 outline-none w-full text-gray-900 dark:text-white"
              />

              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <motion.textarea
                whileFocus={{ scale: 1.02 }}
                name="description"
                onChange={handleChange}
                value={formData.description}
                placeholder="Enter event description"
                rows="3"
                required
                className="px-4 py-3 rounded-md bg-zinc-200 dark:bg-zinc-700 outline-none w-full text-gray-900 dark:text-white"
              />
            </>
          )}

          {/* Step 2: Schedule */}
          {step === 2 && (
            <>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Event Date
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                name="date"
                onChange={handleChange}
                value={formData.date}
                type="date"
                required
                className="px-4 py-3 rounded-md bg-zinc-200 dark:bg-zinc-700 outline-none w-full text-gray-900 dark:text-white"
              />

              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Start Time
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    name="startTime"
                    onChange={handleChange}
                    value={formData.startTime}
                    type="time"
                    required
                    className="px-4 py-3 rounded-md bg-zinc-200 dark:bg-zinc-700 outline-none w-full text-gray-900 dark:text-white"
                  />
                </div>

                <div className="w-1/2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    End Time
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    name="endTime"
                    onChange={handleChange}
                    value={formData.endTime}
                    type="time"
                    required
                    className="px-4 py-3 rounded-md bg-zinc-200 dark:bg-zinc-700 outline-none w-full text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </>
          )}

          {/* Step 3: Budget */}
          {step === 3 && (
            <>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Location
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                name="location"
                onChange={handleChange}
                value={formData.location}
                type="text"
                placeholder="Location of Event"
                min="0"
                className="px-4 py-3 rounded-md bg-zinc-200 dark:bg-zinc-700 outline-none w-full text-gray-900 dark:text-white"
              />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Budget
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                name="budget"
                onChange={handleChange}
                value={formData.budget}
                type="number"
                placeholder="Enter event budget"
                min="0"
                className="px-4 py-3 rounded-md bg-zinc-200 dark:bg-zinc-700 outline-none w-full text-gray-900 dark:text-white"
              />
            </>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-4">
            {step > 1 && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={prevStep}
                className=""
              >
                <ButtonBtmUp
                  title="Back"
                  bgColor="bg-gray-500"
                  textColor="text-white"
                  hoverBgColor="bg-gray-600"
                  hoverTextColor="text-white"
                  rounded="rounded-lg"
                  w="w-20"
                  h="h-10"
                  p="px-4 "
                  display="max-md:hidden"
                  displayTitle2="md:hidden"
                  title2="+"
                />
              </motion.button>
            )}
            {step < 3 ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={nextStep}
                className=""
              >
                <ButtonBtmUp
                  title="Next"
                  bgColor="bg-blue-600"
                  textColor="text-white"
                  hoverBgColor="bg-blue-700"
                  hoverTextColor="text-white"
                  rounded="rounded-lg"
                  w="w-20"
                  h="h-10"
                  p="px-4 "
                  display="max-md:hidden"
                  displayTitle2="md:hidden"
                  title2="+"
                />
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                className=""
              >
                <ButtonBtmUp
                  title="Submit"
                  bgColor="bg-blue-600"
                  textColor="text-white"
                  hoverBgColor="bg-blue-700"
                  hoverTextColor="text-white"
                  rounded="rounded-lg"
                  w="w-full"
                  h="h-10"
                  p="px-4 "
                  display="max-md:hidden"
                  displayTitle2="md:hidden"
                  title2="+"
                />
              </motion.button>
            )}
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};




export default EventSelection;
