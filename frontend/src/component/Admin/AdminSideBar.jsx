import React, { useState } from 'react'
import { ImagesToggleBtn, ThemeToggle, ToggleThemeBtn } from '../Theme/ToggleTheme';

const AdminSideBar = () => {

    const [activeColection, setActiveColection] = useState()

    const collection = [
      {
        id: 1,
        title: "Users",
        path: "/@bw!n/users",
      },
      {
        id: 2,
        title: "Vendors",
        path: "/@bw!n/vendors",
      },
      {
        id: 3,
        title: "Events",
        path: "/@bw!n/events",
      },
    ];


    const handleActiveCollection = (id) => {
      setActiveColection(id);
    };

  return (
    <div className="h-full bg-slate-300 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 flex flex-col justify-between py-5 px-3 ">
      <div className=" ">
        <h1 className="text-3xl font-semibold p-4 whitespace-nowrap ">Admin Panel</h1>
      
        {collection.map((item) => (
          <div
            key={item.id}
            className={`flex items-center mt-4 px-4 py-2 space-x-4 cursor-pointer rounded-xl hover:bg-zinc-300 dark:hover:bg-zinc-600 hover:text-black dark:hover:text-zinc-100  `}
          >
            <span
              className={`text-xl font-semibold ${
                activeColection
                  ? "bg-zinc-300 dark:bg-zinc-600 text-black dark:text-zinc-100"
                  : ""
              } `}
              onClick={() => handleActiveCollection(item.id)}
            >
              {item.title}
            </span>
          </div>
        ))}
      </div>

      <div className="">
        <div className="flex items-center justify-between ">
          <ImagesToggleBtn />
        </div>
      </div>
    </div>
  );
}

export default AdminSideBar