import React, { useState } from "react";
import { IoMdArrowForward } from "react-icons/io";

export const ButtonArrow = ({
  title,
  textColor,
  bgColor,
  arrowTextColor,
  circleBg,
}) => {
  return (
    <div className="z-[9]">
      <button
        className={`relative flex items-center gap-8 px-7 pt-4 pb-3 pr-[4vw] rounded-full uppercase font-['Founders_Grotesk'] transition-all duration-300 ease-in-out group ${bgColor} ${textColor}`}
      >
        {title}

        {/* Expanding Circle Effect */}
        <div
          className={`hidden md:flex w-2 h-2 -mt-1 absolute right-5 rounded-full transition-all duration-300 ease-in-out will-change-[width,height,transform] ${circleBg} group-hover:w-10 group-hover:h-10 group-hover:right-1.5`}
        ></div>

        {/* Arrow Icon */}
        <IoMdArrowForward
          className={`hidden md:flex text-lg absolute -rotate-45 right-4 top-4 z-[9] transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100 text-black ${arrowTextColor}`}
        />
      </button>
    </div>
  );
};

export const ButtonBtmUp = ({
  title,
  bgColor,
  textColor,
  hoverTextColor,
  hoverBgColor,
  rounded,
  type,
  w,
  h,
  m,
  mTitle,
  p,
  display,
  displayTitle2 = "hidden",
  title2,
}) => {
  return (
    <button
      type={type}
      className={`relative font-serif ${rounded} ${m} ${w} ${h} border-none px-2 pb-[4px] border border-1 font-medium text-lg cursor-pointer overflow-hidden group ${textColor} ${bgColor} ${p}`}
    >
      {/* Hover Background Animation */}
      <span
        className={`absolute inset-0 ${hoverBgColor}  scale-y-0 origin-top transition-transform ease-in-out duration-500 group-hover:scale-y-100 will-change-transform ${mTitle} `}
      ></span>

      {/* Text */}
      <span
        className={`relative z-10 transition-colors ease-in-out duration-500 group-hover:${hoverTextColor} ${display} font-['Founders_Grotesk'] uppercase font-light leading-none text-[1rem] `}
      >
        {title}
      </span>
      <span className={`${displayTitle2}`}>{title2}</span>
    </button>
  );
};

export const BorderAnimaButton = ({
  title,
  bgColor,
  textColor,
  textSize,
  hoverTextColor,
  hoverBgColor,
  borderColor,
  w,
  h,
  icon,
  activeBgColor,
}) => {
  return (
    <div>
      <button
        className={`relative px- py-  font-medium text-lg cursor-pointer overflow-hidden group`}
      >
        <span
          className={`absolute will-change-transform inset-0 border-b-2 ${borderColor} ${activeBgColor} transform scale-x-100 origin-left group-hover:origin-right transition-transform group-hover:duration-500 group-hover:-scale-x-0 will-change-transform `}
        ></span>

        <span
          className={`relative z-10 transition-colors ${hoverBgColor} ${textColor} ${hoverTextColor} text-sm font-sans `}
        >
          {title}
          {icon}
        </span>

        <span
          className={`absolute inset-0 border-b-2 ${borderColor} transform scale-x-0 origin-right group-hover:origin-left transition-transform duration-500 group-hover:delay-300 group-hover:scale-x-100 will-change-transform`}
        ></span>
      </button>
    </div>
  );
};

export const HoverTextButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(false);
    setTimeout(() => {
      setIsHovered(true);
    }, 300);
  };

  return (
    <div className="">
      <button
        onMouseEnter={handleMouseEnter}
        className="relative px-8 py-3 w-56 h-16 bg-black font-medium text-lg cursor-pointer overflow-hidden group rounded-lg shadow-lg"
      >
        <div className="relative w-full h-5 overflow-hidden">
          {/* Blue Span - Moves Up and Stays Hidden */}
          <span
            className={`absolute inset-0 flex items-center justify-center text-white transform  ${
              isHovered ? "transition-transform -translate-y-full ease-linear " : ""
            }`}
          >
            Hello
          </span>

          {/* Red Span - Comes from Bottom and Stays Visible */}
          <span
            className={`absolute inset-0 flex items-center justify-center text-white transform  ${
              isHovered
                ? "transition-transform translate-y-0 ease-linear"
                : "translate-y-full"
            }`}
          >
            Hello
          </span>
        </div>
      </button>
    </div>
  );
};
