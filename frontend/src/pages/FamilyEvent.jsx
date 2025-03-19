import React, { useEffect, useState } from "react";
import { FaBirthdayCake, FaStore, FaWarehouse } from "react-icons/fa";
import logo from "../assets/logo-nobg.png";
import { Link } from "react-router-dom";
import { NavBar } from "../component/NavBar";
// Bakery and Decoration Components

const VendorComponent = ({ name, address, image }) => (
  <div className="dark:bg-zinc-950 bg-white shadow-lg rounded-lg p-6 flex flex-col items-center hover:bg-black/10 ">
    <img
      src={image}
      alt={name}
      className="w-full h-48 object-cover rounded-md mb-4"
    />
    <div className="text-lg font-semibold mb-2">{name}</div>
    <div className="dark:text-gray-400 text-gray-600">{address}</div>
  </div>
);

const VendorProduct = ({ name, price, image, rating }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 shadow-lg rounded-lg p-6 flex flex-col items-center">
      <img
        src={image}
        alt={name}
        className="w-full h-48 object-cover rounded-md mb-4 bg-zinc-800"
      />
      <div className="text-lg font-semibold mb-2">{name}</div>
      <div className="text-gray-600 dark:text-zinc-400 ">${price.toFixed(2)}</div>
      <div className="text-yellow-500">Rating: {rating}</div>
    </div>
  );
};

const bakeries = [
  {
    name: "Silvassa Bakery",
    address: "Kilvani Naka",
    image:
      "https://lh3.googleusercontent.com/p/AF1QipP7_7eGNDKmfG-s_UmH8C1givYo3HiL29O0qxLo=s1360-w1360-h1020",
  },
  {
    name: "Vimo Cafe",
    address: "Silvassa Bhilad Highway",
    image:
      "https://lh3.googleusercontent.com/p/AF1QipMXA8Iqdm-z5B2soAWGPpx-jukCH4SmvUrwuTJD=s1360-w1360-h1020",
  },
  {
    name: "Valentino",
    address: "Silvassa Bhilad Highway",
    image:
      "https://lh3.googleusercontent.com/p/AF1QipPlemNeijjQofyVE6Mt8ATBKxRg6p-uunP2VW2-=s1360-w1360-h1020",
  },
  {
    name: "Mr.Bake",
    address: "Near Jamma Masjid, Silvassa",
    image:
      "https://lh3.googleusercontent.com/p/AF1QipPKJbOIQxIxTYcQzBDh6QbRhPm02qJXzLRveQUs=s1360-w1360-h1020",
  },
  {
    name: "KAVERI SWEET CORNER",
    address: "Opp. HDFC Bank, Silvassa",
    image:
      "https://lh3.googleusercontent.com/p/AF1QipNqKi6bBRbZANIlP7spepE8dG9SaYYfcZEuTMmu=s1360-w1360-h1020",
  },
];

const decorators = [
  {
    name: "S.S Party Shop and ballons decoration",
    address: "C/08, Sai Aura Complex, Ultan Faliya, Ring Road",
    image:
      "https://lh5.googleusercontent.com/p/AF1QipMqZ1UKxF88DQbXhw4u8lzh5JqkbbfOwQq2p6Hs=w141-h101-n-k-no-nu",
  },
  {
    name: "Home Decor & Gifts",
    address: "Shop no.15, Balaji complex, Naroli Rd",
    image:
      "https://lh3.googleusercontent.com/p/AF1QipM2zMIx4D0qyrYq5phmGYOWld8Grhyhpr7MSHI7=s1360-w1360-h1020",
  },
  {
    name: "Chintamani balloon store",
    address: "Flat No 622, C, Horizon Residency",
    image:
      "https://lh5.googleusercontent.com/p/AF1QipMzwBYwxxiFH0EsTFqsh7XYXd28hjC3_jNzlvpV=w141-h118-n-k-no-nu",
  },
  {
    name: "Poonam Novelty",
    address: "Swapna Market, 8, zhanda chowk",
    image:
      "https://lh5.googleusercontent.com/p/AF1QipNLNRJ32JNo7RNVnSYT8PRV9aU3fl4up4oENxDX=w325-h218-n-k-no",
  },
  {
    name: "Brothersballoonstore",
    address: "shop number 4, brother balloon Store",
    image:
      "https://lh5.googleusercontent.com/p/AF1QipMy5j-9ySWrUqMU4W8NvtxlPa0mMN0aTfWkbAaX=w325-h218-n-k-no",
  },
];

const food = [
  {
    name: "NS Biryani",
    address: "Shop Number 4/10, Bloch Complex, Solanki Sadan, Silvassa",
    image:
      "https://content.jdmagicbox.com/comp/silvassa/q3/9999px260.x260.220129235013.a8q3/catalogue/n-s-bombay-rasoya-silvassa-1tatz4qm5v-250.jpg",
  },
  {
    name: "Sofiya",
    address: "Kilvani Naka",
    image:
      "https://img.restaurantguru.com/r4ad-photo-sofia-lunch-home-2021-09-44933.jpg",
  },
  {
    name: "SFC",
    address: "Sfc Dhaba in Samarvarni, Silvassa",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq56APhpHrRF_eHIWpS7w9NoK_nCCa76kmAw&s",
  },
  {
    name: "The Big Tummy Restaurant",
    address: "Shop no.06, Prabhat Complex",
    image:
      "https://lh3.googleusercontent.com/p/AF1QipPtx8xMAW0AlLA0oPY1A8i2YCWTOqZf08BiRRwd=w162-h108-n-k-no",
  },
  {
    name: "The Roasters",
    address: "Ground Floor, Jas Luxuria, Shop NNo. 4, Naroli Rd",
    image:
      "https://lh5.googleusercontent.com/p/AF1QipOboTbvD4lVG1QzH36vSXb20vqIpfCakx1W7xZU=w162-h108-n-k-no",
  },
];

const hall = [
  {
    name: "VITS Kamats - Silvassa",
    address: "Naroli Road, opp. Swaminarayan Road",
    image:
      "https://lh3.googleusercontent.com/gps-proxy/ALd4DhHyV88k-9EU_V5TeKSs5rOvAKHkodMNI6E5Kr_HyCAr6Hd3MdfUZxhMtKVI-PY4J1oNnpOl096BEhaYZL-r2_z8Bz2E1B3XXNb8fkVn2ziDeMVPLaFLkRrfb90sN0gQTW0Nvu8QeQHW3hHHGP8Ylk9UoRLYwgD-44AcQeVCA4ggHv7BYQ_XtgMR=w325-h218-n-k-no",
  },
  {
    name: "Ras Resort ",
    address: "456 Theme Ave",
    image:
      "https://r2imghtlak.mmtcdn.com/r2-mmt-htl-image/htl-imgs/20071105163033460-ee993c5cf5e611ecb6230a58a9feac02.jpg",
  },
  {
    name: "DGV Resort",
    address: "789 Blossom Rd",
    image:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/26/c7/40/9a/hotel-facade.jpg?w=700&h=-1&s=1",
  },
  {
    name: "Khanvel Resort",
    address: "101 Fiesta Blvd",
    image:
      "https://content3.jdmagicbox.com/comp/silvassa/k4/9999px260.x260.101014144046.a3k4/catalogue/khanvel-resort-khanvel-silvassa-3-star-hotels-wtw5p58rk3.jpg",
  },
  {
    name: "Treate Resort",
    address: "202 Gala Ln",
    image:
      "https://z.cdrst.com/foto/hotel-sf/71273/granderesp/treat-resort-exterior-10895d44.jpg",
  },
];


const FamilyEvent = () => {
  const [user, setUser] = useState({
    name: "Alice",
    age: 24,
    city: "New York",
  });

  // Function to update a specific key in the object
  const updateUser = (key, value) => {
    setUser((prevUser) => ({
      ...prevUser, // Keep existing key-value pairs
      [key]: value, // Update the specific key
    }));
  };

  return (
    <div className="font-sans z-[21]">
      <div className="z-[21] ">
        {/* Navbar */}
        <NavBar homeLink={"/"} aniDelay={1.2} />

        {/* Hero Section */}
        <section id="home" className=" py-20 z-[3]">
          <div className="container mx-auto px-6 text-center ">
            <h1 className="text-4xl font-bold mb-6">
              Welcome to the Event Management
            </h1>
            <p className="dark:text-gray-400 text-gray-600">
              Stay ahead with the latest trends and insights in event
              management.
            </p>
          </div>
        </section>

        {/* Bakery Items Section */}
        <section id="bakery" className="container mx-auto px-6 py-10 ">
          <div className=" ">
            <h2
              className="text-2xl font-bold mb-6 flex items-center gap-2"
            >
              <FaBirthdayCake /> Bakery Vendor{" "}
            </h2>
            <div className=" ">
              <div className=" ">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bakeries.map((bakery, index) => (
                      <div>
                        <VendorComponent
                          key={index}
                          name={bakery.name}
                          address={bakery.address}
                          image={bakery.image}
                        />
                      </div>
                    ))}
                </div>
              </div>
              {/* <div className="bg-red-600 w-4/5 ">

          </div> */}
            </div>
          </div>
        </section>

        {/* Decoration Vendor Section */}
        <section id="decoration" className="container mx-auto px-6 py-10">
        <div className=" ">
            <h2
              className="text-2xl font-bold mb-6 flex items-center gap-2"
            >
              <FaBirthdayCake /> Decoration Vendor{" "}
            </h2>
            <div className=" ">
              <div className=" ">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                    {decorators.map((decorators, index) => (
                      <div>
                        <VendorComponent
                          key={index}
                          name={decorators.name}
                          address={decorators.address}
                          image={decorators.image}
                        />
                      </div>
                    ))}
                </div>
              </div>
              {/* <div className="bg-red-600 w-4/5 ">

          </div> */}
            </div>
          </div>
        </section>

        {/* Food Contractor Section */}
        <section id="decoration" className="container mx-auto px-6 py-10">
          <div className=" ">
            <h2
              className="text-2xl font-bold mb-6 flex items-center gap-2"
            >
              <FaBirthdayCake /> Food Vendor{" "}
            </h2>
            <div className=" ">
              <div className=" ">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {food.map((Food, index) => (
                      <div>
                        <VendorComponent
                          key={index}
                          name={Food.name}
                          address={Food.address}
                          image={Food.image}
                        />
                      </div>
                    ))}
                </div>
              </div>
              {/* <div className="bg-red-600 w-4/5 ">

          </div> */}
            </div>
          </div>
        </section>

        {/* Hall and Banquite Section */}
        <section id="decoration" className="container mx-auto px-6 py-10">
          <div className=" ">
            <h2
              className="text-2xl font-bold mb-6 flex items-center gap-2"
            >
              <FaWarehouse /> Hall and Banquite{" "}
            </h2>
            <div className=" ">
              <div className=" ">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hall.map((Hall, index) => (
                      <div>
                        <VendorComponent
                          key={index}
                          name={Hall.name}
                          address={Hall.address}
                          image={Hall.image}
                        />
                      </div>
                    ))}
                </div>
              </div>
              {/* <div className="bg-red-600 w-4/5 ">

          </div> */}
            </div>
          </div>
        </section>

        {/* <img
          src="https://readymadeui.com/bg-effect.svg"
          className="fixed inset-0 w-full h-full top-20 z-[1]"
        /> */}

        {/* Footer */}
        <footer className="bg-zinc-800 dark:bg-transparent text-white py-6">
          <div className="container mx-auto px-6 text-center">
            <p>&copy; 2025 Eventopia. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default FamilyEvent;
