import React from 'react'
// import SubsBg from '../../public/image/SubsBg.jpg'
import { Link } from 'react-router-dom';

const SubscriptionAds = () => {
  return (
    <div className="px-3 w-full h-full ">
      <div className="w-fit h-fit py-4 bg-gradient-to-br dark:from-zinc-400 from-zinc-700 dark:to-blue-600 to-blue-600 rounded-lg p-2 flex flex-col justify-center items-center max-lg:gap-1 gap-2">
        <div className="text-zinc-100 text-xl font-semibold font-['Founders_Grotesk']">
          Upgrade to PRO
        </div>
        <div className="text-zinc-100 text-center font-['Founders_Grotesk'] text-md tracking-wide ">
          Get access to additional features and more
        </div>
        <Link
          to={"/subscriptionPage"}
          className="text-zinc-100 font-['Founders_Grotesk_Condensed'] font-semibold text-md tracking-wider text-center bg-zinc-700/50 hover:bg-zinc-700 transition-all duration-150 w-[50%] px-3 py-2 rounded-lg "
        >
          Upgrade
        </Link>
      </div>
    </div>
  );
}

export default SubscriptionAds