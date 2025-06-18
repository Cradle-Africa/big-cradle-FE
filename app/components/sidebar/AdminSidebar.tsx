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
import { usePathname } from "next/navigation";
import classNames from "classnames";

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const [usersMenuOpen, setUsersMenuOpen] = useState(false);
  const currentPath = usePathname();

  return (
    <SideBarWrapper>
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
              <div className="flex gap-1 items-center ">
                {link.icon}
                {link.label}
              </div>
            </Link>
          </li>
        ))}
        <li>
          <div
            onClick={() => setUsersMenuOpen(!usersMenuOpen)}
            className={classNames({
              "block py-2 px-3 rounded hover:bg-gray-200 hover:text-[#002648] transition":
                true,
            })}
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
                className="py-1 px-3 rounded hover:bg-gray-200 hover:text-[#002648] transition text-sm flex items-center gap-2"
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
}[] = [{ label: "Dashboard", href: "/", icon: <House size={15} /> }];
