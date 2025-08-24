"use client";

import classNames from "classnames";
import {
  ChevronDown,
  ChevronUp,
  Database,
  File,
  House,
  MonitorCog,
  // ChartNoAxesCombined,
  Users,
  UsersRound,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { JSX, useState } from "react";
import SideBarWrapper from "./SideBarWrapper";
import { getBusinessId } from "@/app/utils/user/userData";

export default function BusinessSideBar() {
  const [usersMenuOpen, setUsersMenuOpen] = useState(false);
  const currentPath = usePathname();
  const businessId = getBusinessId();

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
                href={`/pages/user/employee/${businessId}`}
                className="py-1 px-3 rounded hover:bg-gray-200 hover:text-[#002648]  transition text-sm flex items-center gap-2"
              >
                <Users size={14} />
                Employees
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
      label: "Research and Survey",
      href: "/pages/survey?status=all&page=1",
      icon: <File size={15} />,
    },
    {
      label: "Data Flywheel",
      href: "/pages/flywheel",
      icon: <Database size={15} />,
    },
    {
      label: "Wallet",
      href: "/pages/wallet",
      icon: <Wallet size={15} />,
    },
    // {
    //   label: "Social Media",
    //   href:"/pages/flywheel/social-media",
    //   icon: <ChartNoAxesCombined size={15} />,
    // },
    {
      label: "Department",
      href: "/pages/user/department",
      icon: <MonitorCog size={15} />,
    },
  ];
