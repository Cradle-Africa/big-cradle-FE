import LogoWithText from "@/public/images/white-logo-with-text.png";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PropsWithChildren, useState } from "react";

const SideBarWrapper = ({ children }: PropsWithChildren) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`h-full rounded-md  lg:w-64 flex flex-col py-2 md:bg-[#002648] `}
    >
      {/* Mobile toggle - unchanged */}
      <div
        className={` ${
          open ? "" : "border border-gray-200"
        } md:hidden mt-3 md:mt-0 px-2 py-1 md:p-4 flex justify-between items-center`}
      >
        <button
          onClick={() => setOpen(!open)}
          className="text-gray-500 hover:cursor-pointer"
        >
          {open ? (
            <div className="flex items-center justify-between">
              <Link href="/">
                <Image
                  src={LogoWithText}
                  width={150}
                  height={13}
                  alt="Logo"
                  className=""
                />
              </Link>
              <X size={15} className="text-red-500" />
            </div>
          ) : (
            <Menu size={25} className="" />
          )}
        </button>
      </div>

      {/* Menu list */}
      <div
        className={`lg:flex flex-col justify-between text-sm flex-grow ${
          open ? "block" : "hidden"
        } lg:block`}
      >
        <div className="flex flex-col space-y-2 mt-2 px-4">
          <Link href="/">
            <Image
              src={LogoWithText}
              width={100}
              height={13}
              alt="Logo"
              className={` ${open ? "hidden" : "w-auto h-13"}`}
            />
          </Link>
          <div className="h-[1px] bg-[#004484] my-4" />
          {children}
        </div>
      </div>
    </div>
  );
};

export default SideBarWrapper;
