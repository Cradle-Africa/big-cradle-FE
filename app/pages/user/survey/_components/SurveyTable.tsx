import classNames from "classnames";
import { MoreVertical } from "lucide-react";

const SurveyTable = () => {
  return (
    <div className="overflow-x-auto rounded-[8px] border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 rounded-[8px] ">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold">
              Survey Title
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold">
              Status
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold">
              Created On
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold">
              Responses
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold">
              Completion Rate
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-700">
          {/* Example row */}
          {[...Array(10)].map((_, index) => (
            <tr key={index}>
              <td className="px-6 py-4 font-medium">Product Feedback Q2</td>
              <td className="px-6 py-4">
                <span className="inline-block px-4 py-1 text-xs font-medium  text-green-700 rounded-full border-1">
                  Active
                </span>
              </td>
              <td className="px-6 py-4">May 10, 2025</td>
              <td className="px-6 py-4">212 / 500</td>
              <td className="px-6 py-4">87%</td>
              <td className="px-6 py-4">
                <MoreVertical size={18}/>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SurveyTable;
