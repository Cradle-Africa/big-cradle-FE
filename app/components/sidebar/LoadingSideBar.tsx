"use client";
import {
    Menu,
    X
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
export default function LoadingSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`z-10 md:fixed md:h-screen lg:w-64 flex flex-col px-3 py-2 rounded-br md:bg-white rounded-md md:border-b border-gray-200 ${
        open ? "fixed shadow bg-white" : "absolute "
      } `}
    >
      {/* Mobile toggle - unchanged */}
      <div
        className={` ${
          open ? "" : "border border-gray-200"
        } md:hidden rounded-md mt-3 md:mt-0 px-2 py-1 md:p-4 flex justify-between items-center`}
      >
        <button
          onClick={() => setOpen(!open)}
          className="text-gray-500 hover:cursor-pointer"
        >
          {open ? (
            <div className="flex items-center justify-between">
              <Link href="/">
                <Image
                  src={"/logo.png"}
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
    </div>
  );
}
