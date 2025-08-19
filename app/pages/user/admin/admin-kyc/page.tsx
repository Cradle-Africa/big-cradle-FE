"use client";
import React, { useState } from "react";
import DashboardLayout from "@/app/DashboardLayout";
import axios from "@/app/lib/axios";
import AdminKycLoading from "./loading";
import AdminKycTable from "./_components/AdminKycTable";
import Pagination from "./_components/Pagination";
import { useFetchAdminKyc } from "./_features/hook";

const AdminKyc = () => {

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { isLoading, data: adminData } = useFetchAdminKyc({
    axios,
    queryParams: {
      page,
      limit,
    },
  });

  const adminKycList = adminData?.data ?? [];
  const pagination = adminData?.pagination ?? { page: 1, limit: 10, pages: 1, total: 0 };

  if (isLoading) return <AdminKycLoading />;

  return (
    <DashboardLayout>
      <div className="flex justify-between mt-5">
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-black">Ecosystem enablers Kyc</h2>
        </div>
      </div>

      {/* department table  */}
      <div className="flex flex-col bg-white mt-5">

        <div className="relative xs:w-90 sm:w-93 sm:min-w-full rounded-md bg-white" key="table-container">
          {isLoading ? (
            <AdminKycLoading />
          ) : (
            <>
              <AdminKycTable data={adminKycList ?? []} />
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                limit={pagination.limit}
                onPageChange={(newPage) => setPage(newPage)}
                onLimitChange={(newLimit) => {
                  setLimit(newLimit);
                  setPage(1);
                }}
              />
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );

}
export default AdminKyc