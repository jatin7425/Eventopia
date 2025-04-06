// VendorProductsComponent.js
import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaHamburger,
  FaPizzaSlice,
  FaHome,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { BsCartCheck, BsClock } from "react-icons/bs";
import { MdDeliveryDining } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import Food from "../assets/food.jpg";
import Decoration from "../assets/decoration.jpg";
import Hall from "../assets/hall.jpg";
import Conference from "../assets/conferenceimg.jpg";
import Bakery from "../assets/bakery.jpg";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosSearch } from "react-icons/io";
import { useEventCart } from "../store/eventCartContext";
import { Link } from "react-router-dom";
import { CartCard } from "./ProductCard";
import { ButtonBtmUp } from "./Button";
import CartComponent from "./Carts/CartComponent";


// Sidebar Component (common)
const Sidebar = () => {

  return (
    <aside className="w-1/5 bg-white dark:bg-[#222] text-white p-5 flex flex-col min-h-screen">
      <div className="text-center text-3xl font-bold text-red-500">🍜</div>
      <nav className="mt-10 space-y-4">
        <a
          href="#"
          className="flex items-center space-x-2 text-red-500 text-lg"
        >
          <FaHamburger />
          <span>Dashboard</span>
        </a>
        <a href="#" className="flex items-center space-x-2 text-lg">
          <BsCartCheck />
          <span>Orders</span>
        </a>
        <a href="#" className="flex items-center space-x-2 text-lg">
          <FaMapMarkerAlt />
          <span>Restaurants</span>
        </a>
        <a href="#" className="flex items-center space-x-2 text-lg">
          <BsClock />
          <span>Finance</span>
        </a>
        <a href="#" className="flex items-center space-x-2 text-lg">
          <MdDeliveryDining />
          <span>Delivery</span>
        </a>
        <a href="#" className="flex items-center space-x-2 text-lg mt-auto">
          <FiLogOut />
          <span>Logout</span>
        </a>
      </nav>
    </aside>
  );
};

// Header Component with search and profile section
const Header = ({ searchTerm, setSearchTerm }) => {
  return (
    <header className="bg-zinc-200 dark:bg-[#333] rounded-lg flex items-center justify-between overflow-hidden">
      <div className="flex items-center p-4 space-x-2 flex-1">
        <FaSearch className="text-gray-400" />
        <input
          type="text"
          placeholder="Search for food, restaurant..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent flex-1 outline-none pl-2 text-white"
        />
      </div>
      <div className="flex items-center space-x-4">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 px-4 py-5 transition duration-1"
        >
          <IoIosSearch size={20} />
        </button>
        {/* <FaRegEdit className="text-white text-xl" title="Edit Profile" />
        <div className="w-10 h-10 rounded-full bg-gray-500"></div> */}
      </div>
    </header>
  );
};

// Categories Component
const Categories = () => {
  const categories = [
    {
      id: 1,
      name: "Pizza",
      icon: <FaPizzaSlice className="text-yellow-400 text-2xl" />,
    },
    {
      id: 2,
      name: "Burger",
      icon: <FaHamburger className="text-red-400 text-2xl" />,
    },
    {
      id: 3,
      name: "Sushi",
      icon: <FaHome className="text-blue-400 text-2xl" />,
    },
  ];

  const [selectedCategoryImg, setSelectedCategoryImg] = useState(null);

  // Define categories and corresponding images
  const categoriesImg = [
    { name: "Food", img: Food },
    { name: "Bakery", img: Bakery },
    { name: "Hall", img: Hall },
    { name: "Decoration", img: Decoration },
    { name: "Conference", img: Conference },
  ];

  return (
    <section className="mt-6">
      <h2 className="text-lg font-semibold text-white">Categories</h2>

      <div className="w-full h-fit px- pt-5 flex gap-5 items-center justify-start relative">
        {categoriesImg.map((item, index) => (
          <div key={index} className="group">
            <div
              className={`relative w-32 h-32 rounded-full border-[3px] border-black dark:border-white overflow-hidden cursor-pointer flex items-center justify-center ${selectedCategoryImg === item.name ? "border-blue-500" : ""
                }`}
              onClick={() => setSelectedCategoryImg(item.name)}
            >
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="h-11 w-full flex justify-center overflow-hidden group">
              <motion.h3
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-white text-center mt-2 text-lg font-semibold bg-zinc-700 bg-opacity-70 px-3 py-1 rounded hidden group-hover:block"
              >
                {item.name}
              </motion.h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// Popular Dishes Component (static demo data)
const PopularDishes = () => {
  const dishes = [
    {
      id: 1,
      name: "Hamburger",
      price: "₹10.00",
      img: <FaHamburger className="text-4xl text-red-400" />,
    },
    {
      id: 2,
      name: "Pizza",
      price: "₹25.00",
      img: <FaPizzaSlice className="text-4xl text-yellow-400" />,
    },
    {
      id: 3,
      name: "Sushi",
      price: "₹15.00",
      img: <FaHome className="text-4xl text-blue-400" />,
    },
  ];

  return (
    <section className="mt-">
      <h2 className="text-lg font-semibold text-zinc-800 dark:text-white ">
        Popular Dishes
      </h2>
      <div className="grid grid-cols-3 gap-4 mt-3">
        {dishes.map((dish) => (
          <div
            key={dish.id}
            className="bg-zinc-200 dark:bg-[#333] p-4 rounded-lg"
          >
            <div className="flex justify-center">{dish.img}</div>
            <p className="text-center mt-2 text-zinc-700 dark:text-white">
              {dish.name}
            </p>
            <p className="text-center text-zinc-600 dark:text-zinc-300 ">
              {dish.price}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

// Order Summary Component with dynamic cart calculation and editable quantity
const Cart = ({ cartItems, onConfirmOrder, onUpdateCartQuantity }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const validCartItems = Array.isArray(cartItems) ? cartItems : [];

  const subtotal = validCartItems.reduce((acc, item) => {
    const price = parseFloat(item.price.replace("₹", "")) || 0;
    return acc + price * item.quantity;
  }, 0);

  const deliveryCharge = validCartItems.length > 0 ? 10 : 0;
  const total = subtotal + deliveryCharge;

  return (
    <div className="relative z-[999]">
      {/* Cart Toggle Button */}
      <button
        onClick={() => setIsCartOpen(!isCartOpen)}
        className="fixed bottom-5 right-5 bg-zinc-700 text-white px-4 py-2 rounded-lg shadow-lg xl:hidden"
      >
        {isCartOpen ? "Close Cart 🛒" : "Open Cart 🛒"}
      </button>

      {/* Backdrop Effect */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            class="fixed inset-0 backdrop-blur-3xl opacity-50"
            onClick={() => setIsCartOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Order Summary (Cart) with Animation */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 120, damping: 15 }}
            className="fixed top-0 right-0 h-full w-80 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-white p-6 shadow-lg overflow-y-auto"
          >
            <h3 className="text-lg font-semibold flex justify-between">
              🛒 Cart
              <button onClick={() => setIsCartOpen(false)} className="text-xl">
                ✖
              </button>
            </h3>

            <div className="mt-3">
              {validCartItems.length === 0 ? (
                <p className="text-gray-700 dark:text-gray-400 mt-2">
                  Your cart is empty.
                </p>
              ) : (
                <div className="mt-2 space-y-2">
                  {validCartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center text-gray-700 dark:text-gray-400"
                    >
                      <span className="flex items-center gap-2">
                        {item.name}
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            onUpdateCartQuantity(
                              item.id,
                              parseInt(e.target.value, 10)
                            )
                          }
                          className="w-12 p-1 rounded bg-zinc-100 dark:bg-gray-600 text-zinc-800 dark:text-white outline-none"
                        />
                      </span>
                      <span>
                        ₹
                        {(
                          parseFloat(item.price.replace("₹", "")) *
                          item.quantity
                        ).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {validCartItems.length > 0 && (
              <div className="mt-4 space-y-1">
                <p className="text-zinc-800 dark:text-white">
                  Subtotal: ₹{subtotal.toFixed(2)}
                </p>
                <p className="text-zinc-800 dark:text-white">
                  Delivery Charge: ₹{deliveryCharge.toFixed(2)}
                </p>
                <h3 className="text-xl font-semibold">
                  Total: ₹{total.toFixed(2)}
                </h3>
              </div>
            )}

            <Link
              to={`/vendorCollection`}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-center px-4 py-2 rounded-lg w-full block"
            >
              Add more Items
            </Link>
            <button
              onClick={onConfirmOrder}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg w-full disabled:opacity-50"
              disabled={validCartItems.length === 0}
            >
              Confirm Order
            </button>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
};

const OrderSummary = ({
  cartItems,
  onConfirmOrder,
  onUpdateCartQuantity,
}) => {
  // Ensure cartItems is an array before using reduce()
  // TotalCartItems TotalBilling


  const deliveryCharge = cartItems.TotalCartItems > 0 ? 10 : 0;
  const total = cartItems.TotalBilling + deliveryCharge;

  return (
    <aside className="h-fit bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-white ml-5 p-6 rounded-lg w-1/3 flex flex-col shadow-lg dark:shadow-white/10 max-lg:sticky mt-7 top-[30px] self-start max-xl:hidden">
      <div>
        <h3 className="text-lg font-semibold flex gap-3 items-center ">
          🛒 Cart
        </h3>
      </div>
      <div className="mt-3 flex-1 overflow-auto max-h-80">
        {cartItems.TotalCartItems <= 0 && (
          <p className="text-gray-700 dark:text-gray-400 mt-2">
            Your cart is empty.
          </p>
        )}
      </div>
      {cartItems.TotalCartItems > 0 && (
        <div className="mt-4 space-y-1">
          <p className="text-zinc-800 dark:text-white ">
            Total items: {cartItems?.TotalCartItems}
          </p>
          <p className="text-zinc-800 dark:text-white ">
            Subtotal: ₹{cartItems?.TotalBilling.toFixed(2)}
          </p>
          <p className="text-zinc-800 dark:text-white ">
            Delivery Charge: ₹{deliveryCharge.toFixed(2)}
          </p>
          <h3 className="text-xl font-semibold">Total: ₹{total.toFixed(2)}</h3>
        </div>
      )}
      <Link
        to={`/vendorCollection`}
        className="mt-4 text-center disabled:opacity-50"
      >
        <ButtonBtmUp
          title="Add more Items"
          bgColor="bg-blue-600"
          textColor="text-white"
          hoverBgColor="bg-blue-700"
          hoverTextColor="text-white"
          rounded="rounded-lg"
          w="w-full"
          h="h-10"
          p=""
          display="max-md:hidden"
          displayTitle2="md:hidden"
          title2="+"
        />
      </Link>
      <button
        onClick={onConfirmOrder}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg w-full disabled:opacity-50"
        disabled={cartItems.length === 0}
      >
        Confirm Order
      </button>
    </aside>
  );
};

// Main VendorProductsComponent
const VendorProductsComponent = ({cart}) => {
  const {
    removeFromCart,
    updateCartQuantity,
    getEventCart,
  } = useEventCart();
  const [searchTerm, setSearchTerm] = useState();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10)

  const handleConfirmOrder = () => {
    // console.log("hello");
    getEventCart(page, limit);
  };

  const handleUpdateCartQuantity = (productId, quantity) => {
    updateCartQuantity(productId, quantity);
    getEventCart(page, limit);
  };

  const handleRemoveFromCart = (productId) => {
    removeFromCart(productId);
    getEventCart(page, limit);
  };

  return (
    <div className="flex h-fit bg-white dark:bg-[#1a1a1a] min-h-screen text-white">
      <main className="xl:w-3/5 w-full  p-8 flex flex-col gap-6 overflow-y-auto">
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        {/* <Categories /> */}
        {/* <PopularDishes /> */}

        <div className="w-full h-full">
          <CartCard cart={cart} />
          {/* <CartComponent/> */}
        </div>
      </main>


      <Cart />
      <OrderSummary
        cartItems={cart}
        onConfirmOrder={handleConfirmOrder}
        onUpdateCartQuantity={handleUpdateCartQuantity}
      />
    </div>
  );
};

export default VendorProductsComponent;
