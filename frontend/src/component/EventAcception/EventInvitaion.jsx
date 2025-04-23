import React, { useEffect, useState } from "react";
import { ButtonArrow } from "../Theme/Button";
import { motion } from "framer-motion";

const EventInvitation = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  const EventDetails = {
    invitedBy: "John Doe",
    eventName: "Birthday Party",
    eventDate: "2023-10-31",
    eventTime: "18:00",
    eventLocation: "123 Party St, Celebration City",
    eventDescription: "Join us for a night of fun and celebration!",
    eventTheme: "space",
    dressCode: "Cosmic Attire",
    rsvpDeadline: "2023-10-25",
    guestsAllowed: 2,
  };

  // Animation for background particles
  const particles = Array(50)
    .fill(0)
    .map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 5 + 2,
      delay: Math.random() * 2,
      duration: Math.random() * 10 + 5,
    }));

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleAccept = () => {
    setIsAccepted(true);
    // Here you would typically send an API call to confirm attendance
  };

  return (
    <div className="relative h-screen w-full overflow-hidden font-['Gilroy'] ">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-zinc-800">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute rounded-full ${
              EventDetails.eventTheme === "space"
                ? "bg-blue-400"
                : "bg-yellow-400"
            }`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.8, 0],
              y: [`${particle.y}%`, `${particle.y - 20}%`],
            }}
            transition={{
              delay: particle.delay,
              duration: particle.duration,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <div className="flex items-center justify-center h-full w-full relative z-10">
        <motion.div
          className="flex flex-col items-center justify-center h-full w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="bg-zinc-700/90  shadow-2xl rounded-xl p-8 max-w-md w-full border border-zinc-600/50"
            initial={{ y: 50, opacity: 0 }}
            animate={isLoaded ? { y: 0, opacity: 1 } : {}}
            transition={{ type: "", stiffness: 100, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
          >
            {!isAccepted ? (
              <>
                <motion.h2
                  className="text-3xl text-zinc-100 font-bold mb-6 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  You're Invited!
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <p className="text-zinc-300 mb-4 text-center">
                    You have been invited by{" "}
                    <span className="font-semibold text-blue-400">
                      {EventDetails.invitedBy}
                    </span>{" "}
                    to the event:
                  </p>

                  <motion.h3
                    className="text-2xl font-['Founders_Grotesk'] text-center text-zinc-100 font-semibold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "", delay: 0.8 }}
                  >
                    {EventDetails.eventName}
                  </motion.h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-blue-400 mr-2"
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
                      <p className="text-zinc-300">
                        {new Date(EventDetails.eventDate).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}{" "}
                        at {EventDetails.eventTime}
                      </p>
                    </div>

                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-blue-400 mr-2"
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
                      <p className="text-zinc-300">
                        {EventDetails.eventLocation}
                      </p>
                    </div>

                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-blue-400 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                      <p className="text-zinc-300">
                        Dress Code: {EventDetails.dressCode}
                      </p>
                    </div>

                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-blue-400 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-zinc-300">
                        RSVP by:{" "}
                        {new Date(EventDetails.rsvpDeadline).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>

                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-blue-400 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <p className="text-zinc-300">
                        {EventDetails.guestsAllowed > 0
                          ? `+${EventDetails.guestsAllowed} guest${
                              EventDetails.guestsAllowed > 1 ? "s" : ""
                            } allowed`
                          : "No additional guests"}
                      </p>
                    </div>
                  </div>

                  <motion.div
                    className="bg-zinc-800/50 p-4 rounded-lg mb-8 border-l-4 border-blue-500"
                    initial={{ x: -20 }}
                    animate={{ x: 0 }}
                    transition={{ delay: 1 }}
                  >
                    <p className="text-zinc-300 italic">
                      {EventDetails.eventDescription}
                    </p>
                  </motion.div>

                  <div className="flex justify-center">
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "", stiffness: 400 }}
                    >
                      <ButtonArrow
                        title={"Accept Invitation"}
                        textColor={"text-white"}
                        bgColor={"bg-blue-600 hover:bg-blue-700"}
                        circleBg={"bg-white"}
                        arrrowTextColor={"text-black"}
                        onClick={handleAccept}
                      />
                    </motion.div>
                  </div>
                </motion.div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="mb-6">
                  <svg
                    className="w-20 h-20 mx-auto text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-zinc-100 mb-4">
                  Invitation Accepted!
                </h3>
                <p className="text-zinc-300 mb-6">
                  Thank you for confirming your attendance. We look forward to
                  seeing you at the event!
                </p>
                <div className="bg-zinc-800/50 p-4 rounded-lg mb-6 border-l-4 border-green-500">
                  <p className="text-zinc-300">
                    <span className="font-semibold text-green-400">
                      Event Details:
                    </span>{" "}
                    {EventDetails.eventName} on{" "}
                    {new Date(EventDetails.eventDate).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
                <p className="text-sm text-zinc-400">
                  A confirmation has been sent to your email.
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default EventInvitation;
