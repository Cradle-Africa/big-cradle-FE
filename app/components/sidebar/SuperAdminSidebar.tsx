"use client";
import classNames from "classnames";
import {
  Building2,
  ChevronDown,
  ChevronUp,
  File,
  House,
  User,
  Users,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { JSX, useState } from "react";
import SideBarWrapper from "./SideBarWrapper";
export default function SuperAdminSidebar() {
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
                "bg-gray-200 text-[#002648] ":
                  currentPath === link.href.split("?")[0],
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
                href="/pages/user/user-management/"
                className="py-1 px-3 rounded hover:text-[#002648] hover:bg-gray-200 transition text-sm flex items-center gap-2"
              >
                <User size={14} />
                User management
              </Link>
              <Link
                href="/pages/user/business/"
                className="py-1 px-3 rounded hover:text-[#002648] hover:bg-gray-200 transition text-sm flex items-center gap-2"
              >
                <Building2 size={14} />
                Businesses
              </Link>
              <Link
                href="/pages/user/business/business-kyc/"
                className="py-1 px-3 rounded hover:text-[#002648] hover:bg-gray-200 transition text-sm flex items-center gap-2"
              >
                <Building2 size={14} />
                Businesses KYC
              </Link>
              <Link
                href="/pages/user/admin/admin-kyc/"
                className="py-1 px-3 rounded hover:text-[#002648] hover:bg-gray-200 transition text-sm flex items-center gap-2"
              >
                <Building2 size={14} />
                Investors KYC
              </Link>
              <Link
                href="/pages/user/employee/"
                className="py-1 px-3 rounded hover:text-[#002648] hover:bg-gray-200 transition text-sm flex items-center gap-2"
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
    label: "Survey",
    href: "/pages/survey?status=active&page=1",
    icon: <File size={15} />,
  },
];
