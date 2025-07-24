"use client";
import DashboardLayout from "@/app/DashboardLayout";
import axios from "@/app/lib/axios";
import { getBusinessId } from "@/app/utils/user/userData";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import DepartmentTable from "./_components/DepartmentTable";
import NewDepartment from "./_components/NewDepartment";
import { useFetchDepartments } from "./_features/hook";
import DepartmentLosding from "./loading";
import Pagination from "./_components/Pagination";

const Department = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const businessUserId = getBusinessId();

  const { isLoading, data: departments } = useFetchDepartments({
    axios,
    queryParams: {
      page,
      limit,
      businessUserId: businessUserId || undefined,
    },
  });

  const departmentData = departments?.data ?? [];
  const pagination = {
    page: departments?.page || 1,
    limit: departments?.limit || 10,
    total: departments?.total || 0,
    pages: Math.ceil((departments?.total || 0) / (departments?.limit || 10)),
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

  if (isLoading) return <DepartmentLosding />;

  return (
    <DashboardLayout>
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-black">Departments</h2>
        </div>
        <button
          className="bg-[#3352FF] rounded-md px-4 h-[36px] cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <div className="flex  items-center gap-2">
            <Plus size={18} color="white" />
            <span className="text-white">Create Department</span>
          </div>
        </button>
      </div>

      {/* department table  */}
      <div className="flex flex-col bg-white mt-5">


        {open && <NewDepartment setOpen={setOpen} />}

        {isLoading ? (
          <DepartmentLosding />
        ) : (
          <>
            <DepartmentTable departmentData={departmentData ?? []} />
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

export default Department;
