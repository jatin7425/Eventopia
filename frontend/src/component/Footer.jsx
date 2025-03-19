import { motion } from "framer-motion";
import React, { useState } from "react";
import { Link } from "react-router-dom";

export const Footer = ({marginTop = 32}) => {

  
  const [services, setServices] = useState([
    "Event Management",
    "Travel Plannig",
    "Birthday Planning",
    "Family Function Planning",
  ]);

  const [resources, setResources] = useState([
    "Near-By Vendors",
    "Near-By Hotels & Banqute Halls",
    "Management Assistance",
  ]);

  return (
    <footer className={`dark:bg-zinc-800 dark:text-white bg-white px-4 sm:px-10 py-12 mt-${marginTop}`}>
      <div className="grid max-sm:grid-cols-1 max-lg:grid-cols-2 lg:grid-cols-5 lg:gap-14 max-lg:gap-8">
        <div className="lg:col-span-2">
          <h4 className="text-xl font-semibold mb-6">About Us</h4>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
            gravida, mi eu pulvinar cursus, sem elit interdum mauris.
          </p>

          <div className="bg-[#f8f9ff] flex px-4 py-3 rounded-md text-left mt-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 192.904 192.904"
              width="16px"
              className="fill-gray-500 mr-3 rotate-90"
            >
              <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
            </svg>
            <input
              type="email"
              placeholder="Search..."
              className="w-full outline-none bg-transparent text-gray-600 text-[15px]"
            />
          </div>
        </div>

        <div>
          <h4 className="text-xl font-semibold mb-6">Services</h4>
          <ul className="space-y-5">
            {services.map((item, index) => (
              <li className="hover:text-blue-600">{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xl font-semibold mb-6">Resources</h4>
          <ul className="space-y-5">
            {resources.map((item, index) => (
              <li className="hover:text-blue-600">{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xl font-semibold mb-6">About Us</h4>
          <ul className="space-y-5">
            <li>
              <a href="" className="hover:text-blue-600">
                Our Story
              </a>
            </li>
            <li>
              <a href="" className="hover:text-blue-600">
                Mission and Values
              </a>
            </li>
            <li>
              <a href="" className="hover:text-blue-600">
                Team
              </a>
            </li>
            <li>
              <a href="" className="hover:text-blue-600">
                Testimonials
              </a>
            </li>
          </ul>
        </div>
      </div>

      <hr className="my-8" />

      <p className="text-center">
        Copyright © 2023
        <a
          href="https://readymadeui.com/"
          target="_blank"
          className="hover:underline mx-1"
        >
          Ez Event Manage
        </a>
        All Rights Reserved.
      </p>
    </footer>
  );
};

export const OchiFooter = ({marginTop}) => {
  
  return (
    <motion.div
    id="footer"    
     className="w-full h-screen dark:bg-zinc-800 bg-white ">
      <div className="w-full px-[3.5vw] flex items-start max-sm:flex-col max-sm:w-full ">
        <div className="w-1/2 max-sm:hidden max-sm:w-full">
          <h1 className='text-6xl max-lg:text-5xl max-md:text-4xl font-["Founders_Grotesk_Condensed"] font-semibold uppercase pt-20 '>
          Effortless <br /> Event <span className="max-lg:block inline">Planning</span>
          </h1>
        </div>
        <div className="w-1/2 mt-20 max-sm:w-full">
          <h1 className='text-6xl max-lg:text-5xl max-md:text-4xl font-["Founders_Grotesk_Condensed"] font-semibold uppercase '>
            presentations
          </h1>
          <div className="flex items-center justify-between">
            <div className="mt-20">
              <div className="max-md:text-xs">
                S: <br />
                <br />
                Instagram
                <br />
                Behance
                <br />
                Facebook
                <br />
                Linkedin
              </div>{" "}
              <br />
              <div>
                L: <br />
                <br /> 203, Prabhu Vatika,
                <br /> Valsad, Gujarat
              </div>{" "}
              <br />
              <div>
                Char Rasta <br /> Valsad, Gujarat
              </div>{" "}
              <br />
              <div>
                E: <br />
                <br /> eventopia@gmail.com
              </div>
            </div>
            <div>
              M: <br /> <br /> <a href="#home" className="hover:text-blue-500">Home</a> 
              <br /> <a href="/eventSelection" className="hover:text-blue-500">Services</a> 
              <br /> <a href="#our-features" className="hover:text-blue-500">Our Features</a> 
              <br /> <a href="#about-us" className="hover:text-blue-500">About us</a>
              <br /> <a href="#contact" className="hover:text-blue-500">Contact us</a>
              <br />
            </div>
          </div>
        </div>
      </div>
      <div className={`w-full max-sm:w-full ${marginTop} mt-10 max-xs:flex-col max-xs:justify-end h-20 dark:bg-zinc-800 bg-white px-[3.5vw] flex items-center justify-between `}>
        <div className="">
        <h1 className="text-2xl font-semibold font-['Founders_Grotesk_Condensed']">Eventopia</h1>
        </div>

        <div className="flex ">
            <div className="  text-zinc-500">© Eventopia 2025. Legal Terms</div>
        </div>

      </div>
    </motion.div>
  );
};
