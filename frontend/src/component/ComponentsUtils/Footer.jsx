import { motion } from "framer-motion";
import React, { useState } from "react";

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
