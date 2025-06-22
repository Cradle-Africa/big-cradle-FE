"use client";

import { Pipeline } from "@/app/lib/type";
import { formatDate } from "@/app/utils/formatDate";
import { MoreVertical } from "lucide-react";
import Pagination from "./Pagination";

const PipelinePage = ({
  data,
  pagination,
  onPageChange,
  onLimitChange,
}: {
  data: Pipeline[];
  pagination: { page: number; limit: number; pages: number };
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}) => {
  return (
    <div>
      <div className="overflow-x-auto rounded-[8px] mt-10 border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 rounded-[8px] ">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-sm font-semibold">#</th>
              <th className="px-3 py-3 text-left text-sm font-semibold">
                Fields
              </th>
              <th className="px-3 py-3 text-left text-sm font-semibold">
                Date
              </th>
              <th className="px-3 py-3 text-left text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-700">
            {data.map((dataPoints, index) => (
              <tr key={index} className="">
                <td className="px-6 py-6 align-top">{index + 1}</td>

                <td className="px-6 py-3 align-top">
                  <table className="w-full">
                    <tbody>
                      {dataPoints.field.map((field: any, index: number) => (
                        <tr key={index}>
                          <td className="py-2 text-left text-sm min-w-[100px]">
                            {field?.label}
                          </td>
                          <td className="py-2 text-left text-sm min-w-[100px]">
                            {field?.type}
                          </td>
                          <td className="px-3 py-2 text-left text-sm min-w-[200px]">
                            {field?.required ? "Required: Yes" : "Required: No"}
                          </td>
                          <td className="px-3 text-left text-sm min-w-[100px]">
                            {field.options && field.options.length > 0 && (
                              <table>
                                <tbody>
                                  <tr>
                                    <td className="py-2 text-left text-sm min-w-[100px]">
                                      Options
                                    </td>
                                    <td
                                      colSpan={2}
                                      className="px-3 py-2 mt-3 text-left text-sm"
                                    >
                                      <ul className="list-disc pt-5 pl-5">
                                        {field.options.map(
                                          (opt: any, i: number) => (
                                            <li key={i}>{opt}</li>
                                          )
                                        )}
                                      </ul>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>

                <td className="px-6 py-6 align-top text-left text-sm">
                  {formatDate(dataPoints?.createdAt ?? "")}
                </td>
                <td className="px-6 py-6 align-top">
                  <MoreVertical
                    size={33}
                    className="cursor-pointer bg-gray-100 rounded-lg px-2 py-1"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          limit={pagination.limit}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      )}
    </div>
  );
};

export default PipelinePage;
