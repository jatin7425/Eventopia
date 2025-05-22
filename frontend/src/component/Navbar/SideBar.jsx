import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { ThemeToggle } from "../Theme/ToggleTheme";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ButtonArrow } from "../Theme/Button";
import { CgProfile } from "react-icons/cg";
import { useAuth } from "../../store/auth";

const SideBar = ({ homeLink, contactLink }) => {
  const { isLoggedin, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const menu = [
    {
      name: "Home",
      link: homeLink,
    },
    {
      name: "Events",
      link: "/eventSelection",
    },
    {
      name: "Contact",
      link: contactLink,
    },
    {
      name: "About Us",
      link: "#footer",
    },
  ];

  return (
    <div className="md:hidden fixed z-50 top-0 left-0 h-screen">
      {/* Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0  z-40" onClick={toggleSidebar} />
      )}

      {/* Toggle Button */}
      <button
        className={`fixed z-50 backdrop-blur-xl hover:bg-zinc-200/30 dark:hover:bg-zinc-700/30 p-2 rounded-lg transition-all ${
          isSidebarOpen ? "left-48 ml-2 top-4" : "left-4 top-4"
        }`}
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? (
          <PanelRightOpen className="w-6 h-6" />
        ) : (
          <PanelRightClose className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed z-50 h-full w-48 p-4 flex flex-col justify-between gap-5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Menu */}
        <div className="flex flex-col gap-10">
          <Link to="/" className="md:hidden" onClick={toggleSidebar}>
            <h1 className="text-3xl font-bold font-['Founders_Grotesk_X'] tracking-widest -mb-2 text-[#DAA520] dark:text-[#DAA520]">
              EVENTOPIA
            </h1>
          </Link>
          <ul className="flex flex-col gap-4">
            {menu.map((item, index) => (
              <li
                key={index}
                className="flex flex-col items-start text-lg hover:text-blue-500 dark:hover:text-blue-400"
              >
                <a href={item.link} onClick={toggleSidebar}>
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between gap-3 ">
          <ThemeToggle />

          {/* Profile */}
          {isLoggedin ? (
            <Link
              to={"/user/profile"}
              className="h-10 w-10 border-[2px] dark:border-white border-black rounded-full overflow-hidden p-1"
            >
              {user ? (
                <img
                  src={user?.profilePicture}
                  alt=""
                  className="object-contain h-full w-full "
                  loading="lazy"
                />
              ) : (
                <CgProfile />
              )}
            </Link>
          ) : (
            <>
              <Link to={"/auth"} className=" ">
                <ButtonArrow
                  title={"Login"}
                  bgColor={"bg-blue-600"}
                  circleBg={"bg-white"}
                />
              </Link>
              <button
                button
                id="toggleOpen"
                onClick={toggleSidebar}
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
      </aside>
    </div>
  );
};

export default SideBar;
