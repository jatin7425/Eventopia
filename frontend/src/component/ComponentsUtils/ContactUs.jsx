import React, { useState, useEffect } from "react";
import { ButtonArrow } from "../Theme/Button";
import { motion } from "framer-motion";
import { usecontact } from "../../store/contactContext";
import toast from "react-hot-toast";

const ContactUs = () => {
  const { contactResponse, createContact } = usecontact();
  const [isFixed, setIsFixed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsFixed(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.target);
      const data = Object.fromEntries(formData.entries());
      await createContact(data);
      event.target.reset();
      toast.success("Message sent successfully!");
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      id="contact"
      className="dark:bg-[#1a1a1a] px-4 sm:px-8 h-full w-full"
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 dark:bg-zinc-800/90 bg-white/90 backdrop-blur-sm p-6 sm:p-10 rounded-xl shadow-lg gap-8 lg:gap-12">
          <div className="flex flex-col items-start gap-6">
            <h1 className="text-3xl md:text-4xl font-extrabold bg-blue-600  bg-clip-text text-transparent">
              Let's Talk
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Have some big idea or brand to develop and need help? Then reach
              out we'd love to hear about your project and provide help.
            </p>

            <div className="mt-4 w-full">
              <h2 className="text-xl font-semibold dark:text-white mb-4">
                Contact Information
              </h2>
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-zinc-700 rounded-lg">
                <div className="bg-blue-100 dark:bg-blue-900/50 h-12 w-12 rounded-full flex items-center justify-center shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20px"
                    height="20px"
                    fill="currentColor"
                    className="text-blue-600 dark:text-blue-400"
                    viewBox="0 0 479.058 479.058"
                  >
                    <path d="M434.146 59.882H44.912C20.146 59.882 0 80.028 0 104.794v269.47c0 24.766 20.146 44.912 44.912 44.912h389.234c24.766 0 44.912-20.146 44.912-44.912v-269.47c0-24.766-20.146-44.912-44.912-44.912zm0 29.941c2.034 0 3.969.422 5.738 1.159L239.529 264.631 39.173 90.982a14.902 14.902 0 0 1 5.738-1.159zm0 299.411H44.912c-8.26 0-14.971-6.71-14.971-14.971V122.615l199.778 173.141c2.822 2.441 6.316 3.655 9.81 3.655s6.988-1.213 9.81-3.655l199.778-173.141v251.649c-.001 8.26-6.711 14.97-14.971 14.97z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Email us at
                  </p>
                  <a
                    href="mailto:eventopia959@gmail.com"
                    className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                  >
                    eventopia959@gmail.com
                  </a>
                </div>
              </div>
            </div>

            
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Your Name"
                className="w-full rounded-lg py-3 px-4 bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Your Email"
                className="w-full rounded-lg py-3 px-4 bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="sr-only">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Your Message"
                rows="5"
                className="w-full rounded-lg py-3 px-4 bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              ></textarea>
            </div>
            <ButtonArrow
              type="submit"
              title={isSubmitting ? "Sending..." : "Submit"}
              textColor={"text-white dark:text-zinc-100"}
              bgColor={"bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-800"}
              circleBg={"bg-white"}
              arrrowTextColor={"text-black"}
              disabled={isSubmitting}
            />
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactUs;
