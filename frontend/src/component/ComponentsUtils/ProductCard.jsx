import React, { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { BASE_URL } from "../../config/urls";
import DefaultImg from "../../assets/default-product-image.png";
import { useEventCart } from "../../store/eventCartContext";
import { motion } from "framer-motion";
import {
  Trash,
} from "lucide-react";
import { ButtonBtmUp } from "../Theme/Button";


export const VendorProductCard = ({
  Edit,
  destroy,
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

          <button className="bg-black/10 rounded-full p-2" onClick={destroy}>
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

export const CartCard = ({ cart }) => {
  const { removeFromCart, updateCartQuantity, getEventCart, item, updateCart } =
    useEventCart();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);

  const updateQuantity = (id, quantity, change) => {
    const newQuantity = Math.max(1, quantity + change); // Prevent negative/zero values
    updateCart(id, newQuantity); // Update the cart in parent state
  };

  // Handle direct input change
  const handleInputChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) {
      value = 1;
    }
    setQuantity(value);
    updateCart(item?._id, value);
  };

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
    <section className="p-6 h-full w-full">
      <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">
        Cart for {cart?.eventDetails?.name}
      </h1>
      <div className="grid gap-4 ">
        {paginatedCart?.map((item) => (
          <motion.article
            key={item._id}
            className="p-4 flex justify-between items-center rounded-lg shadow-md dark:shadow-white/20 bg-zinc-100 dark:bg-zinc-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex gap-4 items-center h-full">
              <img
                src={
                  item?.product?.productImage
                    ? `${BASE_URL}${item?.product?.productImage}`
                    : `..${DefaultImg}`
                }
                alt={item?.product?.productName}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div>
                <h2 className="text-lg text-zinc-800 dark:text-zinc-200 font-semibold">
                  {item?.product?.productName}
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  From: {item?.vendor?.ShopName}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Added by: {item?.user?.userName}
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 font-bold">
                  Price: ₹{item?.product?.productPrice}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Remove Item Button */}
              <button
                onClick={() => removeFromCart(item._id)}
                className="px-3 py-2 bg-red-600 text-white rounded-lg transition hover:bg-red-700"
              >
                <Trash size={16} />
              </button>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between gap-4 mt-4">
        <div className="flex items-center gap-2 mt-5">
          <button
            disabled={cart?.pagination?.currentPage === 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            className="flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ButtonBtmUp
              title="Prev"
              bgColor="bg-slate-600"
              textColor="text-white"
              hoverBgColor="bg-slatre-700"
              hoverTextColor="text-white"
              rounded="rounded-lg"
              w="w-full"
              h="h-10"
              p="px-4 "
              display="max-md:hidden"
              displayTitle2="md:hidden"
              title2="+"
            />
          </button>
          <span className="font-medium text-black dark:text-white ">
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
            className=" disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ButtonBtmUp
              title="Next"
              bgColor="bg-blue-600"
              textColor="text-white"
              hoverBgColor="bg-blue-700"
              hoverTextColor="text-white"
              rounded="rounded-lg"
              w="w-full"
              h="h-10"
              p="px-4 "
              display="max-md:hidden"
              displayTitle2="md:hidden"
              title2="+"
            />
          </button>
        </div>

        {/* Limit Selector */}
        <div className="flex items-center gap-2 mt-5">
          <label
            htmlFor="limit"
            className="font-medium text-black dark:text-white"
          >
            Limit:
          </label>
          <input
            type="number"
            id="limit"
            name="limit"
            value={limit > 15 ? 15 : limit}
            onChange={(e) => setLimit(e.target.value)}
            className="w-16 px-2 py-1 text-black dark:text-white rounded-lg text-center bg-zinc-100 dark:bg-zinc-700 "
          />
          <button onClick={fetchCart} className="">
            <ButtonBtmUp
              title="Update"
              bgColor="bg-blue-600"
              textColor="text-white"
              hoverBgColor="bg-blue-700"
              hoverTextColor="text-white"
              rounded="rounded-lg"
              w="w-full"
              h="h-10"
              p="px-4 "
              display="max-md:hidden"
              displayTitle2="md:hidden"
              title2="+"
            />
          </button>
        </div>
      </div>
    </section>
  );
};