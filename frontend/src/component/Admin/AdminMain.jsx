import { ChevronRight, EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../store/auth";
import CollectionHandler from "./CollectionHandler";

const AdminMain = ({ Collections, isSideBarOpen }) => {
  const param = useParams();
  const { user } = useAuth();
  const [Collection, setCollection] = useState(Collections);
  const [showAdminDets, setShowAdminDets] = useState(false)

  useEffect(() => {
    Collections && setCollection(Collections)
  }, [Collections])

  const [openMenuId, setOpenMenuId] = useState(null);

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  if (!Collection) {
    return (
      <div className="dark:bg-zinc-800">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-gray-900"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="dark:bg-zinc-800 min-h-screen">
      {showAdminDets && <AdminDets user={user} />}
      <nav>
        <div className="h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-gray-600 bg-slate-300 dark:bg-zinc-800">
          <div className={`${!isSideBarOpen && 'ml-10'} text-zinc-600 dark:text-zinc-300 text-sm`}>
            Admin Panel
          </div>
          <div
            onClick={() => setShowAdminDets(!showAdminDets)}
            className="flex gap-3 items-center cursor-pointer hover:bg-zinc-700 p-2 rounded-md"
          >
            <img
              src={user?.profilePicture}
              alt="Admin"
              className="w-8 h-8 sm:w-10 sm:h-10 border rounded-full object-cover"
            />
            <ChevronRight size={24} className="hidden sm:block" />
          </div>
        </div>
      </nav>

      <main className="p-4 sm:p-6 lg:p-8">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 font-['Gilroy']">
          {(!param.collection) ? (Collection.map((item) => (
            <Link
              to={`/@bw!n/${item}`}
              key={item.id}
              className={`w-full overflow-hidden shadow-lg ${item == "chats" && 'hidden'}`}
            >
              <div className="flex justify-between items-center rounded-lg w-full p-4 bg-white dark:bg-zinc-700 shadow hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 sm:gap-5 w-full">
                  <h1 className="font-semibold text-lg sm:text-xl">{item}</h1>
                </div>

                <div className="relative">
                  <button
                    onClick={() => toggleMenu(item)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-zinc-600 rounded"
                  >
                    <EllipsisVertical className="w-5 h-5" />
                  </button>
                  <div
                    className={`absolute top-10 right-0 flex gap-4 bg-white dark:bg-zinc-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-700 ${openMenuId === item.id ? "block" : "hidden"
                      }`}
                  >
                    <button
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 dark:hover:text-red-500"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))) : (
            <div className="w-full col-start-1 -col-end-1 overflow-x-hidden">
              <CollectionHandler />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// AdminDets component remains same with added responsive classes

const AdminDets = ({ user }) => {
  return (
    <div className="fixed top-20 right-16 z-50 w-64 bg-white dark:bg-zinc-800 rounded-xl shadow-2xl border border-gray-200 dark:border-zinc-700 backdrop-blur-md bg-opacity-90 transition-all duration-300 hover:shadow-3xl">
      <div className="p-6 flex flex-col items-center gap-4">
        {/* Profile Image */}
        <div className="relative group">
          <img
            src={user?.profilePicture}
            className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-zinc-900 shadow-lg hover:border-primary-100 transition-all duration-300"
          />
          <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-primary-300 dark:group-hover:border-primary-600 transition-all duration-300" />
        </div>

        {/* Profile Info */}
        <div className="text-center space-y-2">
          <h1 className="text-xl font-serif font-semibold text-zinc-800 dark:text-zinc-100 tracking-tight">
            {user?.fullName}
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
            @{user?.userName}
          </p>
          <div className="pt-2">
            <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-700 px-3 py-1 rounded-full">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Decorative Divider */}
        <div className="w-full py-4 flex items-center">
          <div className="flex-1 border-t border-gray-200 dark:border-zinc-700"></div>
          <span className="px-3 text-zinc-400 dark:text-zinc-500 text-sm">ADMIN</span>
          <div className="flex-1 border-t border-gray-200 dark:border-zinc-700"></div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span>Active Session</span>
        </div>
      </div>
    </div>
  )
}

export default AdminMain;
