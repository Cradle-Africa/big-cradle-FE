"use client";
import React, { useState, useRef, useEffect } from "react";
import { Search, Bell, ChevronRight, CircleUser, LogOut, X, Eye } from "lucide-react";
import { useUser } from "../hooks/useUser";
import Image from "next/image";
import TopBarSkeleton from "./skeleton/TopBarSkeleton";
import { removeUser } from "../utils/user/userData";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Topbar = () => {
    const [openProfile, setOpenProfile] = useState(false);
    const [query, setQuery] = useState("");
    const user = useUser();
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpenProfile(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/pages/search?q=${encodeURIComponent(query)}`);
        }
    };

    if (!user) {
        return <TopBarSkeleton />;
    }

    return (
        <>
            <div className="relative ml-0 md:ml-[550px] md:mb-16 lg:ml-[650px] xl:ml-[300px]">
                <div className="md:fixed z-50 bg-white border-b border-gray-300  lg:left-[650px] xl:left-[290px] right-0 flex justify-end md:justify-between pl-5 pr-2 pt-5 pb-4">
                    {/* SEARCH FORM */}
                    <form onSubmit={handleSearch} className="hidden relative lg:flex items-center">
                        <Search className="absolute left-3 text-gray-300 w-4 h-4 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search for something..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="hidden lg:block pl-10 pr-3 py-2 md:w-72 border bg-white border-gray-300 text-sm rounded-md focus:outline-none"
                        />
                    </form>

                    {/* Profile / notifications */}
                    <div className="flex justify-between gap-2 md:gap-3 items-center">
                        <Bell className="hidden md:block w-8 h-8 p-2 rounded-full bg-[#F3F3F3] text-black" />

                        {user?.profilePicture ? (
                            <Image
                                src={user?.profilePicture}
                                width={8}
                                height={8}
                                alt="profile image"
                                className="rounded-full w-8 h-8 hover:cursor-pointer"
                                onClick={() => setOpenProfile(!openProfile)}
                            />
                        ) : (
                            <CircleUser
                                className="rounded-full w-8 h-8 hover:cursor-pointer"
                                onClick={() => setOpenProfile(!openProfile)}
                            />
                        )}

                        <div
                            className="flex flex-col hover:cursor-pointer"
                            onClick={() => setOpenProfile(!openProfile)}
                        >
                            <span className="hidden lg:inline text-xs font-semibold">
                                {user?.fullName ?? user?.contactPersonFirstName ?? user?.firstName}{" "}
                                {user?.contactPersonLastName ?? user?.lastName}
                            </span>
                            <span className="inline lg:hidden text-xs font-semibold">
                                {user?.fullName?.slice(0, 12) ??
                                    user?.contactPersonFirstName ??
                                    user?.firstName}
                            </span>
                            <span className="text-xs text-gray-500">
                                {user?.businessName ? user?.businessName.slice(0, 15) : user?.role}
                            </span>
                        </div>
                        <ChevronRight
                            onClick={() => setOpenProfile(!openProfile)}
                            className="w-4 h-4 text-gray-500 hover:cursor-pointer"
                        />
                    </div>
                </div>

                {/* Profile dropdown */}
                {openProfile && (
                    <div
                        className="absolute md:w-72 z-60 right-0 shadow-xl bg-white px-3 py-2 md:px-5 md:py-5 rounded-xl"
                        ref={menuRef}
                    >
                        <X
                            onClick={() => setOpenProfile(!openProfile)}
                            size={15}
                            className="absolute right-2 md:right-5 hover:cursor-pointer lg:hidden"
                            color="red"
                        />
                        <p className="text-sm">My Profiles</p>
                        <div className="inline-flex w-full space-x-3 mt-5 bg-gray-50 rounded-lg px-3 py-3">
                            {user?.profilePicture ? (
                                <Image
                                    src={user?.profilePicture}
                                    width={5}
                                    height={5}
                                    alt="profile image"
                                    className="rounded-full w-8 h-8"
                                />
                            ) : (
                                <CircleUser className="rounded-full w-10 h-10" />
                            )}

                            <div className="flex flex-col text-black">
                                <span className="text-sm font-semibold ">
                                    {user?.fullName ??
                                        `${user?.contactPersonFirstName ?? ""} ${user?.contactPersonLastName ?? ""}`.trim() ??
                                        `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim()}
                                </span>
                                <span className="text-xs">
                                    {user?.businessName ? user?.businessName.slice(0, 15) : user?.role}
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 mt-5 pt-5">
                            <p className="text-sm text-gray-700">Other actions</p>
                            <Link
                                href="/pages/user/profile"
                                className="w-full flex items-center justify-start px-2 rounded-md mt-2 text-md hover:cursor-pointer hover:bg-gray-100  py-2"
                            >
                                <Eye size={14} className="mr-1 inline" />
                                View my profile
                            </Link>
                            <button
                                className="w-full flex items-center justify-start px-2 mt-2 rounded-md  text-md hover:cursor-pointer hover:bg-gray-100  py-2"
                                onClick={() => removeUser()}
                            >
                                <LogOut size={12} className="inline mr-1" />
                                Logout of my account
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Topbar;
