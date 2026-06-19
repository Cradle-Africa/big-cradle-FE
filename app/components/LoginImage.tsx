import { AnimatePresence, motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import bigCradleDashboardImg from "@/public/images/big cradle dashboard img.png";
import handsAndPapers from "@/public/images/hands and paper.png";
import boyWithComputer from "@/public/images/boy with computer.png";
import girlWithIpad from "@/public/images/girl with iPad.png";
import classNames from "classnames";
import { useEffect, useState } from "react";

const LoginImage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imagesList.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden md:flex h-screen items-stretch justify-center px-6 py-8">

      <div className="flex flex-col w-full flex-1 rounded-[28px] overflow-hidden shadow-2xl bg-white">

        <div className="relative flex-1 w-full overflow-hidden min-h-[400px]">

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{
                duration: 0.6,
                ease: [0.25, 0.25, 0.25, 1],
              }}
              className="absolute inset-0"
            >
              <img
        src={imagesList[currentIndex].imgPath.src}
        alt="login image"
        className="w-full h-full object-cover object-center"
      />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="p-8 bg-white">

          
          <div className="flex mb-4 items-center gap-2">
            {imagesList.map((_, index) => (
              <div
                key={index}
                onClick={() => setCurrentIndex(index)}
                className="cursor-pointer"
              >
                <div
                  className={classNames(
                    "transition-all duration-300",
                    {
                      "h-[6px] w-[24px] bg-black rounded-full": currentIndex === index,
                      "h-[6px] w-[6px] bg-black/40 rounded-full": currentIndex !== index,
                    }
                  )}
                />
              </div>
            ))}
          </div>

          
          <div className="max-w-[85%]">
            <p className="text-xl font-semibold text-black">
              {imagesList[currentIndex].title}
            </p>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              {imagesList[currentIndex].description}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};


type LoginImagePropsItem = {
  imgPath: StaticImageData;
  title: string;
  description: string;
};


const imagesList: LoginImagePropsItem[] = [
  {
    imgPath: bigCradleDashboardImg,
    title: "Your Growth Partner",
    description:
      "Whether you're a startup or an enterprise, Big Cradle is your partner in data transformation. We don’t just provide tools — we build with you.",
  },
  {
    imgPath: handsAndPapers,
    title: "Your Growth Partner",
    description:
      "Whether you're a startup or an enterprise, Big Cradle is your partner in data transformation. We don’t just provide tools — we build with you.",
  },
  {
    imgPath: girlWithIpad,
    title: "Ditch Spreadsheets, Embrace Insights",
    description:
      "What if you could replace 10 hours of manual reports with one click? Welcome to the future",
  },
  {
    imgPath: boyWithComputer,
    title: "Your Data, Our Experts",
    description:
      "Already have data? Let Big Cradle’s analytics team uncover the story inside your spreadsheets. We turn your data chaos into clarity and business results",
  },
];

export default LoginImage;