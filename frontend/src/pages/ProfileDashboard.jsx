import React, { useEffect, useState, useRef } from "react";
import { FaHourglassHalf, FaCoins } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { FaShop } from "react-icons/fa6";
import { BsCalendar4Event } from "react-icons/bs";
import { CgCross, CgHome, CgProfile } from "react-icons/cg";
import { Link, Navigate, useParams } from "react-router-dom";
import { useAuth } from "../store/auth";
import { MdOutlineEventNote } from "react-icons/md";
import { BsFillCalendarDateFill } from "react-icons/bs";
import { ThemeToggle } from "../component/ToggleTheme";
import ProfileSetting from "../component/ProfileSetting";
import NotificationPage from "../component/NotificationPage";
import VendorDashboard from "../component/VendorDashboard";
import { ButtonBtmUp } from "../component/Button";
import { Cross, Menu } from "lucide-react";
import EventManager from "../component/EventManager";
import logo from "../assets/logo-nobg.png";
import SubscriptionAds from "../component/SubscriptionAds";


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
      case "dashboard":
        return (
          <main className="flex-1 p-6 space-y-6 ">
            <Header userData={user} />
            <ProfileStats userData={user} />
            <div className="">
              <ShopSummary userData={user} />
              {/* <Inventory userData={user} /> */}
            </div>
          </main>
        );

      case "myEvents":
        return (
          <div className="w-full h-screen flex flex-col dark:bg-zinc-800">
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
    { link: "dashboard", title: "Dashboard", icon: <FaHourglassHalf /> },
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
        {!isSidebarOpen ? (
          <Menu size={24} className="text-black dark:text-white" />
        ) : (
          <CgCross
            size={24}
            className="rotate-45 text-black dark:text-white "
          />
        )}
      </div>

      <div className=" ">
        <div className="px-3 py-4 border-b border-zinc-200 dark:border-zinc-400">
          <Link to="/" className="flex justify-start items-center ">
            {/* <img src={logo} alt="Logo" className="h-10" /> */}
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
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      3
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div>
        <SubscriptionAds />
      </div>

      <div className="px-3 py-5 border-t border-zinc-200 dark:border-zinc-400">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={userData?.profilePicture}
              alt="User"
              className="w-12 h-12 rounded-full border-2 border-blue-600 mr-3"
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

const Header = ({ userData }) => {
  const isOnline = useOnlineStatus();
  return (
    <header className="flex max-sm:flex-col-reverse gap-4 items-center mb-8 bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md">
      {/* User Info Section */}
      <div className="flex space-x-4 items-center gap-4">
        {/* Profile Icon */}
        <div className="relative h-full aspect-square">
          <img
            src={userData?.profilePicture}
            alt="Profile"
            className="size-20 rounded-full border-2 border-blue-600"
          />
          <span
            className={`absolute bottom-1 right-2 w-3 h-3 ${
              isOnline ? "bg-green-500" : "bg-red-500"
            }  border-2 border-zinc-700 dark:border-white rounded-full`}
          ></span>
        </div>
      </div>
      <div>
        <h1 className="text-3xl -mb-2 font-bold text-zinc-800 dark:text-white">
          {userData?.fullName}
        </h1>
        <p className="text-md -mb-2 text-zinc-600 dark:text-zinc-400">
          @{userData?.userName}
        </p>
        {/* <div className="mt-2 flex items-center">
          <div className="bg-gray-200 w-40 h-2 rounded-full overflow-hidden mr-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: "60%" }}
            ></div>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">3000 / 8000 XP</p>
        </div> */}
      </div>
    </header>
  );
};

const ProfileStats = () => {
  return (
    <section className="grid grid-cols-3 gap-6 mb-8 bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg">
      {/* Game Wins */}
      <div className="text-center">
        <div className="bg-blue-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto shadow-sm">
          <span className="material-icons text-blue-600 text-4xl">
            <MdOutlineEventNote />
          </span>
        </div>
        <p className="text-3xl font-bold text-blue-500 mt-4">27</p>
        <p className="text-zinc-600 dark:text-zinc-400">Total Event</p>
      </div>

      {/* Highest Score */}
      <div className="text-center">
        <div className="bg-green-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto shadow-sm">
          <span className="material-icons text-green-600 text-4xl">
            <FaCoins />
          </span>
        </div>
        <p className="text-3xl font-bold text-green-600 mt-4">910</p>
        <p className="text-zinc-600 dark:text-zinc-400">EZ Coins</p>
      </div>

      {/* Correct Answers */}
      <div className="text-center">
        <div className="bg-yellow-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto shadow-sm">
          <span className="material-icons text-yellow-600 text-4xl">
            <BsFillCalendarDateFill />
          </span>
        </div>
        <p className="text-3xl font-bold text-yellow-600 mt-4">2</p>
        <p className="text-zinc-600 dark:text-zinc-400">Upcoming event</p>
      </div>
    </section>
  );
};

const ShopSummary = () => {
  // Sample achievement data

  const [ShopSummary, setShopSummary] = useState([]);

  return (
    <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-zinc-700 dark:text-zinc-300 mb-6">
        Shop - Summary
      </h2>
      <div className="grid grid-cols-3 gap-6">
        {ShopSummary.length > 0 ? (
          ShopSummary.map((achievement, index) => (
            <div className="text-center" key={index}>
              {/* Icon with unique background */}
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-md ${
                  index === 0
                    ? "bg-blue-100 text-blue-600"
                    : index === 1
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                <span className="material-icons text-3xl">
                  {achievement.icon}
                </span>
              </div>
              {/* Achievement name */}
              <p className="mt-4 text-lg font-semibold text-zinc-700">
                {achievement.name}
              </p>
              {/* Achievement description */}
              <p className="mt-2 text-sm text-zinc-500">
                {achievement.description}
              </p>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full col-start-1 col-end-4 p-4">
            <h3 className="my-5 font-['Founders_Grotesk_Condensed'] ">
              You don't have any shop
            </h3>
            <br />
            <ButtonBtmUp
              title={"Register Your Shop"}
              bgColor={"bg-blue-600"}
              textColor={"text-white"}
              hoverBgColor={"bg-blue-700"}
              hoverTextColor={"text-white"}
              rounded={"rounded-lg"}
              p={"px-5"}
              h={"h-10"}
              m={"mt-2"}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// const Inventory = () => {
//   // Sample inventory data
//   const inventoryItems = [
//     {
//       name: "Extra Time",
//       icon: <FaHourglassHalf size={32} />,
//       description: "Add 30 seconds to the timer.",
//       color: "bg-blue-100 text-blue-600",
//     },
//     {
//       name: "50/50",
//       icon: <FaPercentage size={32} />,
//       description: "Eliminate two wrong answers.",
//       color: "bg-yellow-100 text-yellow-600",
//     },
//     {
//       name: "Most Popular",
//       icon: <FaPoll size={32} />,
//       description: "Show the most popular answer.",
//       color: "bg-green-100 text-green-600",
//     },
//   ];

//   return (
//     <div className="bg-white dark:bg-zinc-700 p-6 rounded-lg shadow-lg">
//       <h2 className="text-xl font-bold text-zinc-700 dark:text-zinc-300 mb-6">Inventory</h2>
//       <div className="grid grid-cols-3 gap-6">
//         {inventoryItems.map((item, index) => (
//           <div className="text-center" key={index}>
//             {/* Icon with unique background */}
//             <div
//               className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-md ${item.color}`}
//             >
//               {item.icon}
//             </div>
//             {/* Inventory item name */}
//             <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
//               {item.name}
//             </p>
//             {/* Inventory item description */}
//             <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

export default ProfileDashboard;
