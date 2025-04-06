import React, { useState } from "react";
import { ThemeToggle } from "../component/ToggleTheme";
import { CiMenuKebab } from "react-icons/ci";
import { motion } from "framer-motion";

const AdminPanelPage = () => {
  const [activeMenu, setActiveMenu] = useState({ category: null, index: null });
  const [search, setSearch] = useState("");
  const [data, setData] = useState({
    Users: new Array(10).fill("Faizal"),
    Vendors: new Array(10).fill("Paxwan"),
    Admin: new Array(10).fill("Jatin"),
  });

  const handleUserOptionMenu = (category, index) => {
    setActiveMenu(
      activeMenu.category === category && activeMenu.index === index
        ? { category: null, index: null }
        : { category, index }
    );
  };

  const removeUser = (category, index) => {
    setData((prevData) => ({
      ...prevData,
      [category]: prevData[category].filter((_, i) => i !== index),
    }));
    setActiveMenu({ category: null, index: null });
  };

  const promoteToAdmin = (category, index) => {
    if (category !== "Admin") {
      setData((prevData) => ({
        ...prevData,
        Admin: [...prevData.Admin, prevData[category][index]],
        [category]: prevData[category].filter((_, i) => i !== index),
      }));
    }
    setActiveMenu({ category: null, index: null });
  };

  const renderUserCard = (category, user, index) => (
    <motion.div
      key={index}
      className="relative flex justify-between items-center bg-zinc-300 text-black px-3 py-2 rounded-md hover:bg-zinc-400 cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <motion.img
          src="https://via.placeholder.com/40"
          alt="User"
          className="w-10 h-10 rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.05, duration: 0.2 }}
        />
        <p>{user}</p>
      </div>
      <CiMenuKebab
        className="text-xl cursor-pointer"
        onClick={() => handleUserOptionMenu(category, index)}
      />
      {activeMenu.category === category && activeMenu.index === index && (
        <motion.div
          className="absolute right-7 top-5 bg-zinc-500 p-2 rounded-lg shadow-lg flex flex-col gap-2 z-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            onClick={() => removeUser(category, index)}
            className="text-white text-sm hover:bg-zinc-600 px-3 py-1 rounded"
          >
            Remove {category}
          </button>
          {category !== "Admin" && (
            <button
              onClick={() => promoteToAdmin(category, index)}
              className="text-white text-sm hover:bg-zinc-600 px-3 py-1 rounded"
            >
              Promote to Admin
            </button>
          )}
        </motion.div>
      )}
    </motion.div>
  );

  return (
    <div className="w-full min-h-screen bg-zinc-900 text-white">
      <header className="w-full flex items-center justify-between px-6 md:px-10 h-20 text-2xl md:text-3xl bg-zinc-800 shadow-lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to SuperAdmin Dashboard
        </motion.div>
        <ThemeToggle />
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
        {["Active Users", "New Users", "Total Vendors"].map((title, index) => (
          <motion.div
            key={index}
            className="bg-zinc-600 rounded-lg px-4 py-3 flex flex-col gap-2 text-center md:text-left"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.4 }}
          >
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-2xl">1,000</p>
          </motion.div>
        ))}
      </section>

      <section className="p-6">
        <input
          type="text"
          placeholder="Search Users..."
          className="w-full p-2 rounded-md bg-zinc-800 text-white border border-gray-700 mb-4"
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
        {Object.entries(data).map(([category, users], index) => (
          <motion.div
            key={index}
            className="bg-zinc-600 rounded-lg px-4 h-72"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.2, duration: 0.4 }}
          >
            <div className="h-56">
              <h2 className="text-xl font-bold">{category}</h2>
              <div className="h-full overflow-y-scroll mt-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-500">
                {users
                  .filter((user) =>
                    user.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((user, i) => renderUserCard(category, user, i))}
              </div>
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
};

export default AdminPanelPage;
