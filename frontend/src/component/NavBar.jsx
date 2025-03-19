import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo-nobg.png";
import { useAuth } from "../store/auth.jsx";
import { CgProfile } from "react-icons/cg";
import "locomotive-scroll/dist/locomotive-scroll.css";
import { motion, useAnimation } from "framer-motion";
import { ThemeToggle } from "./ToggleTheme";


export const NavBar = ({ homeLink, aniDelay }) => {
  const { isLoggedin, user } = useAuth();
  const [IsSideBarOpen, setIsSideBarOpen] = useState(false);
  const [IsSideBarBgOpen, setIsSideBarBgOpen] = useState(false);
  const toggleSideBar = () => setIsSideBarOpen(!IsSideBarOpen);
  useEffect(() => {
    if (IsSideBarOpen) {
      setIsSideBarBgOpen(IsSideBarOpen);
    } else {
      setTimeout(() => {
        setIsSideBarBgOpen(IsSideBarOpen);
      }, 150);
    }
  }, [IsSideBarOpen, IsSideBarBgOpen, setIsSideBarBgOpen]);

  const controls = useAnimation();
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState("up");

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && scrollDirection !== "down") {
      setScrollDirection("down");
      controls.start({ y: -100 });
    } else if (currentScrollY < lastScrollY && scrollDirection !== "up") {
      setScrollDirection("up");
      controls.start({ y: 0 });
    }

    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY, scrollDirection, controls]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [menus, setMenus] = useState([
    {
      name: "Home",
      link: "/#home",
    },
    {
      name: "Events",
      link: "/eventSelection",
    },
    {
      name: "Contact",
      link: "#contact",
    },
    {
      name: "About Us",
      link: "#footer",
    },
  ]);

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={controls}
      transition={{ duration: 0.5 }}
      className="w-full fixed z-[999] px-5 py-4 -mt-5 font-['Neue Montreal'] flex items-center justify-between bg-glass md:backdrop-blur-lg"
    >
      <motion.header
        initial={{ y: -150 }}
        animate={{ y: 10 }}
        transition={{ duration: 1, delay: aniDelay }}
        className="w-full bg-transparent text-white py-2">
        <div className="container mx-auto flex justify-between items-center px-6">
          <Link to={"/"} className="max-md:hidden">
            <img src={logo} alt="logo" className="w-20 mr-6  " />
          </Link>
          <nav className="w-full max-md:hidden">
            <ul className="flex space-x-6 w-max m-auto text-black dark:text-white ">
              <li>
                <a href={homeLink} className="hover:text-gray-300">
                  Home
                </a>
              </li>
              <li>
                <Link to="/eventSelection" className="hover:text-gray-300">
                  Events
                </Link>
              </li>
              <li>
                <a href="#contact" className="hover:text-gray-300">
                  Contact
                </a>
              </li>
              <li>
                <a href="#footer" className="hover:text-gray-300">
                  About Us
                </a>
              </li>
            </ul>
          </nav>
          <div className="flex gap-3 ml-auto max-md:hidden">
            <ThemeToggle />
            {isLoggedin ? (
              <Link
                to={"/user/profile"}
                className=" size-12 border-[2px] dark:border-white border-black rounded-full overflow-hidden p-1"
              >
                {user ? (
                  <img
                    src={user?.profilePicture}
                    alt=""
                    className="object-contain h-full w-full "
                  />
                ) : (
                  <CgProfile />
                )}
              </Link>
            ) : (
              <>
                <Link
                  to={"/auth"}
                  className="px-6 py-3 rounded-xl text-white bg-blue-600 transition-all hover:bg-blue-700"
                >
                  Login
                </Link>
                <button
                  button
                  id="toggleOpen"
                  onClick={toggleSideBar}
                  className="lg:hidden ml-7"
                >
                  <svg
                    className="w-7 h-7 fill-black dark:fill-white"
                    fill="#000"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </button>
              </>
            )}
          </div>
          <div className={`w-full max-w-64 min-h-screen md:hidden flex flex-col justify-between fixed top-0 right-0 h-full -mt-1 -mr-5 dark:bg-white/10 bg-black/10 backdrop-blur-xl z-40 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300`}>
            <nav className="w-full">
              <ul className="flex flex-col w-full m-auto text-black dark:text-white  ">
                <div className="flex gap-3 ml-auto p-5 justify-start w-full">
                  <Link to={"/"} className="">
                    <img src={logo} alt="logo" className="w-20 md:mr-6" />
                  </Link>
                </div>
                <hr className="mb-4" />
                {menus.map((menu) => (
                  <li
                    key={menu.name}
                    className="w-full py-3 px-4 h-max text-end hover:bg-gray-500/10 backdrop-blur-sm group"
                    onClick={() => window.location.href = menu.link} // Trigger navigation
                  >
                    <a
                      href={menu.link}
                      className="w-full group-hover:text-gray-300 group-hover:text-lg"
                      onClick={(e) => e.stopPropagation()} // Prevents double execution
                    >
                      {menu.name}
                    </a>
                  </li>

                ))}
              </ul>
            </nav>
            <div className="flex flex-row-reverse gap-3 ml-auto py-2 px-5 justify-between w-full bg-gray-500/10 backdrop-blur-sm ">
              <ThemeToggle />
              {isLoggedin ? (
                <Link
                  to={"/user/profile"}
                  className=" size-12 border-[2px] dark:border-white border-black rounded-full overflow-hidden p-1"
                >
                  {user ? (
                    <img
                      src={user?.profilePicture}
                      alt=""
                      className="object-contain h-full w-full "
                    />
                  ) : (
                    <CgProfile />
                  )}
                </Link>
              ) : (
                <>
                  <Link
                    to={"/auth"}
                    className="px-6 py-3 rounded-xl text-white bg-blue-600 transition-all hover:bg-blue-700"
                  >
                    Login
                  </Link>
                  <button
                    button
                    id="toggleOpen"
                    onClick={toggleSideBar}
                    className="lg:hidden ml-7"
                  >
                    <svg
                      className="w-7 h-7 fill-black dark:fill-white"
                      fill="#000"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
          <button onClick={toggleSidebar} className="text-2xl fixed z-50 top-8 right-2 flex flex-col gap-1 md:hidden">
            <motion.div
              animate={{ rotate: isSidebarOpen ? 45 : 0, y: isSidebarOpen ? 6 : 0 }}
              className="w-7 h-1 bg-black dark:bg-white rounded"
            ></motion.div>
            <motion.div
              animate={{ opacity: isSidebarOpen ? 0 : 1 }}
              className="w-7 h-1 bg-black dark:bg-white rounded"
            ></motion.div>
            <motion.div
              animate={{ rotate: isSidebarOpen ? -45 : 0, y: isSidebarOpen ? -6 : 0 }}
              className="w-7 h-1 bg-black dark:bg-white rounded"
            ></motion.div>
          </button>
        </div>
      </motion.header>
    </motion.div>
  );
};
