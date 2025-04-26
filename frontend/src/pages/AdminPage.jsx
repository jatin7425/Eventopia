import React, { useState } from "react";
import AdminSideBar from "../component/Admin/AdminSideBar";
import AdminMain from "../component/Admin/AdminMain";
import { PanelRightClose, PanelLeftClose } from "lucide-react";

const AdminPage = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);

  return (
    <div className="w-full h-screen bg-gray-100 dark:bg-[#1a1a1a] flex">
      {/* Side Bar */}
      <div
        className={`h-full transition-all duration-300 ${
          isSideBarOpen ? "w-52" : "w-0 overflow-hidden"
        }`}
      >
        <AdminSideBar />
      </div>

      {/* Toggle Button */}
      <button
        className={`absolute z-10 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${
          isSideBarOpen ? " left-56 top-5" : "left-2 top-4 "
        } transition-all duration-300`}
        onClick={() => setIsSideBarOpen(!isSideBarOpen)}
      >
        {isSideBarOpen ? (
          <PanelLeftClose size={24} />
        ) : (
          <PanelRightClose size={24} />
        )}
      </button>

      {/* Main Content */}
      <div
        className={`flex-1 h-full overflow-auto border-l border-gray-600 transition-all duration-300 ${
          isSideBarOpen ? "ml-0" : "ml-0"
        }`}
      >
        <AdminMain />
      </div>
    </div>
  );
};

export default AdminPage;
