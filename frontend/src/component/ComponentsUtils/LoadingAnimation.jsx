import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const OchiLoadingScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return oldProgress + 1;
      });
    }, 20);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen font-['Founders_Grotesk'] bg-black relative">
      {[...Array(4)].map((_, index) => (
        <motion.div
          key={index}
          initial={{
            x: index % 2 === 0 ? -250 : 250,
            opacity: 0,
            scale: 0.9 - index * 0.03,
          }}
          animate={{ x: 0, opacity: 1, scaleX: 1.14 }}
          transition={{ delay: index * 0.5, duration: 0.7 }}
          className="absolute bg-gray-300 dark:bg-zinc-700 p-10 rounded-lg border-white shadow-sm shadow-black w-[74%] h-[81%] text-black dark:text-white text-center "
          style={{ zIndex: index }}
        />
      ))}

      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-zinc-800 text-black dark:text-white p-10 rounded-lg shadow-sm shadow-black w-3/4 h-3/4 flex flex-col justify-center items-center text-center relative z-10"
      >
        {/* <img
          src="https://readymadeui.com/bg-effect.svg"
          alt=""
          className=" absolute inset-0 w-full h-full"
        /> */}

        <motion.h1
          transition={{ delay: 0.5, duration: 1 }}
          className="text-5xl font-bold font-['Founders_Grotesk']"
        >
          Effortless Event Planning <br /> at Your Fingertips!
        </motion.h1>

        <motion.div
        className=""
        >
          <motion.div className="absolute bottom-4 left-4 text-3xl font-['Founders_Grotesk'] font-bold ">
            Loading...
          </motion.div>
          <motion.div
            className="absolute bottom-4 right-4 text-3xl font-bold"
            transition={{ delay: 0.5, duration: 1 }}
          >
            {progress} %
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};
