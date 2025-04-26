import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import React, { useState } from "react";

const AdminMain = () => {
  const admin = [
    {
      id: 1,
      name: "Faizal Ahmed",
      imgPath:
        "https://images.unsplash.com/photo-1506794778169002-8b11c6b57c99",
    },
  ];

  const collectionData = [
    {
      id: 1,
      title: "Users",
      imgPath:
        "https://images.unsplash.com/photo-1506794778169002-8b11c6b57c99",
    },
    {
      id: 2,
      title: "Vendors",
      imgPath:
        "https://images.unsplash.com/photo-1506794778169002-8b11c6b57c99",
    },
    {
      id: 3,
      title: "Events",
      imgPath:
        "https://images.unsplash.com/photo-1506794778169002-8b11c6b57c99",
    },
    {
      id: 4,
      title: "Events",
      imgPath:
        "https://images.unsplash.com/photo-1506794778169002-8b11c6b57c99",
    },
  ];

  // Track which item's menu is open
  const [openMenuId, setOpenMenuId] = useState(null);

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <div className="dark:bg-zinc-800 min-h-screen">
      <nav>
        <div className="h-20 flex items-center justify-end px-10 border-b border-gray-600 bg-slate-300 dark:bg-zinc-800">
          {admin.map((item) => (
            <div key={item.id} className="flex gap-5 items-center">
              <h1 className="font-semibold text-2xl">{item.name}</h1>
              <img
                src={item.imgPath}
                alt="Admin"
                className="w-10 h-10 border rounded-full object-cover"
              />
            </div>
          ))}
        </div>
      </nav>

      <main className="p-4">
        <div className="w-full font-['Gilroy']">
          {collectionData.map((item) => (
            <div
              key={item.id}
              className="mb-4 p-4 rounded-lg bg-white dark:bg-zinc-700 shadow"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-5">
                  <img
                    src={item.imgPath}
                    alt={item.title}
                    className="w-12 h-12 border rounded-full object-cover"
                  />
                  <h1 className="font-semibold text-2xl">{item.title}</h1>
                </div>

                {/* Button Group */}
                <div className="relative">
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-zinc-600 rounded"
                  >
                    <EllipsisVertical />
                  </button>
                  <div
                    className={`absolute top-10 right-0 flex gap-4 bg-white dark:bg-zinc-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-700 ${
                      openMenuId === item.id ? "block" : "hidden"
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
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminMain;
