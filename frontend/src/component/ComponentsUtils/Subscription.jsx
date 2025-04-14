import React, { useState } from "react";
import { ButtonBtmUp } from "../Theme/Button";

export const Subscription = () => {
  const [commonPlans, setCommonPlans] = useState([
    {
      available: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          class="mr-4 fill-green-500"
          viewBox="0 0 24 24"
        >
          <path
            d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
            data-original="#000000"
          />
        </svg>
      ),

      feature: "Create Unlimited Events",
    },

    {
      available: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          class="mr-4 fill-green-500"
          viewBox="0 0 24 24"
        >
          <path
            d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
            data-original="#000000"
          />
        </svg>
      ),

      feature: "Hire Vendors",
    },
  ]);

  const [freePlans, setFreePlans] = useState([
    {
      available: (
        <svg
          width="15"
          height="15"
          className=" rotate-45 mr-4 "
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="40" y="10" width="20" height="80" fill="red" />
          <rect x="10" y="40" width="80" height="20" fill="red" />
        </svg>
      ),

      feature: "Add Collaborator",
    },

    {
      available: (
        <svg
          width="15"
          height="15"
          className=" rotate-45 mr-4 "
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="40" y="10" width="20" height="80" fill="red" />
          <rect x="10" y="40" width="80" height="20" fill="red" />
        </svg>
      ),
      feature: "Hire Proffessional Assitant",
    },
  ]);

  const [premiumPlans, setPremiumPlans] = useState([
    {
      available: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          class="mr-4 fill-white"
          viewBox="0 0 24 24"
        >
          <path
            d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
            data-original="#000000"
          />
        </svg>
      ),

      feature: "Add Collaborator",
    },

    {
      available: (
        <svg
          width="15"
          height="15"
          className=" rotate-45 mr-4 "
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="40" y="10" width="20" height="80" fill="pink" />
          <rect x="10" y="40" width="80" height="20" fill="pink" />
        </svg>
      ),
      feature: "Hire Proffessional Assitant",
    },
  ]);

  const [professionalPlans, setProfessionalPlans] = useState([
    {
      available: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          class="mr-4 fill-green-500"
          viewBox="0 0 24 24"
        >
          <path
            d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
            data-original="#000000"
          />
        </svg>
      ),

      feature: "Add Collaborator",
    },

    {
      available: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          class="mr-4 fill-green-500"
          viewBox="0 0 24 24"
        >
          <path
            d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
            data-original="#000000"
          />
        </svg>
      ),
      feature: "Hire Proffessional Assitant",
    },
  ]);

  return (
    <div class="dark:bg-[#1a1a1a] dark:text-white mt-32 max-w-7xl mx-auto">
      <div class="text-center">
        <h2 class="md:text-4xl text-3xl font-extrabold">
          Choose a Subscription
        </h2>
      </div>
      <div class="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mt-16 max-md:max-w-lg max-md:mx-auto">
        <div class="group relative bg-white dark:bg-zinc-800 rounded-md sm:p-6 p-4 transform transition-transform duration-500 ease-in-out hover:rotate-0 hover:scale-105 shadow-lg dark:shadow-white/50 hover:shadow-xl">
          <h3 class="text-xl font-semibold">Free</h3>
          <p class="mt-2">
            Ideal for individuals who need quick access to basic features.
          </p>
          <div class="mt-6">
            <h2 class="text-4xl font-semibold">
              $0<span class="text-gray-500 ml-2 text-[15px]">/ Month</span>
            </h2>
            <button type="button" class="w-full mt-6">
              <ButtonBtmUp
                title={"Get Started"}
                bgColor={"bg-blue-500"}
                textColor={"text-white"}
                hoverTextColor={"text-black"}
                hoverBgColor={"bg-zinc-100"}
                w={"w-full"}
                h={"h-10"}
                rounded={"rounded-full"}
              />
            </button>
          </div>
          <div class="mt-6">
            <h4 class="text-base font-bold mb-4">Plan Includes</h4>
            <ul class="space-y-5">
              {commonPlans.map((item, index) => (
                <li class="flex items-center">
                  {item.available}
                  {item.feature}
                </li>
              ))}
              {freePlans.map((item, index) => (
                <li class="flex items-center">
                  {item.available}
                  {item.feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div class="group relative bg-blue-600 rounded-md sm:p-6 p-4 text-white shadow-lg shadow-blue-300/50 dark:shadow-blue-300 transform transition-transform duration-300 ease-in-out hover:rotate-0 hover:scale-105 hover:shadow-xl">
          <h3 class="text-xl font-semibold">Premium</h3>
          <p class="mt-2">
            Ideal for individuals who need advanced features and tools for
            client work.
          </p>
          <div class="mt-6">
            <h2 class="text-4xl font-semibold">
              $25<span class="text-gray-200 ml-2 text-[15px]">/ Month</span>
            </h2>
            <div type="button" class="w-full mt-6 ">
              <ButtonBtmUp
                title={"Get Started"}
                rounded={"rounded-full"}
                bgColor={"bg-zinc-300"}
                textColor={"text-black"}
                hoverTextColor={"text-black"}
                hoverBgColor={"bg-white"}
                w={"w-full"}
                h={"h-10"}
              />
            </div>
          </div>
          <div class="mt-6">
            <h4 class="text-base font-bold mb-4">Plan Includes</h4>
            <ul class="space-y-5">
              {commonPlans.map((item, index) => (
                <li class="flex items-center">
                  {item.available}
                  {item.feature}
                </li>
              ))}
              {premiumPlans.map((item, index) => (
                <li class="flex items-center">
                  {item.available}
                  {item.feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div class="group relative bg-white dark:bg-zinc-800 rounded-md sm:p-6 p-4 transform transition-transform duration-500 ease-in-out hover:rotate-0 hover:scale-105 shadow-lg dark:shadow-white/50 hover:shadow-xl">
          <h3 class="text-xl font-semibold">Professional</h3>
          <p class="mt-2">
            Ideal for businesses who need personalized services and security for
            large teams.
          </p>
          <div class="mt-6">
            <h2 class="text-4xl font-semibold">
              $100<span class="text-gray-500 ml-2 text-[15px]">/ Month</span>
            </h2>
            <button type="button" class="w-full mt-6">
              <ButtonBtmUp
                rounded={"rounded-full"}
                title={"Get Started"}
                bgColor={"bg-blue-500"}
                textColor={"text-white"}
                hoverTextColor={"text-black"}
                hoverBgColor={"bg-zinc-100"}
                w={"w-full"}
                h={"h-10"}
              />
            </button>
          </div>
          <div class="mt-6">
            <h4 class="text-base font-bold mb-4">Plan Includes</h4>
            <ul class="space-y-5">
              {commonPlans.map((item, index) => (
                <li class="flex items-center">
                  {item.available}
                  {item.feature}
                </li>
              ))}
              {professionalPlans.map((item, index) => (
                <li class="flex items-center">
                  {item.available}
                  {item.feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
