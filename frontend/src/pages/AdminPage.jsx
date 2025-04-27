import React, { useEffect, useState } from "react";
import AdminSideBar from "../component/Admin/AdminSideBar";
import AdminMain from "../component/Admin/AdminMain";
import { PanelRightClose, PanelLeftClose } from "lucide-react";
import { useAdmin } from "../store/adminContext";

const AdminPage = () => {
  const { Collections, getCollection } = useAdmin();
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);

  useEffect(() => {
    getCollection?.();
  }, [getCollection]);

  return (
    <div className="w-full max-w-[100vw] h-screen bg-gray-50 dark:bg-[#0f0f0f] flex relative">
      {/* Side Bar */}
      <div className={`h-full bg-white dark:bg-zinc-900 shadow-xl transition-all duration-300 w-64
        ${!isSideBarOpen && "-ml-64"}`}>
        <AdminSideBar Collections={Collections} />
      </div>

      {/* Toggle Button */}
      <button
        className={`absolute z-30 p-2 rounded-full bg-white dark:bg-zinc-800 shadow-lg hover:bg-gray-100 dark:hover:bg-zinc-700
          ${isSideBarOpen ? "left-60 top-5" : "left-4 top-4"} 
          transition-all duration-300 group`}
        onClick={() => setIsSideBarOpen(!isSideBarOpen)}
      >
        {isSideBarOpen ? (
          <PanelLeftClose size={20} className="text-zinc-600 dark:text-zinc-300 group-hover:text-primary-500" />
        ) : (
          <PanelRightClose size={20} className="text-zinc-600 dark:text-zinc-300 group-hover:text-primary-500" />
        )}
      </button>

      {/* Main Content */}
      <div className="flex-1 h-full">
        <AdminMain Collections={Collections} />
      </div>
    </div>
  );
};

export default AdminPage;