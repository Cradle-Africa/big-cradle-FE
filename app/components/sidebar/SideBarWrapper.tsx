import LogoWithTextWhite from "@/public/images/white-logo-with-text.png";
import LogoWithText from "@/public/images/logo-with-text.png";

import { FilePlus, Menu, Plus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PropsWithChildren, useState } from "react";

const SideBarWrapper = ({ children }: PropsWithChildren) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={` ${open ? 'bg-white shadow-md' : ''} h-full rounded-md mt-[-10px] lg:mt-0 px-5 lg:px-0 lg:w-64 flex flex-col pt-2 pb-10 lg:bg-[#002648] `}
    >
      {/* Mobile toggle - unchanged */}
      <div
        className={` ${open ? "" : "border border-gray-200 rounded-md bg-white"
          } lg:hidden lg:mt-3 md:mt-0 px-2 py-1 md:p-2 lg:p-4 flex justify-between items-center`}
      >
        <button
          onClick={() => setOpen(!open)}
          className="text-gray-500 hover:cursor-pointer"
        >
          {open ? (
            <div className="flex w-52 items-center justify-between">
              <Link href="/">
                <Image
                  src={LogoWithText}
                  width={150}
                  height={13}
                  alt="Logo"
                  className=""
                />
              </Link>
              <X size={15} className="text-red-500 cursor-pointer" />
            </div>
          ) : (
            <Menu size={25} className="rounded-md cursor-pointer" />
          )}
        </button>
      </div>

      {/* Menu list */}
      <div
        className={`lg:flex flex-col justify-between text-sm flex-grow ${open ? "block" : "hidden"
          } lg:block`}
      >
        <div className="flex flex-col space-y-2 mt-2 lg:px-4">
          <Link href="/">
            <Image
              src={LogoWithTextWhite}
              width={100}
              height={13}
              alt="Logo"
              className={` ${open ? "hidden" : "w-auto h-13"}`}
            />
          </Link>
          <div className="h-[1px] w-full bg-[#004484] my-4" />
          {children}
        </div>
        <div className="bg-[#2B99FA] mt-5 md:mt-auto rounded-lg mx-4 p-3 text-white">
          <h2 className="flex items-center text-md font-semibold">
            <FilePlus size={14} className="inline mr-1"  />
            Survey
          </h2>
          <p className="mt-2">Get tje right linkto share to get easy feedback from users</p>
          <Link
            href="/pages/survey/new?survey=survey-name-and-description"
            className="flex justify-center items-center bg-white text-[#2B99FA] rounded-md py-2 mt-2"
          >
            <Plus size={18} color={'#2B99FA'} />
            <span className="">Create new survey</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SideBarWrapper;
