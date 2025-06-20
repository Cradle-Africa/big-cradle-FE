"use client";

import classNames from "classnames";
import {
  House
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { JSX } from "react";
import SideBarWrapper from "./SideBarWrapper";

export default function EmployeeSidebar() {
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
      </ul>
    </SideBarWrapper>
  );
}

const sideBarLinks: {
  label: string;
  href: string;
  icon: JSX.Element;
}[] = [{ label: "Dashboard", href: "/", icon: <House size={15} /> }];
