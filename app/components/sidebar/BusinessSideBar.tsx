"use client";

import {
  Building2,
  ChevronDown,
  ChevronUp,
  File,
  House,
  Menu,
  MonitorCog,
  MonitorIcon,
  Users,
  UsersRound,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { JSX, useState } from "react";
import whiteLogo from "@/public/images/white-logo.png";
import { usePathname } from "next/navigation";
import classNames from "classnames";

export default function BusinessSideBar() {
  const [open, setOpen] = useState(false);
  const [usersMenuOpen, setUsersMenuOpen] = useState(false);
  const currentPath = usePathname();

  return (
    <div
      className={`h-full rounded-md  lg:w-64 flex flex-col px-3 py-2 md:bg-[#002648] bg-amber-200`}
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
                  src={whiteLogo}
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
              src={whiteLogo}
              width={100}
              height={13}
              alt="Logo"
              className={` ${open ? "hidden" : "w-auto h-13"}`}
            />
          </Link>
          <div className="h-[1px] bg-[#004484] my-4" />
          <ul
            className="bg-[#004484] rounded-lg mt-4 text-[#C1C1C1] p-4 flex flex-col gap-4
          "
          >
            {sideBarLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href} //
                  className={classNames({
                    "block py-2 px-3 rounded hover:bg-gray-200 hover:text-[#002648] transition":
                      true,
                    "bg-gray-200 text-[#002648] ": currentPath === link.href,
                  })}
                >
                  <div className="flex gap-1 items-center gap-2">
                    {link.icon}
                    {link.label}
                  </div>
                </Link>
              </li>
            ))}
            <li>
              <div
                onClick={() => setUsersMenuOpen(!usersMenuOpen)}
                className="block py-2 px-3 rounded hover:bg-gray-200 hover:text-[#002648] transition cursor-pointer"
              >
                <div className="flex gap-1 items-center justify-between">
                  <div className="flex gap-1 items-center">
                    <UsersRound size={15} />
                    Users & Access
                  </div>
                  {usersMenuOpen ? (
                    <ChevronUp size={15} />
                  ) : (
                    <ChevronDown size={15} />
                  )}
                </div>
              </div>
              {usersMenuOpen && (
                <div className="ml-6 mt-1 space-y-1">
                  <Link
                    href="/pages/user/business/business-kyc/"
                    className="py-1 px-3 rounded hover:bg-gray-200 hover:text-[#002648]  transition text-sm flex items-center gap-2"
                  >
                    <Building2 size={14} />
                    Businesses KYC
                  </Link>
                  <Link
                    href="/pages/user/employee/"
                    className="py-1 px-3 rounded hover:bg-gray-200 hover:text-[#002648]  transition text-sm flex items-center gap-2"
                  >
                    <Users size={14} />
                    Employees
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
const sideBarLinks: {
  label: string;
  href: string;
  icon: JSX.Element;
}[] = [
  { label: "Dashboard", href: "/", icon: <House size={15} /> },
  {
    label: "Survey",
    href: "/pages/user/survey",
    icon: <File size={15} />,
  },
  {
    label: "Department",
    href: "/pages/user/department",
    icon: <MonitorCog size={15} />,
  },
];
