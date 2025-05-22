import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import ContactUs from "../component/ComponentsUtils/ContactUs.jsx";
import { OchiFooter } from "../component/ComponentsUtils/Footer.jsx";
import { useAuth } from "../store/auth.jsx";
import { ButtonArrow } from "../component/Theme/Button.jsx";
import { NavBar } from "../component/Navbar/NavBar.jsx";
import { MdAddBusiness, MdOutlineSecurity } from "react-icons/md";
import { BsCalendar4Event, BsCameraReels } from "react-icons/bs";
import "locomotive-scroll/dist/locomotive-scroll.css";
import { BiSupport } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa6";
import { motion } from "framer-motion";
import { OchiLoadingScreen } from "../component/ComponentsUtils/LoadingAnimation";
import { useInView } from "react-intersection-observer";
import FoodImg1 from "../assets/FoodImg1.png";
import FoodImg2 from "../assets/FoodImg2.avif";
import FoodImg3 from "../assets/FoodImg3.png";
import FoodImg4 from "../assets/FoodImg4.png";
import FoodImg5 from "../assets/FoodImg16.png";
import HallImg from "../assets/hall.png";
import HallImg2 from "../assets/hall2.png";
import { TypeAnimation } from "react-type-animation";
import SideBar from "../component/Navbar/SideBar.jsx";

function WelcomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [footerRef, footerInView] = useInView({ threshold: 0.2 });

  const { isLoggedin, user } = useAuth();

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  if (isLoading) {
    // return <OchiLoadingScreen />;
  }

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
  return (
    <div className="h-full w-full dark:bg-[#1a1a1a] dark:text-white max-w-[1920px] mx-auto overflow-hidden relative ">
      <div className="h-full w-full bg-[#fdfdfd] dark:bg-[#1a1a1a] dark:text-white text-black text-[15px]">
        <NavBar homeLink="#home" aniDelay={1.6} contactLink="#contact" />
        <SideBar homeLink="#home" contactLink="#contact" />

        <div className="min-h-screen w-full ">
          <LandingSection />
        </div>

        <div className="">
          <section className="h-full w-full mt-10 pb-10 bg-[#e5e5e5] dark:bg-[#1a1a1a]">
            <FeaturesSection />
          </section>

          <div className="min-h-screen w-full  flex justify-center items-center">
            <ClientTestimonial />
          </div>

          <div className="min-h-screen w-full flex justify-center items-center bg-[#e5e5e5] dark:bg-[#1a1a1a]">
            <TeamSection />
          </div>

          <div className="min-h-screen w-full flex justify-center items-center">
            <ContactUs />
          </div>
        </div>

        {/* Footer  */}
        <motion.div
          ref={footerRef}
          initial="hidden"
          animate={footerInView ? "visible" : "hidden"}
          variants={cardVariants2}
          className="h-screen"
        >
          <OchiFooter marginTop={"20"} contactLink="#contact" />
        </motion.div>
      </div>
    </div>
  );
}

export const LandingSection = () => {
  const { isLoggedin, user } = useAuth();
  const paragraphRef = useRef(null);
  const buttonRef = useRef(null);
  const scrollRef = useRef(null);

  const FoodImgCycle = [
    {
      id: 1,
      img: FoodImg1,
    },
    {
      id: 2,
      img: FoodImg2,
    },
    {
      id: 3,
      img: FoodImg3,
    },
    {
      id: 4,
      img: FoodImg4,
    },
    {
      id: 5,
      img: FoodImg5,
    },
    {
      id: 7,
      img: HallImg,
    },
    {
      id: 8,
      img: HallImg2,
    },
  ];

  return (
    <motion.div
      id="home"
      className="dark:bg-[#1a1a1a] dark:text-white relative w-full "
      ref={scrollRef}
    >
      <div className=" sm:px-10 overflow-hidden w-full">
        <motion.div className=" max-w-4xl mx-auto text-center relative z-10 flex items-center flex-col justify-center overflow-hidden ">
          <motion.h1
            className="text-6xl font-extrabold mt-40 mb-10 "
            initial={{ opacity: 1, scale: 0.76, y: 80 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Plan your <span className="text-blue-500">Events</span> <br />
            <motion.span className="animate-words h-[40px] w-screen overflow-hidden inline-block relative align-bottom ">
              <span className="text-4xl">on your Fingertips!</span>
              <span className="text-4xl">with Zero Effort!</span>
              <span className="text-4xl">From Vision to Reality!</span>
              <span className="text-4xl">
                Effortless Elegance, Every Event!
              </span>
              <span className="text-4xl">
                Meetings & Milestones,Stress-Free!
              </span>
            </motion.span>
          </motion.h1>
          <motion.p
            className="text-base font-['Founders_Grotesk_Condensed']"
            ref={paragraphRef}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            "Organize, manage, and execute your events seamlessly with our
            intuitive platform. Whether it's a corporate gathering, a wedding,
            or a festival, we've got you covered from start to finish.
            Experience stress-free planning like never before!"
          </motion.p>
          <div className="">
            <Link
              to={isLoggedin ? "/eventSelection" : "/auth"}
              className="px-6 py-3 rounded-xl transition-all"
            >
              <motion.div
                ref={buttonRef}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <ButtonArrow
                  title={"Get Start today"}
                  textColor={"text-white , dark:text-zinc-100"}
                  bgColor={"bg-blue-600 "}
                  circleBg={"bg-white"}
                  arrrowTextColor={"text-black"}
                />
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Animated Image Carousel */}
      <motion.div className="flex flex-col origin-left justify-center items-center overflow-hidden h-60 ">
        <motion.h1
          className="md:text-2xl text-4xl font-extrabold pb-6 md:!leading-[75px]  "
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.6 }}
        >
          We Collaborated Vendors Near-By You.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1.6 }}
          className="overflow-hidden w-[90%] relative"
        >
          {/* Gradient Overlay - Left */}
          <div className="h-24 w-40 bg-gradient-to-r dark:from-[#1a1a1a] from-white to-transparent absolute left-0 top-0 z-10"/>

          {/* Animated Image Carousel */}
          <motion.div
            className="flex gap-10 whitespace-nowrap "
            animate={{ x: ["0%", "-92%"] }}
            transition={{
              duration: 15,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            {FoodImgCycle.concat(FoodImgCycle)
              .concat(FoodImgCycle)
              .map((img, index) => (
                <div
                  key={index}
                  className="h-20 flex-shrink-0 mx-1 flex items-center dark:bg-white rounded-lg"
                >
                  <img
                    src={img.img}
                    alt="logo"
                    className="w-full h-full px-3 py-2"
                    loading="lazy"
                  />
                </div>
              ))}
          </motion.div>

          {/* Gradient Overlay - Right */}
          <div className="h-24 w-40 bg-gradient-to-l dark:from-[#1a1a1a] from-white to-transparent absolute right-0 top-0 z-10"/>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const FeaturesSection = () => {
  const part2Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);
  const [isFixed, setIsFixed] = useState(false);
  const [isStatic, setIsStatic] = useState(false);
  const [releaseAnimation, setReleaseAnimation] = useState(false);
  const animate = useRef(null);

  const { isLoggedin, user } = useAuth();

  const features = [
    {
      icon: (
        <div className="pr-7 flex">
          <BsCalendar4Event
            size={55}
            className="text-white bg-blue-500 dark:bg-blue-600 p-4 rounded-lg"
          />
        </div>
      ),
      title: "Event Management",
      discription:
        "Create & Manage events Like Family Function, Birthday Party, Wedding, Corporate Event, Festival etc.",
    },
    {
      icon: (
        <div className="pr-7 flex">
          <MdAddBusiness
            size={50}
            className="text-white bg-blue-500 dark:bg-blue-600 p-3 rounded-lg"
          />
        </div>
      ),
      title: "Vendor Partnerships",
      discription:
        "Highlight your strong relationships with reliable vendors, from florists to rental companies, ensuring high-quality services.",
    },
    {
      icon: (
        <div className="pr-7 flex">
          <BiSupport
            size={55}
            className="text-white bg-blue-500 dark:bg-blue-600 p-4 rounded-lg"
          />
        </div>
      ),
      title: "Support",
      discription:
        "Tailor our product to suit your needs 24/7 customer support for all your inquiries.",
    },
    {
      icon: (
        <div className="pr-7 flex">
          <MdOutlineSecurity
            size={55}
            className="text-white bg-blue-500 dark:bg-blue-600 p-4 rounded-lg"
          />
        </div>
      ),
      title: "Security",
      discription: "Your data is protected by the latest security measures.",
    },
    {
      icon: (
        <div className="pr-7 flex">
          <FaRegCommentDots
            size={55}
            className="text-white bg-blue-500 dark:bg-blue-600 p-4 rounded-lg"
          />
        </div>
      ),
      title: "Communication",
      discription:
        "Tailor our product to suit your needs Seamless communication to your Vendor according to your needs.",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const part2Top = part2Ref.current.getBoundingClientRect().top;
      const section3Bottom = section3Ref.current.getBoundingClientRect().bottom;

      if (part2Top <= 80) {
        setIsFixed(true);
        setReleaseAnimation(false);
      } else {
        setIsFixed(false);
        setIsStatic(true);
      }

      if (section3Bottom <= window.innerHeight - 50) {
        setReleaseAnimation(true);
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const featureVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: 100, transition: { duration: 0.5 } },
  };

  return (
    <>
      <section
        id="our-features"
        ref={part2Ref}
        className=" border-zinc-300 pt-10 dark:text-white max-w-7xl flex mx-auto max-md:flex-col max-xl:px-5"
      >
        <div
          ref={section2Ref}
          className={` h-fit max-w-2xl text-start max-md:text-center mx-auto max-xl:w-1/2 `}
        >
          <h2 className="md:text-6xl text-4xl tracking-tight mb-6 max-md:mb-5 w-full ">
            Ensure You Receive{" "}
            <span className="text-blue-500">High-Quality</span> Services
          </h2>
          <p className="max-md:hidden text-xl font-['Founders_Grotesk_Condensed'] max-md:mb-10 ">
            "Organize, manage, and execute your events seamlessly with our
            intuitive platform. Whether it's a corporate gathering, a wedding,
            or a festival, we've got you covered from start to finish.
            Experience stress-free planning like never before!"
          </p>
        </div>

        <motion.div
          ref={section3Ref}
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.2 }} // 'once: false' allows re-triggering on scroll
          className="flex flex-col h-full w-1/2 mx-auto gap-5 max-md:w-full max-md:px-5 "
        >
          {features.map((item, index) => (
            <motion.div
              key={index}
              variants={featureVariants}
              initial="hidden"
              whileInView="visible"
              exit="exit"
              transition={{ delay: index * 0.2 }}
              viewport={{ once: false, amount: 0.2 }} // Ensures it animates when scrolling back
              className="dark:bg-zinc-700 dark:text-white sm:p-6 p-4 flex bg-white rounded-r-md  "
            >
              <div className="dark:text-black">{item.icon}</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="font-['Founders_Grotesk_Condensed']">
                  {item.discription}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </>
  );
};

const ClientTestimonial = () => {
  const testimonial = [
    {
      name: "John Doe",
      image: "https://readymadeui.com/profile_2.webp",
      description: "Founder of Rubik",
      review:
        "The service was amazing. I never had to wait that long for my food. The staff was friendly and attentive, and the delivery was impressively prompt.",
    },
    {
      name: "Jatin Vishwakarma",
      image: "https://readymadeui.com/profile_2.webp",
      description: "Founder of Rubik",
      review:
        "The service was amazing. I never had to wait that long for my food. The staff was friendly and attentive, and the delivery was impressively prompt.",
    },
    {
      name: "Faizal Ahmed",
      image: "https://readymadeui.com/profile_2.webp",
      description: "Founder of Rubik",
      review:
        "The service was amazing. I never had to wait that long for my food. The staff was friendly and attentive, and the delivery was impressively prompt.",
    },
    {
      name: "Paxwa Unknown",
      image: "https://readymadeui.com/profile_2.webp",
      description: "Founder of Rubik",
      review:
        "The service was amazing. I never had to wait that long for my food. The staff was friendly and attentive, and the delivery was impressively prompt.",
    },
    {
      name: "Sujal Unknown",
      image: "https://readymadeui.com/profile_2.webp",
      description: "Founder of Rubik",
      review:
        "The service was amazing. I never had to wait that long for my food. The staff was friendly and attentive, and the delivery was impressively prompt.",
    },
  ];
  // Duplicate the testimonial array to create a seamless loop
  const testimonials = [...testimonial, ...testimonial];

  const scrollRef = useRef(null);

  const scrollRight = () => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.scrollWidth / testimonials.length;
      const maxScrollLeft =
        scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
      if (scrollRef.current.scrollLeft >= maxScrollLeft) {
        scrollRef.current.scrollLeft = 0;
      } else {
        scrollRef.current.scrollBy({ left: cardWidth * 1, behavior: "smooth" });
      }
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.scrollWidth / testimonials.length;
      if (scrollRef.current.scrollLeft <= 0) {
        scrollRef.current.scrollLeft =
          scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
      } else {
        scrollRef.current.scrollBy({
          left: -cardWidth * 1,
          behavior: "smooth",
        });
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      scrollRight();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dark:bg-[#1a1a1a] dark:text-white ">
      <div className=" text-center">
        <h2 className="md:text-4xl text-3xl font-extrabold mb-10 ">
          What our <span className="text-blue-600">Happy Client</span> say
        </h2>
      </div>
      <div className="md:py-16 gap-8 max-w-7xl max-md:max-w-lg mx-auto relative">
        <div className="bg-blue-100 max-w-[80%] max-md:w-[100vw] max-sm:w-full max-xs:w-full h-full w-full inset-0 mx-auto rounded-3xl absolute max-md:hidden"></div>
        <div
          className="flex gap-9 flex-nowrap w-full overflow-x-hidden pl-5  "
          ref={scrollRef}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="w-36 h-full bg-gradient-to-r dark:from-[#1a1a1a] to-[#1a1a1a]/0 absolute left-0 top-0 z-10 max-md:hidden  "></div>
          {testimonials?.map((item, index) => (
            <div
              key={index}
              className="h-auto flex-shrink-0 max-w-96 max-md:max-w-full lg:p-6 p-4 rounded-md mx-auto dark:bg-zinc-600/70 dark:text-white backdrop-blur-xl bg-black/10 relative  max-md:w-[full] "
            >
              <div>
                <img
                  src={item.image}
                  className="w-12 h-12 rounded-full"
                  alt={item.name}
                  loading="lazy"
                />
                <h4 className="whitespace-nowrap font-semibold mt-2">
                  {item.name}
                </h4>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300 font-['Founders_Grotesk_Condensed']">
                  {item.description}
                </p>
              </div>
              <div className="mt-4 font-['Founders_Grotesk_Condensed']">
                <p>{item.review}</p>
              </div>
            </div>
          ))}
          <div className="w-36 h-full bg-gradient-to-l dark:from-[#1a1a1a] to-[#1a1a1a]/0 absolute right-0 top-0 z-10 max-md:hidden"></div>
        </div>
      </div>
    </div>
  );
};

const TeamSection = () => {
  const teamMembers = [
    {
      imgSrc: "https://avatars.githubusercontent.com/u/130290923",
      name: "Jatin Vishwakarma",
      role: "FrontEnd & Backend Developer",
      socials: [
        {
          link: "https://www.instagram.com/__jatin__2002",
          icon: "instagram",
        },
        {
          link: "https://github.com/jatin7425",
          icon: "github",
        },
        {
          link: "https://www.linkedin.com/in/jatin7425",
          icon: "linkedin",
        },
      ],
    },
    {
      imgSrc: "https://avatars.githubusercontent.com/u/200369650",
      name: "Faizal Ahmed",
      role: "FrontEnd & Backend Developer",
      socials: [
        {
          link: "https://www.instagram.com/faizal_noob_",
          icon: "instagram",
        },
        {
          link: "https://github.com/Faizal-16",
          icon: "github",
        },
        {
          link: "https://www.linkedin.com/in/faizal-ahmed-a689052a5/",
          icon: "linkedin",
        },
      ],
    },
  ];

  return (
    <section className="relative py-20 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-blue-500 ">
            Our Creative Team
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto">
            The talented individuals who bring ideas to life with passion and
            innovation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 justify-center">
          {teamMembers.map((member, index) => (
            <FlipTeamCard member={member} key={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FlipTeamCard = ({ member }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="relative h-64 w-full cursor-pointer perspective-1000"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front of Card */}
        <div className="absolute w-full h-full backface-hidden bg-white dark:bg-zinc-800 rounded-xl shadow-lg px-3 py-5 flex flex-col items-center justify-center border border-zinc-200 dark:border-zinc-700">
          <div className="relative mb-4">
            <img
              src={member.imgSrc}
              alt={member.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-zinc-800 shadow-md"
              loading="lazy"
            />
            <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-1.5">
              <div className="bg-white dark:bg-zinc-800 rounded-full p-1">
                <CodeIcon className="h-4 w-4 text-blue-500" />
              </div>
            </div>
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
            {member.name}
          </h3>
          <p className="text-sm text-blue-500 font-medium">{member.role}</p>
          <div className="mt-4 flex space-x-3">
            {member.socials.map((social, i) => (
              <SocialIcon key={i} type={social.icon} link={social.link} />
            ))}
          </div>
        </div>

        {/* Back of Card */}
        <div className="absolute w-full h-full backface-hidden bg-blue-500 rounded-xl shadow-lg px-3 py-5 flex flex-col justify-center rotate-y-180">
          <h3 className="text-xl font-bold text-white mb-2 text-center">
            {member.name}
          </h3>
          <p className="text-blue-100 mb-4 text-center">{member.role}</p>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
            <p className="text-white text-sm">
              Passionate developer with expertise in modern web technologies and
              frameworks.
            </p>
          </div>

          <div className="flex justify-center space-x-4 mt-auto">
            {member.socials.map((social, i) => (
              <a
                key={i}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all duration-300"
              >
                <SocialIcon type={social.icon} whiteMode />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const SocialIcon = ({ type, whiteMode = false, link = "#" }) => {
  const icons = {
    instagram: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 24 24"
        className={whiteMode ? "text-white" : "text-pink-600"}
      >
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    github: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 24 24"
        className={
          whiteMode ? "text-white" : "text-zinc-800 dark:text-zinc-200"
        }
      >
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    linkedin: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 24 24"
        className={whiteMode ? "text-white" : "text-blue-700"}
      >
        <path d="M22.23 0h-20.46c-.974 0-1.77.796-1.77 1.77v20.46c0 .974.796 1.77 1.77 1.77h20.46c.974 0 1.77-.796 1.77-1.77v-20.46c0-.974-.796-1.77-1.77-1.77zm-15.64 20.454h-3.248v-10.89h3.248v10.89zm-1.62-12.419c-1.041 0-1.884-.843-1.884-1.884s.843-1.884 1.884-1.884c1.041 0 1.884.843 1.884 1.884s-.843 1.884-1.884 1.884zm13.72 12.419h-3.248v-5.944c0-1.419-.505-2.386-1.765-2.386-.963 0-1.535.65-1.785 1.278-.092.223-.115.535-.115.849v6.203h-3.248v-10.89h3.248v1.489c.433-.66 1.206-1.6 2.936-1.6 2.14 0 3.742 1.4 3.742 4.409v6.592z" />
      </svg>
    ),
  };

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:scale-110 transition-transform"
    >
      {icons[type]}
    </a>
  );
};

const CodeIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-5 w-5 ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
    />
  </svg>
);

export default WelcomePage;
