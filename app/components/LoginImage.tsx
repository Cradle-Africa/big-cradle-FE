import { AnimatePresence, motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";
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
    <div className="hidden md:block w-3/4 relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 1, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 1, x: 1 }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.25, 0.25, 1],
          }}
          className="absolute top-0 left-0 w-full h-full"
          style={{ zIndex: 1 }}
        >
          <LoginImageItem
            imgPath={imagesList[currentIndex].imgPath}
            title={imagesList[currentIndex].title}
            description={imagesList[currentIndex].description}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

type LoginImagePropsItem = {
  imgPath: StaticImageData;
  title: string;
  description: string;
  currentIndex: number;
  setCurrentIndex: (val: number) => void;
};

const LoginImageItem = ({
  imgPath,
  title,
  description,
  currentIndex,
  setCurrentIndex,
}: LoginImagePropsItem) => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <Image
        src={imgPath}
        alt="big cradle Sign up"
        quality={100}
        priority
        fill
        className="object-cover"
      />
      <div className="absolute bottom-16 left-16 right-16 text-white h-[120px] flex flex-col justify-between">
        <div className="flex mb-4 items-center">
          {imagesList.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="w-[20px] flex justify-center cursor-pointer"
            >
              <div
                className={classNames({
                  "h-[20px] w-[4px] bg-white rounded-full":
                    currentIndex !== index,
                  "h-[6px] w-[6px] bg-white rounded-full":
                    currentIndex === index,
                })}
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-white font-semibold">{title}</p>
          <p className="text-white mt-2">{description}</p>
        </div>
      </div>
    </div>
  );
};

const imagesList: {
  imgPath: StaticImageData;
  title: string;
  description: string;
}[] = [
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
