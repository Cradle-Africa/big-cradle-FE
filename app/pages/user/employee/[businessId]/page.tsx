"use client";
import DashboardLayout from "@/app/DashboardLayout";
import axios from "@/app/lib/axios";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useFetchEmployees } from "../_features/hook";
import EmployeeLoading from "../loading";
import EmployeeTable from "../_components/EmployeeTable";
import Pagination from "../_components/Pagination";


const Employee = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const params = useParams();
    const { businessId } = params as { businessId: string }

    const { isLoading, data: employees } = useFetchEmployees({
        axios,
        queryParams: {
            page,
            limit,
            businessUserId: businessId || undefined,
        },
    });

    const employeeData = employees?.data ?? [];
    const pagination = {
        page: employees?.page || 1,
        limit: employees?.limit || 10,
        total: employees?.total || 0,
        pages: Math.ceil((employees?.total || 0) / (employees?.limit || 10)),
    };

    if (isLoading) return <EmployeeLoading />;

    return (
        <DashboardLayout>
            <div className="flex justify-between mt-5">
                <div className="flex flex-col gap-2">
                    <h2 className="font-bold text-black">Employees</h2>
                </div>
                
            </div>

            {/* employees table  */}
            <div className="flex flex-col mt-5">

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
