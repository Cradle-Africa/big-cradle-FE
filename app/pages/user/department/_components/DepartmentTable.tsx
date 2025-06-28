import { Department } from "@/app/lib/type";
import { MoreVertical } from "lucide-react";

const
  DepartmentTable = ({ data }: { data: Department[] }) => {
    return (
      <div className="overflow-x-auto rounded-[8px] border border-gray-200 mt-5">
        <table className="min-w-[75%] md:w-full table-auto divide-y divide-gray-200 rounded-[8px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                #
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Department name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Department description
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-700">
            {/* Example row */}
            {data.map((department, index) => (
              <tr key={index}>
                <td className="px-6 py-4 font-medium">
                  {index + 1}
                </td>
                <td className="px-6 py-4 font-medium">
                  {department.departmentName}
                </td>
                <td className="px-6 py-4">
                  {department.departmentDescription}
                </td>
                <td className="px-6 py-4">
                  <MoreVertical size={18} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

export default DepartmentTable;
