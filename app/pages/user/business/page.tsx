'use client'
import React from 'react'
import DashboardLayout from '@/app/DashboardLayout';
import axios from "@/app/lib/axios";
import { Mail } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import BusinessTable from "./_components/BusinessTable";
import InviteBusiness from "./_components/InviteBusiness";
import BusinessLoading from "./loading";
import Pagination from './_components/Pagination';
import { getAdminUserId } from '@/app/utils/user/userData';
import { useFetchBusinesses } from './_features/hook';

const Business = () => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const adminUserId = getAdminUserId()

    const { isLoading, data: businessesData } = useFetchBusinesses({
        axios,
        queryParams: {
            page,
            limit,
            adminUserId
        },
    });

    console.log('data:', businessesData)

    const businessList = businessesData?.data ?? [];
    const pagination = {
        page: Number(businessesData?.page) || 1,
        limit: Number(businessesData?.limit) || 10,
        total: Number(businessesData?.total) || 0,
        pages: Math.ceil(Number(businessesData?.total || 0) / Number(businessesData?.limit || 10)),
    };

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [setOpen]);

    if (isLoading) return <BusinessLoading />;

    return (
        <DashboardLayout>
            <div className="flex justify-between">
                <div className="flex flex-col gap-2">
                    <h2 className="font-bold text-black">Organizations</h2>
                </div>
                <button
                    className="bg-[#3352FF] rounded-[8px] px-4 h-[36px] cursor-pointer"
                    onClick={() => setOpen(true)}
                >
                    <div className="flex items-center gap-2">
                        <Mail size={14} color="white" className='inline-block' />
                        <span className="text-white">Invite a new organization</span>
                    </div>
                </button>
            </div>

            {/* department table  */}
            <div className="flex flex-col mt-5">

                <div className="relative xs:w-90 sm:w-93 sm:min-w-full rounded-md" key="table-container">
                    {open && <InviteBusiness setOpen={setOpen} />}
                    {isLoading ? (
                        <BusinessLoading />
                    ) : (
                        <>
                            <div className=' bg-white'>
                                <BusinessTable data={businessList ?? []} />

                            </div>

                            <Pagination
                                currentPage={pagination.page}
                                totalPages={pagination.pages}
                                limit={pagination.limit}
                                onPageChange={(newPage) => setPage(newPage)}
                                onLimitChange={(newLimit) => {
                                    setLimit(newLimit);
                                    setPage(1); // Reset to page 1 on limit change
                                }}
                            />
                        </>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Business;
