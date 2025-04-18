import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import ContactUs from "../component/ComponentsUtils/ContactUs.jsx";
import { OchiFooter } from "../component/ComponentsUtils/Footer.jsx";
import Subscription from "../component/ComponentsUtils/Subscription.jsx";
import { useAuth } from "../store/auth.jsx";
import { ButtonArrow } from "../component/Theme/Button.jsx";
import { NavBar } from "../component/ComponentsUtils/NavBar.jsx";
import { MdAddBusiness, MdOutlineSecurity } from "react-icons/md";
import { BsCalendar4Event, BsCameraReels } from "react-icons/bs";
import logo from "../assets/logo-nobg.png";
import { CgProfile } from "react-icons/cg";
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
    <div className="dark:bg-[#1a1a1a] dark:text-white max-w-[1920px] mx-auto  ">
      <div className="bg-[#f8f9ff] dark:bg-[#1a1a1a] dark:text-white text-black text-[15px]">
        <NavBar homeLink="#home" aniDelay={1.6} />

        {/* 🤖 AI Support Assistant */}
        <motion.div
          initial={{ opacity: 0, y:-10 }}
          animate={{ opacity: 1, y:0 }}
          transition={{ duration: 1, delay:3 }}
          className="fixed z-40 bottom-7 right-7 flex items-center justify-end p-4"
        >
          <div className="shadow-lg rounded-lg bg-white dark:bg-gray-800 transition duration-300">
            {isLoggedin ? (
              <Link to={"/aichatbot"} className="block">
                <button className="px-4 pt-3 pb-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                  <h1 className="text-lg font-bold ">
                    🤖 AI Support Assistant
                  </h1>
                </button>
              </Link>
            ) : (
              <Link to={"/auth"} className="block">
                <button className="px-4 pt-3 pb-1 bg-gray-600 hover:bg-gray-600 text-white rounded-lg">
                  <h1 className="text-lg font-bold ">
                    🤖 AI Support Assistant
                  </h1>
                </button>
              </Link>
            )}
          </div>
        </motion.div>

        <LandingSection />

        <div className="px-4 sm:px-10">
          <section>
            <FeaturesSection />
          </section>

          <ClientTestimonial />

          <Subscription />

          <TeamSection />

          <ContactUs />
        </div>
        <motion.div
          ref={footerRef}
          initial="hidden"
          animate={footerInView ? "visible" : "hidden"}
          variants={cardVariants2}
          className="border-t-2 border-zinc-400 "
        >
          <OchiFooter marginTop={"20"} />
        </motion.div>
      </div>
    </div>
  );
}


const LandingSection = () => {
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
      <div className="px-4 sm:px-10 overflow-hidden w-full">
        <motion.div className="pt-16 max-w-4xl mx-auto text-center relative z-10 flex items-center flex-col justify-center overflow-hidden ">
          <motion.h1
            className="text-6xl font-extrabold mt-40 mb-10 "
            initial={{ opacity: 1, scale: 0.7, y: 60 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Effortless{" "}
            <span className="text-blue-600 dark:text-blue-500 ">
              Event Planning{" "}
            </span>
            at Your Fingertips!
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
        <motion.hr
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="my-5 mt-16 border-gray-300"
        />
        <motion.div className="flex flex-col origin-left justify-center items-center overflow-hidden bg- h-60 rounded-lg ">
          <motion.h1
            className="md:text-2xl text-4xl font-extrabold pb-6 md:!leading-[75px]  "
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.5 }}
          >
            We Collaborated Vendors Near-By You.
          </motion.h1>

          <motion.div 
          initial={{opacity:0}}
          animate={{opacity:1}}
          transition={{duration:2, delay:3.2}}
          className="overflow-hidden w-[90%] relative">
            {/* Gradient Overlay - Left */}
            <div className="h-24 w-40 bg-gradient-to-r dark:from-[#1a1a1a] from-[#F8F9FF] to-transparent absolute left-0 top-0 z-10"></div>

            {/* Animated Image Carousel */}
            <motion.div
              className="flex gap-10 whitespace-nowrap"
              initial={{ x: 0 }}
              animate={{ x: ["0%", "-99.5%"] }}
              transition={{
                duration: 10,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop",
              }}
            >
              {FoodImgCycle
              .concat(FoodImgCycle)
                .concat(FoodImgCycle)
                .map((img, index) => (
                  <div
                    key={index}
                    className="h-20 flex-shrink-0 mx-1 flex items-center"
                  >
                    <img src={img.img} alt="logo" className="w-full h-full" />
                  </div>
                ))}
            </motion.div>

            {/* Gradient Overlay - Right */}
            <div className="h-24 w-40 bg-gradient-to-l dark:from-[#1a1a1a] from-[#F8F9FF] to-transparent absolute right-0 top-0 z-10"></div>
          </motion.div>
        </motion.div>
      </div>
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

  const features = [
    {
      icon: (
        <div className="pr-7 flex">
          <BsCalendar4Event
            size={55}
            className="dark:text-black bg-[#EFF6FF] p-4 rounded-lg"
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
            className="dark:text-black bg-[#EFF6FF] p-3 rounded-lg"
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
            className="dark:text-black bg-[#EFF6FF] p-4 rounded-lg"
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
            className="dark:text-black bg-[#EFF6FF] p-4 rounded-lg"
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
            className="dark:text-black bg-[#EFF6FF] p-4 rounded-lg"
          />
        </div>
      ),
      title: "Communication",
      discription:
        "Tailor our product to suit your needs Seamless communication to your Vendor according to your needs.",
    },
    {
      icon: (
        <div className="pr-7 flex">
          <BsCameraReels
            size={55}
            className="dark:text-black bg-[#EFF6FF] p-4 rounded-lg"
          />
        </div>
      ),
      title: "Photography and Videography",
      discription:
        "Feature your partnerships with professional photographers and videographers to capture special moments.",
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
    exit: { opacity: 0, x: -100, transition: { duration: 0.5 } },
  };

  return (
    <>
      <hr className="border-zinc-400 border w-full mt-10 " />
      <section
        id="our-features"
        ref={part2Ref}
        className="dark:bg-[#1a1a1a] border-zinc-300 pt-10 dark:text-white max-w-7xl flex mx-auto max-md:flex-col"
      >
        <div
          ref={section2Ref}
          className={`pb-16 h-fit max-w-2xl text-start max-md:text-center mx-auto w-1/2  ${
            isFixed ? "sticky top-24" : ""
          } ${releaseAnimation ? "release-animation" : ""}`}
        >
          <h2 className="md:text-4xl text-3xl font-extrabold pb-6 max-md:pb-0  ">
            Our Features
          </h2>
          <p className="pr-16 font-['Founders_Grotesk_Condensed']">
            "Organize, manage, and execute your events seamlessly with our
            intuitive platform. Whether it's a corporate gathering, a wedding,
            or a festival, we've got you covered from start to finish.
            Experience stress-free planning like never before!"
          </p>
        </div>

        <motion.div
          ref={section3Ref}
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.2 }} // 'once: false' allows re-triggering on scroll
          className="flex flex-col h-fit w-1/2 mx-auto gap-5 max-md:w-full"
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
              className="dark:bg-zinc-800 dark:text-white sm:p-6 p-4 flex bg-white rounded-r-md border-r border-b border-zinc-600 shadow-[0_14px_40px_-11px_rgba(93,96,127,0.2)]"
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
    <div className="dark:bg-[#1a1a1a]  dark:text-white mt-32">
      <div className="pb-16 text-center">
        <h2 className="md:text-4xl text-3xl font-extrabold">
          What our happy client say
        </h2>
      </div>
      <div className="md:py-16 gap-8 max-w-7xl max-md:max-w-lg mx-auto relative">
        <div className="bg-blue-100 max-w-[80%] max-md:w-[100vw] max-sm:w-full max-xs:w-full h-full w-full inset-0 mx-auto rounded-3xl absolute max-md:hidden"></div>
        <div
          className="flex gap-9 flex-nowrap w-full overflow-x-hidden pl-5"
          ref={scrollRef}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="w-36 h-full bg-gradient-to-r dark:from-[#1a1a1a] to-[#1a1a1a]/0 absolute left-0 top-0 z-10 max-md:hidden"></div>
          {testimonials?.map((item, index) => (
            <div
              key={index}
              className="h-auto flex-shrink-0 max-w-96 max-md:max-w-full lg:p-6 p-4 rounded-md mx-auto dark:bg-zinc-600/70 dark:text-white backdrop-blur-xl bg-black/10 relative max-md:shadow-md max-md:w-[full] "
            >
              <div>
                <img
                  src={item.image}
                  className="w-12 h-12 rounded-full"
                  alt={item.name}
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
      imgSrc: "https://readymadeui.com/team-1.webp",
      name: "Jatin Vishwakarma",
      role: "FrontEnd & Backend Developer",
      socials: [
        {
          link: "https://facebook.com",
          svg: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="text-gray-600 hover:text-blue-600"
              viewBox="0 0 24 24"
            >
              <path d="M22.675 0h-21.35c-.733 0-1.325.592-1.325 1.325v21.351c0 .732.592 1.324 1.325 1.324h11.49v-9.294h-3.128v-3.622h3.128v-2.672c0-3.1 1.893-4.787 4.656-4.787 1.325 0 2.464.099 2.794.143v3.24h-1.918c-1.504 0-1.794.715-1.794 1.763v2.313h3.588l-.467 3.622h-3.121v9.293h6.116c.733 0 1.325-.592 1.325-1.325v-21.35c0-.733-.592-1.325-1.325-1.325z" />
            </svg>
          ),
        },
        {
          link: "https://twitter.com",
          svg: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="text-gray-600 hover:text-blue-400"
              viewBox="0 0 24 24"
            >
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.723-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-2.72 0-4.926 2.206-4.926 4.927 0 .386.043.762.128 1.124-4.094-.205-7.725-2.165-10.162-5.144-.425.729-.667 1.577-.667 2.476 0 1.709.869 3.216 2.191 4.099-.807-.026-1.566-.247-2.23-.616v.062c0 2.385 1.697 4.374 3.946 4.828-.413.111-.849.171-1.296.171-.317 0-.626-.031-.928-.088.627 1.956 2.444 3.381 4.6 3.421-1.683 1.319-3.808 2.105-6.115 2.105-.398 0-.79-.023-1.175-.068 2.179 1.396 4.768 2.211 7.548 2.211 9.057 0 14.01-7.504 14.01-14.008 0-.213-.005-.426-.015-.637.961-.694 1.8-1.56 2.462-2.548l-.047-.02z" />
            </svg>
          ),
        },
        {
          link: "https://linkedin.com",
          svg: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="text-gray-600 hover:text-blue-700"
              viewBox="0 0 24 24"
            >
              <path d="M22.23 0h-20.46c-.974 0-1.77.796-1.77 1.77v20.46c0 .974.796 1.77 1.77 1.77h20.46c.974 0 1.77-.796 1.77-1.77v-20.46c0-.974-.796-1.77-1.77-1.77zm-15.64 20.454h-3.248v-10.89h3.248v10.89zm-1.62-12.419c-1.041 0-1.884-.843-1.884-1.884s.843-1.884 1.884-1.884c1.041 0 1.884.843 1.884 1.884s-.843 1.884-1.884 1.884zm13.72 12.419h-3.248v-5.944c0-1.419-.505-2.386-1.765-2.386-.963 0-1.535.65-1.785 1.278-.092.223-.115.535-.115.849v6.203h-3.248v-10.89h3.248v1.489c.433-.66 1.206-1.6 2.936-1.6 2.14 0 3.742 1.4 3.742 4.409v6.592z" />
            </svg>
          ),
        },
      ],
    },
    {
      imgSrc: "https://readymadeui.com/team-2.webp",
      name: "Faizal Ahmed",
      role: "FrontEnd & Backend Developer",
      socials: [
        {
          link: "https://facebook.com",
          svg: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="text-gray-600 hover:text-blue-600"
              viewBox="0 0 24 24"
            >
              <path d="M22.675 0h-21.35c-.733 0-1.325.592-1.325 1.325v21.351c0 .732.592 1.324 1.325 1.324h11.49v-9.294h-3.128v-3.622h3.128v-2.672c0-3.1 1.893-4.787 4.656-4.787 1.325 0 2.464.099 2.794.143v3.24h-1.918c-1.504 0-1.794.715-1.794 1.763v2.313h3.588l-.467 3.622h-3.121v9.293h6.116c.733 0 1.325-.592 1.325-1.325v-21.35c0-.733-.592-1.325-1.325-1.325z" />
            </svg>
          ),
        },
        {
          link: "https://twitter.com",
          svg: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="text-gray-600 hover:text-blue-400"
              viewBox="0 0 24 24"
            >
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.723-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-2.72 0-4.926 2.206-4.926 4.927 0 .386.043.762.128 1.124-4.094-.205-7.725-2.165-10.162-5.144-.425.729-.667 1.577-.667 2.476 0 1.709.869 3.216 2.191 4.099-.807-.026-1.566-.247-2.23-.616v.062c0 2.385 1.697 4.374 3.946 4.828-.413.111-.849.171-1.296.171-.317 0-.626-.031-.928-.088.627 1.956 2.444 3.381 4.6 3.421-1.683 1.319-3.808 2.105-6.115 2.105-.398 0-.79-.023-1.175-.068 2.179 1.396 4.768 2.211 7.548 2.211 9.057 0 14.01-7.504 14.01-14.008 0-.213-.005-.426-.015-.637.961-.694 1.8-1.56 2.462-2.548l-.047-.02z" />
            </svg>
          ),
        },
        {
          link: "https://linkedin.com",
          svg: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="text-gray-600 hover:text-blue-700"
              viewBox="0 0 24 24"
            >
              <path d="M22.23 0h-20.46c-.974 0-1.77.796-1.77 1.77v20.46c0 .974.796 1.77 1.77 1.77h20.46c.974 0 1.77-.796 1.77-1.77v-20.46c0-.974-.796-1.77-1.77-1.77zm-15.64 20.454h-3.248v-10.89h3.248v10.89zm-1.62-12.419c-1.041 0-1.884-.843-1.884-1.884s.843-1.884 1.884-1.884c1.041 0 1.884.843 1.884 1.884s-.843 1.884-1.884 1.884zm13.72 12.419h-3.248v-5.944c0-1.419-.505-2.386-1.765-2.386-.963 0-1.535.65-1.785 1.278-.092.223-.115.535-.115.849v6.203h-3.248v-10.89h3.248v1.489c.433-.66 1.206-1.6 2.936-1.6 2.14 0 3.742 1.4 3.742 4.409v6.592z" />
            </svg>
          ),
        },
      ],
    },
    ,
  ];

  return (
    <section className="dark:bg-[#1a1a1a] mt-36 py-10 rounded-md dark:text-white my-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold">Meet our team</h2>
          <p className="mt-4 text-zinc-400">
            Meet our team of professionals to serve you.
          </p>
        </div>
        <div className="flex items-center justify-center max-sm:flex-col max-sm:gap-20 gap-8 pt-16">
          {teamMembers.map((member, index) => (
            <TeamCard member={member} key={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const TeamCard = ({ member }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    const { width, height, left, top } =
      event.currentTarget.getBoundingClientRect();

    const x = (clientX - left) / width;
    const y = (clientY - top) / height;

    setRotate({
      x: (y - 0.5) * 40,
      y: (x - 0.5) * -40,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      className={`dark:bg-zinc-800 dark:text-white bg-white rounded-lg shadow-lg dark:shadow-zinc-600 p-6 transition-transform duration-300 ${
        isHovered ? "hover:shadow-xl" : "hover:shadow-lg"
      }`}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: "transform 0.3s",
      }}
      onMouseMove={(event) => {
        handleMouseMove(event);
        setIsHovered(true);
      }}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={member.imgSrc}
        alt={`${member.name} profile`}
        className="w-32 h-32 rounded-full mx-auto -mt-16 border-4 border-white shadow-md"
      />
      <div className="text-center mt-6">
        <h4 className="text-lg font-semibold">{member.name}</h4>
        <p className="text-sm text-gray-400 font-['Founders_Grotesk_Condensed']">
          {member.role}
        </p>
        <div className="flex justify-center space-x-4 mt-4">
          {member.socials?.map((social, i) => (
            <a
              key={i}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              className="dark:bg-zinc-100 p-2 dark:text-white w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition"
            >
              {social.svg}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
