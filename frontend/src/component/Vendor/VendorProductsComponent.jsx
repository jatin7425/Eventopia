// VendorProductsComponent.js
import React, { useState } from "react";
import {
  FaSearch,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosSearch } from "react-icons/io";
import { useEventCart } from "../../store/eventCartContext";
import { Link } from "react-router-dom";
import { CartCard } from "../ComponentsUtils/ProductCard";
import { ButtonBtmUp } from "../Theme/Button";


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

// Order Summary Component with dynamic cart calculation and editable quantity
const Cart = ({ cartItems }) => {
  const { cartCheckout } = useEventCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const deliveryCharge = cartItems?.TotalCartItems > 0 ? 10 : 0;
  const total = cartItems?.TotalBilling + deliveryCharge;

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

            <div className="mt-3 flex-1 overflow-auto max-h-80">
              {cartItems?.TotalCartItems <= 0 && (
                <p className="text-gray-700 dark:text-gray-400 mt-2">
                  Your cart is empty.
                </p>
              )}
            </div>

            {cartItems?.TotalCartItems > 0 && (
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
            <br/>
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
              onClick={cartCheckout}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg w-full disabled:opacity-50"
              disabled={cartItems.length < 1}
            >
              Confirm Order
            </button>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
};

const OrderSummary = ({ cartItems }) => {
  // Ensure cartItems is an array before using reduce()
  // TotalCartItems TotalBilling
  const { cartCheckout } = useEventCart();

  const deliveryCharge = cartItems?.TotalCartItems > 0 ? 10 : 0;
  const total = cartItems?.TotalBilling + deliveryCharge;

  return (
    <aside className="h-fit bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-white ml-5 p-6 rounded-lg w-1/3 flex flex-col shadow-lg dark:shadow-white/10 max-lg:sticky mt-7 top-[30px] self-start max-xl:hidden">
      <div>
        <h3 className="text-lg font-semibold flex gap-3 items-center ">
          🛒 Cart
        </h3>
      </div>
      <div className="mt-3 flex-1 overflow-auto max-h-80">
        {cartItems?.TotalCartItems <= 0 && (
          <p className="text-gray-700 dark:text-gray-400 mt-2">
            Your cart is empty.
          </p>
        )}
      </div>
      {cartItems?.TotalCartItems > 0 && (
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
        onClick={cartCheckout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg w-full disabled:opacity-50"
        disabled={cartItems?.length === 0}
      >
        Confirm Order
      </button>
    </aside>
  );
};

// Main VendorProductsComponent
const VendorProductsComponent = ({ cart }) => {
  const { removeFromCart, updateCartQuantity, getEventCart } = useEventCart();
  const [searchTerm, setSearchTerm] = useState();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

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
        

        <div className="w-full h-full">
          <CartCard cart={cart} />
        </div>
      </main>

      <Cart
        cartItems={cart}
        onUpdateCartQuantity={handleUpdateCartQuantity}
      />
      <OrderSummary
        cartItems={cart}
        onUpdateCartQuantity={handleUpdateCartQuantity}
      />
    </div>
  );
};

export default VendorProductsComponent;
