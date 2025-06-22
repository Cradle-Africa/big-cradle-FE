"use client";
import DashboardLayout from "@/app/DashboardLayout";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import DepartmentTable from "./_components/DepartmentTable";
import axios from "@/app/lib/axios";
<<<<<<< HEAD
import { useFetchDepartments } from "./_features/hook";
import DepartmentLosding from "./loading";
=======
import { useFetchDepartments } from './_features/hook'
import DepartmentLoading from "./loading";
>>>>>>> db4e88c846432b80ebda4c7a6c8d31aaa829ff53
import { getBusinessId } from "@/app/utils/user/userData";
import NewDepartment from "./_components/NewDepartment";

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

<<<<<<< HEAD
  if (isLoading) return <DepartmentLosding />;
=======
    
    return (
        <DashboardLayout>
            <div className="flex justify-between">
                <div className="flex flex-col gap-2">
                    <p className="font-medium text-black">Departments</p>
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
>>>>>>> db4e88c846432b80ebda4c7a6c8d31aaa829ff53

  return (
    <DashboardLayout>
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <p className="font-medium text-black">Departments</p>
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
      <div className="flex flex-col bg-white p-4 mt-8">
        <p className="font-bold text-black mb-5">Departments</p>

<<<<<<< HEAD
        {open && <NewDepartment setOpen={setOpen} />}

        {isLoading ? (
          <DepartmentLosding />
        ) : (
          <DepartmentTable data={departments ?? []} />
        )}
      </div>
    </DashboardLayout>
  );
=======
                {isLoading ? (
                    <DepartmentLoading />
                ) : (
                    <DepartmentTable data={departments ?? []} />
                )}
            </div>
        </DashboardLayout>
    );
>>>>>>> db4e88c846432b80ebda4c7a6c8d31aaa829ff53
};

export default Department;
