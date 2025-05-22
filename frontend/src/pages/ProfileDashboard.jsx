import React, { useEffect, useState, useRef } from "react";
import { FaCoins } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { FaShop } from "react-icons/fa6";
import { BsCalendar4Event } from "react-icons/bs";
import { CgCross, CgHome, CgProfile } from "react-icons/cg";
import { Link, Navigate, useParams } from "react-router-dom";
import { useAuth } from "../store/auth";
import { MdOutlineEventNote } from "react-icons/md";
import { BsFillCalendarDateFill } from "react-icons/bs";
import { ThemeToggle } from "../component/Theme/ToggleTheme";
import ProfileSetting from "../component/ProfileOption/ProfileSetting";
import NotificationPage from "../component/Notiffications/NotificationPage";
import { ButtonBtmUp } from "../component/Theme/Button";
import EventManager from "../component/Events/EventManager";
import SubscriptionAds from "../component/ComponentsUtils/SubscriptionAds";
import { Menu } from "lucide-react";
import VendorProductsComponent from "../component/Vendor/VendorProductsComponent";
import VendorDashboard from "../component/Vendor/VendorDashboard";
import { useNotification } from "../store/notificationContext";


const ProfileDashboard = () => {
  const { user } = useAuth();
  const page = useParams();
  const [selectedSideBarElement, setSelectedSideBarElement] =
    useState("Profile");

  useEffect(() => {
    setSelectedSideBarElement(page.page || "Profile");
  }, [page]);

  const renderCurrentPage = (currentPage) => {
    switch (currentPage) {
      case "profile":
        return <ProfileSetting userData={user} />;
      case "notifications":
        return <NotificationPage />;
      case "home":
        return <Navigate to={"/"} />;


      case "myEvents":
        return (
          <div className="w-full h-full flex flex-col dark:bg-zinc-800">
            <EventManager />
          </div>
        );
      case "myVendors":
        return <VendorDashboard />;
      default:
        return <ProfileSetting userData={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#1a1a1a] flex">
      <Sidebar
        selectedSideBarElement={selectedSideBarElement}
        userData={user}
      />
      <div className="block min-h-screen max-w-64 w-full max-lg:hidden "></div>
      {renderCurrentPage(selectedSideBarElement)}
    </div>
  );
};

const Sidebar = ({ selectedSideBarElement, userData }) => {
  const { notifications } = useNotification();
  const { logout } = useAuth();
  const isOnline = useOnlineStatus();
  const { page } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeIcon, setActiveIcon] = useState(selectedSideBarElement);
  const sidebarRef = useRef(null);

  useEffect(() => {
    setActiveIcon(page);
  }, [page]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const sideBarElements = [
    { link: "home", title: "Home", icon: <CgHome /> },
    { link: "profile", title: "Profile", icon: <CgProfile /> },
    { link: "myEvents", title: "My Events", icon: <BsCalendar4Event /> },
    { link: "myVendors", title: "My Shop", icon: <FaShop /> },
    {
      link: "notifications",
      title: "Notifications",
      icon: <IoMdNotifications />,
    },
  ];

  return (
    <aside
      ref={sidebarRef}
      className={`fixed z-50 top-0 max-w-64 w-full bg-white dark:bg-zinc-800 border-r border-zinc-500 shadow-lg flex flex-col justify-between h-screen transition-transform duration-300 
      ${isSidebarOpen ? "max-lg:translate-x-0" : "max-lg:-translate-x-full"}`}
    >
      <div
        onClick={toggleSidebar}
        className={`flex items-center justify-between px-4 py-2 absolute text-xl top-3 cursor-pointer lg:hidden rounded-full text-white
        ${
          isSidebarOpen
            ? "max-lg:-translate-x-0 right-0 "
            : "max-lg:translate-x-full -right-4 backdrop-blur-md "
        }`}
      >
        {isSidebarOpen ? (
          <CgCross
            size={24}
            className="rotate-45 text-black dark:text-white "
          />
        ) : (
          <Menu size={24} className="text-black dark:text-white" />
        )}
      </div>

      <div className="h-full w-full ">
        <div className="px-3 py-4 border-b border-zinc-200 dark:border-zinc-400">
          <Link to="/" className="flex justify-center items-center ">
            {/* <img src={logo} alt="Logo" className="h-10" loading="lazy" /> */}
            <h1 className="text-3xl font-bold font-['Founders_Grotesk_X'] tracking-widest -mb-2 text-[#DAA520] dark:text-[#DAA520]">
              EVENTOPIA
            </h1>
          </Link>
        </div>
        <hr />
        <nav>
          <ul className="space-y-4 max-lg:space-y-2 mt-4 px-3 py-3">
            {sideBarElements.map((item, index) => (
              <li key={index}>
                <Link
                  onClick={() => setActiveIcon(item.link)}
                  to={`/user/${item.link}`}
                  className={`flex items-center gap-3 py-2 px-4 rounded-lg font-medium transition group 
                    ${
                      activeIcon === item.link
                        ? "bg-blue-700 text-white dark:text-zinc-100"
                        : "text-zinc-700 dark:text-zinc-400 hover:bg-blue-600 hover:text-zinc-100 dark:hover:text-zinc-100"
                    }`}
                >
                  <span
                    className={`text-xl ${
                      activeIcon === item.link
                        ? "text-zinc-100"
                        : "text-zinc-700 dark:text-zinc-400 group-hover:text-white"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="-mb-2 text-lg">{item.title}</span>
                  {item.link === "notifications" && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 pt-1 rounded-full">
                      {notifications?.TotalUnSeenNotification}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="px-3 py-5 border-t border-zinc-200 dark:border-zinc-400">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={userData?.profilePicture}
              alt="User"
              className="w-12 h-12 rounded-full border-2 border-blue-600 mr-3"
              loading="lazy"
            />
            <div>
              <p className="text-zinc-700 dark:text-zinc-300 font-semibold -mb-1 ">
                {userData?.userName || "Loading..."}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 -mb-1 ">
                {isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
        <div onClick={logout}>
          <ButtonBtmUp
            title={"Logout"}
            bgColor={"bg-blue-600"}
            textColor={"text-white"}
            hoverBgColor={"bg-blue-700"}
            hoverTextColor={"text-white"}
            rounded={"rounded-lg"}
            w={"w-full"}
            h={"h-10"}
            m={"mt-2"}
          />
        </div>
      </div>
    </aside>
  );
};

const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
};


export default ProfileDashboard;
