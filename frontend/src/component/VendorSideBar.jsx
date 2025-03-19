import React from 'react';
import { FiHome, FiList, FiTruck, FiDollarSign, FiSettings, FiLogOut } from 'react-icons/fi';

function VendorSideBar() {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4 flex flex-col">
      <div className="flex items-center mb-8">
        <img src="/logo.png" alt="Logo" className="h-8 w-8" />
        <span className="ml-2 text-xl font-bold">Food Delivery</span>
      </div>
      <nav className="flex-grow">
        <ul>
          <li className="mb-4 flex items-center text-red-500">
            <FiHome className="mr-2" />
            <a href="#">Dashboard</a>
          </li>
          <li className="mb-4 flex items-center text-green-500">
            <FiList className="mr-2" />
            <a href="#">Orders</a>
          </li>
          <li className="mb-4 flex items-center text-blue-500">
            <FiTruck className="mr-2" />
            <a href="#">Restaurants</a>
          </li>
          <li className="mb-4 flex items-center text-yellow-500">
            <FiDollarSign className="mr-2" />
            <a href="#">Finance</a>
          </li>
          <li className="mb-4 flex items-center text-purple-500">
            <FiLogOut className="mr-2" />
            <a href="#">Logout</a>
          </li>
        </ul>
      </nav>
      <div className="mt-auto flex items-center text-pink-500">
        <FiSettings className="mr-2" />
        <a href="#">Settings</a>
      </div>
    </div>
  );
}

export default VendorSideBar;
