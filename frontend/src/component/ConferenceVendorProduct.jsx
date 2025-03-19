import React from 'react'

const ConferenceVendorProduct = () => {
  return (
    <div className="max-w-80 h-fit rounded overflow-hidden shadow-lg bg-white shadow-white/20 ">
      <div className="relative ">
        <div className="w-full h-48 flex justify-center items-center overflow-hidden  ">
          <img
            className="w-full mx-auto object-cover  text-black "
            src=""
            alt="ConferenceImg"
          />
        </div>
        <div className="absolute top-0 right-0 p-2">
          <button className="bg-white rounded-full p-1 shadow-md hover:shadow-lg">
            <svg
              className="w-6 h-6 text-gray-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="px-6 py-4 dark:bg-zinc-400 bg-zinc-300 rounded-t-xl">
        <div className="font-bold text-xl mb-2">Title</div>
        <div className="flex items-center mb-2">
          {/* <span className="bg-gray-200 text-gray-700 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">EU38</span>
          <span className="bg-gray-200 text-gray-700 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">BLACK/WHITE</span> */}
        </div>
        <p className="text-gray-700 text-base">Discription</p>
      </div>
      <div className="px-6 pt-4 pb-2 flex items-center justify-between dark:bg-zinc-400 bg-zinc-300">
        <div className="text-lg font-bold">₹69.99</div>
        <button className="bg-purple-500 text-white font-bold py-2 px-4 rounded shadow-md hover:bg-purple-700 transition-colors duration-300">
          Add to cart
        </button>
      </div>
    </div>
  );
}

export default ConferenceVendorProduct