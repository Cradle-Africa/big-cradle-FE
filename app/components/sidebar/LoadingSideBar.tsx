"use client";
import Link from "next/link";
import { useState } from "react";
import SideBarWrapper from "./SideBarWrapper";
export default function LoadingSidebar() {
  const [open, setOpen] = useState(false);

  return <SideBarWrapper></SideBarWrapper>;
}
