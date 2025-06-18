"use client";

import {
  Building2,
  ChevronDown,
  ChevronUp,
  File,
  House,
  MonitorCog,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { JSX, useState } from "react";
import SideBarWrapper from "./SideBarWrapper";

export default function SuperAdminSidebar() {
  const [open, setOpen] = useState(false);
  const [usersMenuOpen, setUsersMenuOpen] = useState(false);

  return (
    <SideBarWrapper>
      <ul className="flex flex-col space-y-2 mt-2 px-4">
        <li>
          <Link
            href="/"
            className="block py-2 px-3 rounded hover:bg-gray-200 transition"
          >
            <div className="flex gap-1 items-center">
              <House size={15} />
              Dashboard
            </div>
          </Link>
        </li>
        <span className="flex md:py-1 px-3 border-t border-gray-100 text-xs text-gray-400">
          People
        </span>
        <li>
          <div
            onClick={() => setUsersMenuOpen(!usersMenuOpen)}
            className="block py-2 px-3 rounded hover:bg-gray-200 transition cursor-pointer"
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
                href="/pages/user/business/"
                className="py-1 px-3 rounded hover:bg-gray-200 transition text-sm flex items-center gap-2"
              >
                <Building2 size={14} />
                Businesses
              </Link>
            </div>
          )}
        </li>
      </ul>
    </SideBarWrapper>
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
  }
];