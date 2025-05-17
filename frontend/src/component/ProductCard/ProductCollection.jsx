import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DefaultImg from "../../assets/default-product-image.png";
import { OchiFooter } from "../ComponentsUtils/Footer";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { NavBar } from "../ComponentsUtils/NavBar";
import { useEventCart } from "../../store/eventCartContext";

import {
  EnvelopeIcon as MailIcon,
  PhoneIcon,
  MapPinIcon as LocationIcon,
  TagIcon as CategoryIcon,
} from "@heroicons/react/24/outline";

import BannerEditor from "../Canva/BannerEditor/BannerEditor";

const ProductCollection = () => {
  const { id } = useParams();
  const { addToCart, setVendorId } = useEventCart()
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showQuantityInput, setShowQuantityInput] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [limit, setlimit] = useState(5);
  const BASE_URL = "http://127.0.0.1:3000";
  

  const [footerRef, footerInView] = useInView({ threshold: 0.2 });


  useEffect(() => {
    fetchVendorProducts(id, page);
  }, [id, page, limit]);

  const fetchVendorProducts = async (vendorId, pageNumber) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/vendor/getProductByVendorId/${vendorId}?page=${pageNumber}&limit=${limit}`
      );
      setVendor(response.data.vendorDetails);
      setProducts(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setVendorId(response.data.vendorDetails._id)
    } catch (error) {
      console.error("Error fetching vendor products", error);
    }
  };

  const getProductImage = (image) => {
    if (!image) return null;
    return image.startsWith("data:image") ? image : `${BASE_URL}${image}`;
  };

  const cardVariants2 = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        bounce: 0.4,
      },
    },
  };
  
  const toggleQuantityInput = (productId) => {
    setShowQuantityInput((prev) => ({
      ...prev,
      [productId]: !prev[productId], // Toggle only the clicked product
    }));
  };


  return (
    <div className="">
      <div className="h-20 w-full">
        <NavBar homeLink="/" aniDelay={0.4} />
      </div>

      <div className="px-20">
        {vendor && (
          <div className="mb-6 rounded-xl overflow-hidden shadow-lg relative">
            {/* Banner with overlay */}
            <div className="relative h-60 w-full">
              {getProductImage(vendor.ShopBanner) ? (
                <img
                  src={getProductImage(vendor.ShopBanner)}
                  alt="shop banner"
                  className="w-full h-full object-cover absolute inset-0"
                />
              ) : (
                <BannerEditor
                  text={vendor.ShopName}
                  fontSize="text-6xl"
                  randomizer={2}
                />
              )}
            </div>

            {/* Content */}
            <div className="relative px-6 pb-6 -mt-16 z-[20]">
              <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-md">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
                  {vendor.ShopName}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-start space-x-3">
                    <CategoryIcon className="w-5 h-5 mt-1 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        Category
                      </p>
                      <p className="text-zinc-700 dark:text-zinc-300">
                        {vendor.ShopCategory}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <PhoneIcon className="w-5 h-5 mt-1 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        Phone
                      </p>
                      <p className="text-zinc-700 dark:text-zinc-300">
                        {vendor.ShopPhone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MailIcon className="w-5 h-5 mt-1 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        Email
                      </p>
                      <p className="text-zinc-700 dark:text-zinc-300">
                        {vendor.ShopEmail}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <LocationIcon className="w-5 h-5 mt-1 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        Location
                      </p>
                      <p className="text-zinc-700 dark:text-zinc-300">
                        {vendor.ShopLocation}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-700">
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                    About
                  </p>
                  <p className="text-zinc-700 dark:text-zinc-300">
                    {vendor.ShopDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <h2 className="text-xl font-bold mb-4 ">Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <motion.div
              key={product?._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-zinc-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              {/* Product Image */}
              <div className="relative h-60 overflow-hidden border-b border-zinc-400 ">
                <img
                  src={getProductImage(product?.productImage) || DefaultImg}
                  alt={product?.productName}
                  className="w-full h-full object-contain bg-zinc-400 text-black "
                />
                {!product?.available && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-1 line-clamp-2">
                    {product?.productName}
                  </h4>
                  <p className="text-zinc-600 dark:text-zinc-300 text-sm mb-3 line-clamp-3">
                    {product.productDescription}
                  </p>
                </div>

                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-zinc-900 dark:text-white">
                      ${product?.productPrice}
                    </span>
                    {product?.available && (
                      <span className="text-sm text-green-500 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        In Stock
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {product?.available ? (
                    showQuantityInput[product._id] ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex space-x-2">
                          <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="flex-1 p-2 rounded-lg bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                            onClick={() => addToCart(product._id, quantity)}
                          >
                            Add
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <button
                        onClick={() => toggleQuantityInput(product._id)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        <span>Add to Cart</span>
                      </button>
                    )
                  ) : (
                    <button
                      className="w-full bg-zinc-400 dark:bg-zinc-600 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 cursor-not-allowed"
                      disabled
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
                        />
                      </svg>
                      <span>Out of Stock</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-between ">
          {/* Pagination Controls */}
          <div className="flex items-center justify-center my-10 gap-2">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {page} of {totalPages}
            </span>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>

          {/* Custom Page Limit */}
          <div>
            <form className="w-full flex justify-center items-center flex-col">
              <div>
                <input
                  type="number"
                  name="limit"
                  id="limit"
                  placeholder="Custom Page Limit"
                  max={totalPages > 15 ? 15 : totalPages}
                  value={limit}
                  onChange={(e) => {
                    setlimit(Number(e.currentTarget.value));
                  }}
                  className="m-auto inline-block bg-zinc-500/10 p-2 rounded-md"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
                >
                  Set
                </button>
              </div>
            </form>
          </div>
        </div>
        <br />
        <br />
      </div>

      <motion.div
        ref={footerRef}
        initial="hidden"
        animate={footerInView ? "visible" : "hidden"}
        variants={cardVariants2}
        className="border-t-2 border-zinc-400 "
      >
        <OchiFooter marginTop={"20"} />
      </motion.div>
    </div>
  );
};

export default ProductCollection;
