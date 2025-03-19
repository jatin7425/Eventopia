import React, { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { BASE_URL } from "../config/urls";
import DefaultImg from "../assets/default-product-image.png";
import { useEventCart } from "../store/eventCartContext";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useInView } from "react-intersection-observer";
import { OchiFooter } from "./Footer";
import { Trash, Plus, Minus } from "lucide-react";
export const VendorProductCard = ({
  Edit,
  Delete,
  title,
  price,
  description,
  imageUrl,
  available,
}) => {
  const shortDescription =
    description.length > 100 ? description.slice(0, 50) + "..." : description;
    
  return (
    <div className="md:max-w-xs xs:max-w-full xs:h-fit md:h-full xs:flex md:flex-col min-w-72 w-full h-full rounded-lg overflow-hidden shadow-lg m-4 relative bg-white dark:bg-[#333333] dark:shadow-zinc-700">
      <div className="relative">
        <div className="absolute flex flex-col gap-2 top-2 right-2 p-2 bg-black/10 text-white rounded-2xl">
          <button className="bg-black/10 rounded-full p-2" onClick={Edit}>
            <FaEdit />
          </button>

          <button className="bg-black/10 rounded-full p-2" onClick={Delete}>
            <RiDeleteBin6Line />
          </button>
        </div>
        <img
          className="md:w-full md:h-52 w-full h-52 object-cover xs:w-80 xs:max-h-full"
          src={imageUrl ? `${BASE_URL}${imageUrl}` : `..${DefaultImg}`}
          alt={title}
        />
      </div>
      <div className="px-4 py-4 xs:py-0 md:py-4 xs:h-52 md:h-full">
        <div className="font-bold text-xl mb-2 border-b border-zinc-400 px-2 ">
          {title}
        </div>
        <span className="inline-block rounded-full ml-full text-md font-semibold text-gray-300 px-2">
          ₹{price}
        </span>
        <p className="text-gray-700 dark:text-zinc-400 text-base px-2">
          {shortDescription}
        </p>
        <p
          className={`text-base px-2 ${
            available ? "text-green-400" : "text-red-400"
          }`}
        >
          {available ? "Available" : "Not Available"}
        </p>
      </div>
      <div className="px-6 pt-4 pb-5 flex items-center xs:justify-end md:justify-start justify-start w-full absolute bottom-0 left-0 right-0"></div>
    </div>
  );
};

export const ClientProductCard = () => {
  return (
    <div className="max-w-80  rounded overflow-hidden shadow-lg bg-white shadow-white/20 ">
      <div className="relative ">
        <div className="w-full h-48 flex justify-center items-center overflow-hidden  ">
          <img
            className="w-full mx-auto object-cover  "
            src="data:image/jpeg;base64,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"
            alt="Nike Running Shoe"
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
        <div className="font-bold text-xl mb-2">Nike Running Shoe</div>
        <div className="flex items-center mb-2">
          {/* <span className="bg-gray-200 text-gray-700 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">EU38</span>
          <span className="bg-gray-200 text-gray-700 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">BLACK/WHITE</span> */}
        </div>
        <p className="text-gray-700 text-base">
          Crossing hardwood comfort with off-court flair. '80s-inspired
          construction, bold details and nothin'-but-net style.
        </p>
      </div>
      <div className="px-6 pt-4 pb-2 flex items-center justify-between dark:bg-zinc-400 bg-zinc-300">
        <div className="text-lg font-bold">₹69.99</div>
        <button className="bg-purple-500 text-white font-bold py-2 px-4 rounded shadow-md hover:bg-purple-700 transition-colors duration-300">
          Add to cart
        </button>
      </div>
    </div>
  );
};

export const CartCard = () => {
  const { cart, removeFromCart, updateCartQuantity, getEventCart } =useEventCart();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  

  useEffect(() => {
    if (cart?.pagination) {
      setPage(cart?.pagination?.currentPage);
    }
  }, [cart]);

  const fetchCart = () => {
    getEventCart(page, limit);
  };

  useEffect(() => {
    fetchCart();
  }, [page]);



  const paginatedCart = cart?.cart;

  

  return (
    <section className="p-6 h-full">
      <h1 className="text-2xl font-bold mb-4">
        Cart for {cart?.eventDetails?.name}
      </h1>
      <div className="grid gap-4">
        {paginatedCart?.map((item) => (
          <motion.article
            key={item._id}
            className="p-4 flex justify-between items-center rounded-lg shadow-md dark:shadow-white/20 bg-white dark:bg-zinc-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex gap-4 items-center">
              <img
                src={item?.product?.productImage ? `${BASE_URL}${item?.product?.productImage}` : `..${DefaultImg}`}
                alt={item?.product?.productName}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div>
                <h2 className="text-lg text-zinc-800 dark:text-zinc-200 font-semibold">
                  {item?.product?.productName}
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {item?.product?.productDescription}
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 font-bold">
                  Price: ₹{item?.product?.productPrice}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item._id, -1)}
                className="px-2 py-2 bg-red-500 dark:border-zinc-200 rounded-lg text-black dark:text-white hover:bg-red-500"
              >
                <Minus size={16} />
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item._id, 1)}
                className="px-2 py-2  bg-blue-600 dark:border-zinc-300 rounded-lg text-black dark:text-white hover:bg-blue-700"
              >
                <Plus size={16} />
              </button>
              <button
                onClick={() => removeItem(item._id)}
                className="px-3 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Trash size={16} />
              </button>
            </div>
          </motion.article>
        ))}
      </div>
      <div className="flex flex-col items-center gap-4 mt-4">
        {/* Pagination Controls */}
        <div className="flex items-center gap-2 mt-10">
          <button
            disabled={cart?.pagination?.currentPage === 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            className="px-4 py-2 bg-slate-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Prev
          </button>
          <span className="font-medium">
            Page {cart?.pagination?.currentPage} of{" "}
            {cart?.pagination?.totalPages}
          </span>
          <button
            disabled={
              cart?.pagination?.currentPage === cart?.pagination?.totalPages
            }
            onClick={() =>
              setPage((prev) =>
                Math.min(cart?.pagination?.totalPages, prev + 1)
              )
            }
            className="px-4 py-2 bg-blue-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>

        {/* Limit Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="limit" className="font-medium">
            Limit:
          </label>
          <input
            type="number"
            id="limit"
            name="limit"
            value={limit > 15 ? 15 : limit}
            onChange={(e) => setLimit(e.target.value)}
            className="w-16 px-2 py-1 border rounded-lg text-center bg-black/20"
          />
          <button onClick={fetchCart} className="px-4 py-2 border rounded-lg">
            Update
          </button>
        </div>
      </div>

      
    </section>
  );
};
