"use client";
import DashboardLayout from "@/app/DashboardLayout";
import { Plus } from "lucide-react";
import Card from "./_components/SurveyCard";
import { statuses } from "./_components/SurveyStatus";
import SurveyStatus from "@/app/pages/survey/_components/SurveyStatus";
import SurveyTable from "./_components/SurveyTable";
import { useEffect, useRef, useState } from "react";
import api_icon from "@/public/icons/api_icon.png";
import build_pipeline from "@/public/icons/build_pipeline.png";
import Image from "next/image";
import Link from "next/link";

const SurveyCard = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, [setOpen]);

  return (
    <DashboardLayout>
      {open && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" />
          <div
            className="text-center bg-white px-5 py-5 md:px-8 md:py-8 rounded-lg w-82 md:w-full max-w-xl z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            ref={menuRef}
          >
            <h2 className="text-gray-800 text-lg font-normal">
              How would you like to collect your data?
            </h2>
            <p className="mt-5 text-gray-700">
              Choose an integration method or build your own feedback tool
            </p>
            <div className="flex justify-between gap-5 mt-10">
              <div className="w-1/2 px-6 py-6 bg-[#FCEBFF] rounded-lg cursor-pointer">
                <div className="flex justify-center">
                  <Image alt="api icon" src={api_icon} width={40} height={40} />
                </div>
                <p className="mt-3 text-md text-gray-800">Connect via API</p>
                <p className="text-sm mt-3">
                  Integrate with your existing apps, websites, or CRM
                </p>
              </div>

              <div className="w-1/2 px-6 py-6 bg-[#E6E9FF] rounded-lg cursor-pointer">
                <div className="flex justify-center">
                  <Image
                    alt="build icon"
                    src={build_pipeline}
                    width={40}
                    height={40}
                  />
                </div>
                <p className="mt-3 text-md text-gray-800">
                  Build Custom Pipeline
                </p>
                <p className="text-sm mt-3">
                  Use our form builder to create your own survey
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <p className="font-medium text-black">Surveys</p>
          <p>
            View, manage, and track your survey tasks. Create new surveys to
            collect insights in real time
          </p>
        </div>
        <button
          className="bg-[#3352FF] rounded-[8px] px-4 h-[36px] cursor-pointer"
          //   onClick={() => setOpen(true)}
        >
          <Link href="/pages/survey/new?survey=Survey%20questions">
            <div className="flex fgap2 items-center gap-2">
              <Plus size={18} color="white" />
              <span className="text-white">Create new survey</span>
            </div>
          </Link>
        </button>
      </div>
      {/* Build the cards area */}
      <div className="flex gap-6 mt-8">
        {[...Array(3)].map((_, index) => (
          <Card key={`${index}`} isHighLighted={index === 0} />
        ))}
      </div>

      {/* Survey table  */}
      <div className="flex flex-col bg-white p-4 mt-8">
        <p className="font-bold text-black">Survey Table List</p>
        <div className="flex gap-4 my-4">
          {statuses.map((status) => (
            <SurveyStatus
              key={status}
              isSelected={status === "All"}
              status={status}
            />
          ))}
        </div>
        <SurveyTable />
      </div>
    </DashboardLayout>
  );
};

export default SurveyCard;
