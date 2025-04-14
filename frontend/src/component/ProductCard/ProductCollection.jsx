import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DefaultImg from "../../assets/default-product-image.png";
import { BsCart3 } from "react-icons/bs";
import { AiOutlineStop } from "react-icons/ai";
import { OchiFooter } from "../ComponentsUtils/Footer";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { NavBar } from "../ComponentsUtils/NavBar";
import { useEventCart } from "../../store/eventCartContext";

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
          <div className="mb-6 shadow-lg">
            <h1 className="text-2xl font-bold">{vendor.ShopName}</h1>
            <p className="text-zinc-700 dark:text-zinc-400">Category: {vendor.ShopCategory}</p>
            <p className="text-zinc-700 dark:text-zinc-400">Phone: {vendor.ShopPhone}</p>
            <p className="text-zinc-700 dark:text-zinc-400">Email: {vendor.ShopEmail}</p>
            <p className="text-zinc-700 dark:text-zinc-400">Location: {vendor.ShopLocation}</p>
            <p className="text-zinc-700 dark:text-zinc-400">
              Description: {vendor.ShopDescription}
            </p>
          </div>
        )}

        <h2 className="text-xl font-bold mb-4 ">Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product?._id}
              className="bg-zinc-200 dark:bg-[#333] rounded-lg p-4 flex flex-col"
            >
              <div className="h-fit bg-zinc-700 dark:bg-zinc-400 rounded-md flex items-center justify-center mb-4">
                <img
                  src={getProductImage(product?.productImage)}
                  alt={product?.productName}
                  className="w-full aspect-square object-cover rounded-md"
                />
              </div>
              <h4 className="text-zinc-800 dark:text-white font-semibold">
                {product?.productName}
              </h4>
              <p className="text-zinc-700 dark:text-zinc-400">
                Price: {product?.productPrice}
              </p>
              <p className="text-zinc-700 dark:text-zinc-400">
                Description: {product.productDescription}
              </p>
              <p
                className={`mt-2 ${product?.available ? "text-green-400" : "text-red-400"
                  }`}
              >
                {product?.available ? (
                  <button
                    onClick={() => toggleQuantityInput(product._id)}
                    className="w-full bg-red-600 text-white px-3 py-1 mb-2 rounded-lg flex items-center justify-center"
                    disabled={!product?.available}
                    title={
                      product?.available
                        ? "Add to Cart"
                        : "Product is not available"
                    }
                  >
                    <div className="flex items-center gap-1">
                      <BsCart3 size={20} /> <span>Add to Cart</span>
                    </div>
                  </button>
                ) : (
                  <button
                    className="w-full bg-red-600/70 cursor-not-allowed text-white px-3 py-1 rounded-lg flex items-center justify-center"
                    disabled={!product?.available}
                    title={
                      product?.available
                        ? "Add to Cart"
                        : "Product is not available"
                    }
                  >
                    <div className="flex items-center gap-1 text-white/70">
                      <AiOutlineStop size={20} /> <span>Out of Stock</span>
                    </div>
                  </button>
                )}
              </p>
              {showQuantityInput[product._id] && (
                <div className="flex flex-col w-full mt-2">
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="p-2 rounded bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-white outline-none mb-2"
                  />
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded-lg w-full"
                    disabled={!product.available}
                    onClick={() => addToCart(product._id, quantity)}
                    title={
                      product.available
                        ? "Confirm Add to Cart"
                        : "Product is not available"
                    }
                  >
                    Confirm
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

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
        <form className="w-full flex justify-center items-center flex-col">
          <label htmlFor="limit" className="text-white text-sm ml-2">
            Products per page
          </label>
          <div>
            <input
              type="number"
              name="limit"
              id="limit"
              placeholder="Custom Page Limit"
              max={totalPages > 15 ? 15 : totalPages}
              value={limit}
              onChange={(e) => { setlimit(Number(e.currentTarget.value)) }}
              className="m-auto inline-block bg-gray-500/10 p-2 rounded-md"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded ml-2">
              set
            </button>
          </div>
        </form>
        <br /><br />
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
