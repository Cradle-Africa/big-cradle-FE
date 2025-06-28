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

const Department = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const businessUserId = getBusinessId();

  const { isLoading, data: departments } = useFetchDepartments({
    axios,
    queryParams: {
      page: 1,
      limit: 10,
      businessUserId: businessUserId || undefined,
    },
  });

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
          className="bg-[#3352FF] rounded-[8px] px-4 h-[36px] cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <div className="flex fgap2 items-center gap-2">
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
          <DepartmentTable data={departments ?? []} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Department;
