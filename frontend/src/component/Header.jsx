import React, { useState } from 'react';

function Header() {
  const [isLoggedin, setisLoggedin] = useState(false);

  return (
    <div className="dark:bg-zinc-800 w-screen p-4 px-5 shadow-xl flex justify-between items-center">
      <div>
        Logo
      </div>
      <div className="flex gap-2">
        <ul className="flex gap-2">
          <li>Home</li>
          <li>Events</li>
          <li>Blog</li>
          <li>Contact</li>
        </ul>
      </div>
      <div className="flex gap-2">
        {isLoggedin ?
          <div class="flex flex-wrap items-center justify-center gap-4 cursor-pointer">
            <img src='https://readymadeui.com/team-1.webp' class="w-12 h-12 rounded-full" />
            <div>
              <p class="text-[15px] text-gray-800 dark:text-white font-bold">John Doe</p>
              <p class="text-xs text-gray-500 dark:text-white mt-0.5">johndoe23@gmail.com</p>
            </div>
          </div> :
          <button type="button"
            className="bg-orange-600 py-2.5 min-w-[140px] shadow-md shadow-orange-200 text-white text-sm tracking-wider font-medium border-none outline-none active:shadow-inner flex items-center p-4">
            Get Started
            <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" className="ml-2">
              <path d="M1 8h13M8 1l7 7-7 7" stroke="white" strokeWidth="2" fill="none" />
            </svg>
          </button>
        }
      </div>
    </div>
  );
}

export default Header;