import { SurveyListItem } from "@/app/lib/type";
import { formatDate } from "@/app/utils/formatDate";
import { Eye } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ViewSurveyDetails from "./ViewSurveyDetails";

type Props = {
  data: SurveyListItem[];
};

const SurveysListArea = ({ data }: Props) => {
  const [openViewSurveyDetails, setOpenViewSurveyDetails] = useState(false);
  
  //   const [editingDataPoint, setEditingDataPoint] = useState(false);
  //   const [shareDataPoint, setShareDataPoint] = useState(false);

  const [uniqueDataPoint, setUniqueDataPoint] = useState<string>("");
  const handleViewSurveyDetails = (id: any) => {
    setOpenViewSurveyDetails(true);
    setUniqueDataPoint(id);
  };


  // const handleShareDataPoint = (id: any) => {
  //   //   setShareDataPoint(true);
  //   setUniqueDataPoint(id);
  // };
  const [openOptionIndex, setOpenOptionIndex] = useState<string | null>(null);
  const optionRef = useRef<HTMLUListElement | null>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionRef.current &&
        !optionRef.current.contains(event.target as Node)
      ) {
        setOpenOptionIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      <ViewSurveyDetails
        openViewDataSurveyDetails={openViewSurveyDetails}
        onClose={() => setOpenViewSurveyDetails(false)}
        surveyId={uniqueDataPoint}
      />
      <div className="overflow-x-auto rounded-[8px] border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 rounded-[8px] ">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">#</th>
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
            {data.map((survey, index) => (
              <tr key={index} className="">
                <td className="px-6 py-4 align-top">{index + 1}</td>
                <td className="px-3 py-2 align-top">
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td className=" py-2 align-top">
                          {survey.field.map((field: any, idx: number) => (
                            <div
                              key={idx}
                              className="mb-4 px-3 py-3 text-sm border rounded border-gray-300 bg-gray-50 pb-2 hover:bg-blue-50"
                            >
                              <div className="flex gap-x-4">
                                <span className="min-w-[400px] font-medium flex flex-wrap">
                                  {field.label}
                                </span>
                                <span className="min-w-[100px]">
                                  {field.type}
                                </span>
                                <span className="min-w-[100px]">
                                  {field.required ? "Required" : "Optional"}
                                </span>
                              </div>

                              {field.options && field.options.length > 0 && (
                                <div className="relative mt-1">
                                  <button
                                    onClick={() =>
                                      setOpenOptionIndex(
                                        openOptionIndex ===
                                          `${survey.id}-${idx}`
                                          ? null
                                          : `${survey.id}-${idx}`
                                      )
                                    }
                                    className="text-blue-600 cursor-pointer underline text-sm"
                                  >
                                    View options
                                  </button>

                                  {openOptionIndex ===
                                    `${survey.id}-${idx}` && (
                                    <ul
                                      ref={optionRef}
                                      className="absolute left-0 top-full mt-2 bg-white shadow-lg border border-gray-200 rounded-lg z-50 w-64 max-w-xs text-sm"
                                    >
                                      {field.options.map(
                                        (opt: string, i: number) => (
                                          <li
                                            key={i}
                                            className="px-4 py-2 border-b border-gray-100 last:border-none hover:bg-gray-100"
                                          >
                                            {opt}
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>

                <td className="px-3 py-4 align-top text-left text-sm">
                  {formatDate(survey?.createdAt ?? "")}
                </td>
                <td className="px-3 py-4 align-top">
                  <Eye
                    size={35}
                    onClick={() => handleViewSurveyDetails(survey?.id)}
                    className="cursor-pointer bg-gray-100 rounded-full px-2 py-1 hover:bg-blue-600 hover:text-white "
                  />
                  {/* <Pencil
                    size={35}
                    // onClick={() => handleEditDataPoint(survey?.id)}
                    onClick={() =>
                      router.push(
                        `/pages/survey/new?survey=Survey%20questions&surveyId=${survey?.id}`
                      )
                    }
                    className="mt-10 cursor-pointer bg-gray-100 rounded-full px-2 py-1 hover:bg-blue-600 hover:text-white "
                  />
                  <Share2
                    size={35}
                    onClick={() => handleShareDataPoint(survey?.id)}
                    className="mt-10 cursor-pointer bg-gray-100 rounded-full px-2 py-1 hover:bg-blue-600 hover:text-white "
                  /> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* {pagination && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              limit={pagination.limit}
              onPageChange={onPageChange}
              onLimitChange={onLimitChange}
            />
          )} */}
    </div>
  );
};

export default SurveysListArea;