"use client";
import DashboardLayout from "@/app/DashboardLayout";
import axios from "@/app/lib/axios";
import { getBusinessId } from "@/app/utils/user/userData";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import EmployeeTable from "./_components/EmployeeTable";
import { useFetchEmployees } from "./_features/hook";
import Pagination from "./_components/Pagination";
import InviteEmployee from "./_components/InviteEmployee";
import EmployeeLoading from "./loading";

const Employee = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const businessUserId = getBusinessId();

  const { isLoading, data: employees } = useFetchEmployees({
    axios,
    queryParams: {
      page,
      limit,
      businessUserId: businessUserId || undefined,
    },
  });

  const employeeData = employees?.data ?? [];
  const pagination = {
    page: employees?.page || 1,
    limit: employees?.limit || 10,
    total: employees?.total || 0,
    pages: Math.ceil((employees?.total || 0) / (employees?.limit || 10)),
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

  if (isLoading) return <EmployeeLoading />;

  return (
    <DashboardLayout>
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-black">Employees</h2>
        </div>
        <button
          className="bg-[#3352FF] rounded-md px-4 h-[36px] cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <div className="flex  items-center gap-2">
            <Plus size={18} color="white" />
            <span className="text-white">Invite Employee</span>
          </div>
        </button>
      </div>

      {/* department table  */}
      <div className="flex flex-col mt-5">


        {open && <InviteEmployee setOpen={setOpen} />}

        {isLoading ? (
          <EmployeeLoading />
        ) : (
          <>
            <EmployeeTable employeeData={employeeData ?? []} />
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
    </DashboardLayout>
  );
};

export default Employee;
