import React, { useState, useEffect } from "react";
import axios from "axios";
import DefaultImg from "../../assets/default-product-image.png";
import { NavBar } from "../NavBar";
import { OchiFooter } from "../Footer";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link, useParams } from "react-router-dom";

const VendorsCollection = () => {
  const id = useParams()
  const [vendors, setVendors] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState(null);
  const limit = 6;
  const BASE_URL = "http://127.0.0.1:3000";

  const [footerRef, footerInView] = useInView({ threshold: 0.2 });

  useEffect(() => {
    fetchVendors(page, category);
  }, [page, category]);

  const fetchVendors = async (pageNumber, category) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/vendor/getAllVendors?page=${pageNumber}&limit=${limit}${category ? `&category=${category}` : ""
        }`
      );
      setVendors(response.data.data);

      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching vendors", error);
    }
  };

  const calculateVendorRating = (vendor) => {
    if (!vendor.VendorRatings || vendor.VendorRatings.length === 0) return 0;
    const total = vendor.VendorRatings.reduce((sum, rating) => sum + rating, 0);
    return (total / vendor.VendorRatings.length).toFixed(1);
  };

  const getProductImage = (image) => {
    if (!image) return DefaultImg;
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

  return (
    <div className="w-full h-full min-h-screen bg-white dark:bg-[#1a1a1a] relative ">
      <div className="h-20 w-full">
        <NavBar homeLink="/" aniDelay={0.4} />
      </div>

      <a
        href="/user/myEvents"
        className="fixed bottom-7 right-10 z-[999] bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg "
      >
        Skip
      </a>

      <div className="flex items-center justify-between sm:px-20 px-5 ">
        <h1 className="text-xl font-bold mb-4">Vendor List</h1>

        {/* Category Dropdown */}
        <div className="mb-4">
          <select
            className="px-3 py-2 outline-none rounded w-full bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-white"
            value={category || ""}
            onChange={(e) => setCategory(e.target.value || null)}
          >
            <option value="">All Categories</option>
            <option value="Bakery">Bakery</option>
            <option value="Food">Food</option>
            <option value="Decoration">Decoration</option>
            <option value="Hotel">Hotel</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:px-20 px-5 ">
        {vendors?.map((vendor) => (
          <Link
            to={`/productCollection/${vendor._id}`}
            key={vendor._id}
            className="p-4 shadow-md dark:shadow-white/20 dark:bg-zinc-800 rounded-lg"
          >
            <div>
              <h2 className="text-xl font-semibold">{vendor?.ShopName}</h2>
              <p className="dark:text-zinc-400 text-zinc-600">
                Category: {vendor?.ShopCategory}
              </p>
              <p className="dark:text-zinc-400 text-zinc-600">
                Rating: {calculateVendorRating(vendor)} ⭐
              </p>
              <p className="dark:text-zinc-400 text-zinc-600">
                Phone: {vendor?.ShopPhone}
              </p>
              <p className="dark:text-zinc-400 text-zinc-600">
                Email: {vendor?.ShopEmail}
              </p>
              <p className="dark:text-zinc-400 text-zinc-600">
                Location: {vendor?.ShopLocation}
              </p>

              <img
                src={getProductImage(vendor?.ShopBanner || vendor?.ShopLogo || DefaultImg)}
                alt="Product"
                className="w-full h-32 object-cover mt-2 rounded-lg"
              />
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center my-10">
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

export default VendorsCollection;
