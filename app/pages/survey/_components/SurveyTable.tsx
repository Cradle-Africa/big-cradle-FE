import { SurveyListItem } from "@/app/lib/type";
import { formatDate } from "@/app/utils/formatDate";
import { Eye, MoreVertical } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ImFileEmpty } from "react-icons/im";

type Props = {
  data: SurveyListItem[];
};

const SurveyTable = ({ data }: Props) => {
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = (id: any) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  if (data.length < 1)
    return (
      <div className="flex flex-col items-center gap-5 justify-center py-8">
        <ImFileEmpty />
        <p>No Data</p>
      </div>
    );

  return (
    <div className="relative xs:w-90 sm:w-93 sm:min-w-full rounded-md bg-white" key="table-container">
      <div className="overflow-x-auto rounded-[8px] border border-gray-200 mt-5">
        <table className="min-w-[75%] md:w-full table-auto divide-y divide-gray-200 rounded-[8px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 lg:px-6 py-3 text-left text-sm font-semibold">
                Survey Name
              </th>
              <th className="px-3 lg:px-6 py-3 text-left text-sm font-semibold">
                Sector
              </th>
              <th className="px-3 lg:px-6 py-3 text-left text-sm font-semibold">
                Goal
              </th>
              <th className="px-3 lg:px-6 py-3 text-left text-sm font-semibold">
                Survey Status
              </th>
              <th className="px-3 lg:px-6 py-3 text-left text-sm font-semibold">
                Payment Status
              </th>
              <th className="px-3 lg:px-6 py-3 text-left text-sm font-semibold">
                Start date
              </th>
              <th className="px-3 lg:px-6 py-3 text-left text-sm font-semibold">
                End date
              </th>
              <th className="px-3 lg:px-6 py-3 text-left text-sm font-semibold">
                Created on
              </th>
              <th className="px-3 lg:px-6 py-3 text-left text-sm font-semibold">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-700">
            {/* Example row */}
            {data.map((survey) => (
              <tr key={survey.id}>
                <td className="px-3 lg:px-6 py-4 font-medium">
                  {survey.surveyName}
                </td>
                <td className="px-3 lg:px-6 py-4 font-medium">
                  {survey.sector}
                </td>
                <td className="px-3 lg:px-6 py-4 font-medium">
                  {survey.surveyGoal}
                </td>
                <td className="px-3 w-62 lg:px-6">
                  {survey.isActive ? (
                    <span className="inline-block px-4 py-1 text-xs font-medium  text-green-700 rounded-full border-1">
                      Active
                    </span>
                  ) : (
                    <span className="inline-block px-4 py-1 text-xs font-medium  text-red-700 rounded-full border-1">
                      Active
                    </span>
                  )}
                </td>
                <td className="px-3 lg:px-6 text-center align-middle">
                  {survey.paymentStatus !== "not-paid" ? (
                    <div className="w-28 px-4 py-1 text-xs font-medium text-green-700 rounded-full border border-green-700">
                      Paid
                    </div>
                  ) : (
                    <div className="w-28 px-4 py-1 text-xs font-medium text-red-700 rounded-full border border-red-700">
                      Not Paid
                    </div>
                  )}
                </td>
                <td className="px-3 lg:px-6 py-4">
                  {formatDate(survey.startDate ?? '')}
                </td>
                <td className="px-3 lg:px-6 py-4">
                  {formatDate(survey.endDate ?? '')}
                </td>
                <td className="px-3 lg:px-6 py-4">
                  {formatDate(survey.createdAt ?? '')}
                </td>
                <td className="px-3 lg:px-6 py-4 relative">
                  <button
                    onClick={() => toggleMenu(survey.id)}
                    className="focus:outline-none cursor-pointer px-5"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {openMenuId === survey.id && (
                    <div
                      ref={menuRef}
                      className="absolute right-4 z-10 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-gray-200"
                    >
                      <ul className="py-1 text-sm text-gray-700 cursor-pointer ">
                        <Link href={`/pages/survey/${survey.id}`}>
                          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex gap-4">
                            <Eye />
                            <p>View</p>
                          </li>
                        </Link>
                        {/* <Link href={`/pages/survey/edit/${survey.id}`}>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex gap-4">
                          <Edit />
                          <p>Edit</p>
                        </li>
                      </Link> */}
                      </ul>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SurveyTable;
