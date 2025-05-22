// src/App.js
import React, { useState } from "react";
import business from "../assets/bussiness.jpg";
import conference from "../assets/Conference.jpg";
import family from "../assets/Family.jpg";
import travel from "../assets/travel.jpg";
import { FaArrowRight } from "react-icons/fa6";
import { OchiFooter } from "../component/ComponentsUtils/Footer";
import { BorderAnimaButton, ButtonBtmUp } from "../component/Theme/Button";
import { NavBar } from "../component/Navbar/NavBar";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEvent } from "../store/eventContext";
import { FaTimes } from "react-icons/fa";
import SideBar from "../component/Navbar/SideBar";

const cardVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.9,
      ease: "easeOut",
      bounce: 0.4,
    },
  },
};

const footerVariants = {
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
  const [footerRef, footerInView] = useInView({ threshold: 0.2 });
  const [showCreateEventForm, setShowCreateEventForm] = useState(false);
  const [category, setCategory] = useState("Family Function");

  // Fetch all vendors

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
      category: "Concert",
      title:
        "Elevated Live Concert – Comprehensive Concert Planning & Operations",
      img: travel,
      alt: "Travel Event",
    },
  ];

  const handleShowCreateEventForm = () => {
    setShowCreateEventForm(!showCreateEventForm);
  };

  return (
    <div className=" overflow-hidden min-h-screen font-['Founders_Grotesk']">
      {/* Navbar */}
      <div className="h-20 w-full">
        <NavBar homeLink="/" aniDelay={0.7} contactLink="/contactus" />
        <SideBar homeLink="/" contactLink="/contactus" />
      </div>

      {showCreateEventForm && (
        <CreateEventForm
          category={category}
          handleShowCreateEventForm={handleShowCreateEventForm}
        />
      )}

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="bg-white h-[20vw] overflow-hidden dark:bg-[#1a1a1a]"
      >
        <motion.div className="container mx-auto px-6 py-5 flex flex-col justify-center items-center h-full overflow-hidden">
          <h1 className="text-4xl font-bold mb-6 pt-5 ">
            We Help You To{" "}
            <span className="text-blue-500">Create Unforgettable</span> Events
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 font-['Founders_Grotesk_Condensed']">
            Stay ahead with the latest trends and insights in event management.
          </p>
        </motion.div>
      </motion.section>

      {/* Blog Grid */}
      <section className="h-full container mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
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
              whileInView={"visible"}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: false, amount: 0.2 }} // 'once: false' allows re-triggering on scroll
              variants={cardVariants}
              custom={index}
              className="h-full bg-white dark:bg-zinc-800 shadow-lg dark:shadow-white/10 rounded overflow-hidden group z-[3] my-4"
            >
              <div className="h-48 bg-zinc-300">
                <img
                  src={post.img}
                  alt={post.alt}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-4 flex flex-col justify-between h-fit">
                <span className="text-lg -mb-2 text-[#6366F1] dark:text-zinc-400 font-semibold">
                  {post.category}
                </span>
                <h3 className="text-[22px] font-bold mt-4 -mb-2 ">
                  {post.title}
                </h3>
                <div className="flex items-center  gap-1 mt-2">
                  <div className="group flex items-center justify-center gap-1">
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
                    <div className="text-zinc-500 mt-[6px] group-hover:text-blue-600 dark:group-hover:text-blue-500 -rotate-45 dark:text-zinc-400">
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
        variants={footerVariants}
        className="w-full h-max border-t-2 mt-10"
      >
        <OchiFooter marginTop={20} contactLink="/contactus" />
      </motion.div>
    </div>
  );
};

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
          className="absolute top-4 right-4 text-zinc-500 dark:text-zinc-300 hover:text-red-500 transition-all"
          onClick={handleShowCreateEventForm}
        >
          <FaTimes className="text-xl" />
        </button>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-zinc-800 dark:text-white">
          Create <span className="text-blue-600">{category}</span> Event
        </h1>

        {/* Steps Indicator */}
        <div className="flex justify-center items-center mt-4">
          {["Event Info", "Schedule", "Budget"].map((label, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`w-8 h-8 flex items-center justify-center text-md -mb-2 font-semibold rounded-full font-sans ${
                  step === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-300 text-zinc-700"
                }`}
              >
                {index + 1}
              </div>
              {index < 2 && <div className="w-8 h-1 bg-zinc-400 mx-2  "></div>}
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
              <label className="text-md font-medium text-zinc-700 dark:text-zinc-300 -mb-2 ">
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
                className="px-4 py-3 rounded-md bg-zinc-200 dark:bg-zinc-700 outline-none w-full text-zinc-900 dark:text-white"
              />

              <label className="text-md -mb-2 font-medium text-zinc-700 dark:text-zinc-300">
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
                className="px-4 py-3 rounded-md bg-zinc-200 dark:bg-zinc-700 outline-none w-full text-zinc-900 dark:text-white"
              />
            </>
          )}

          {/* Step 2: Schedule */}
          {step === 2 && (
            <>
              <label className="text-md -mb-2 font-medium text-zinc-700 dark:text-zinc-300">
                Event Date
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                name="date"
                onChange={handleChange}
                value={formData.date}
                type="date"
                required
                className="px-4 py-3 rounded-md bg-zinc-200 dark:bg-zinc-700 outline-none w-full text-zinc-900 dark:text-white"
              />

              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="text-md -mb-2 font-medium text-zinc-700 dark:text-zinc-300">
                    Start Time
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    name="startTime"
                    onChange={handleChange}
                    value={formData.startTime}
                    type="time"
                    required
                    className="px-4 py-3 rounded-md bg-zinc-200 dark:bg-zinc-700 outline-none w-full text-zinc-900 dark:text-white"
                  />
                </div>

                <div className="w-1/2">
                  <label className="text-md -mb-2 font-medium text-zinc-700 dark:text-zinc-300">
                    End Time
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    name="endTime"
                    onChange={handleChange}
                    value={formData.endTime}
                    type="time"
                    required
                    className="px-4 py-3 rounded-md bg-zinc-200 dark:bg-zinc-700 outline-none w-full text-zinc-900 dark:text-white"
                  />
                </div>
              </div>
            </>
          )}

          {/* Step 3: Budget */}
          {step === 3 && (
            <>
              <label className="text-md -mb-2 font-medium text-zinc-700 dark:text-zinc-300">
                Location
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                name="location"
                onChange={handleChange}
                value={formData.location}
                type="text"
                placeholder="Enter event location"
                className="px-4 py-3 rounded-md bg-zinc-200 dark:bg-zinc-700 outline-none w-full text-zinc-900 dark:text-white"
              />
              <label className="text-md -mb-2 font-medium text-zinc-700 dark:text-zinc-300">
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
                className="px-4 py-3 rounded-md bg-zinc-200 dark:bg-zinc-700 outline-none w-full text-zinc-900 dark:text-white"
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
                  bgColor="bg-zinc-500"
                  textColor="text-white"
                  hoverBgColor="bg-zinc-600"
                  hoverTextColor="text-white"
                  rounded="rounded-lg"
                  w="w-20"
                  h="h-10"
                  p="px-4 "
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
                />
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                className=""
              >
                <ButtonBtmUp
                  title="Create Event"
                  bgColor="bg-blue-600"
                  textColor="text-white"
                  hoverBgColor="bg-blue-700"
                  hoverTextColor="text-white"
                  rounded="rounded-lg"
                  w="w-full"
                  h="h-10"
                  p="px-4 "
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
