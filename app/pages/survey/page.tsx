"use client";
import DashboardLayout from "@/app/DashboardLayout";
import axios from "@/app/lib/axios";
import { SurveyListItem } from "@/app/lib/type";
import SurveyStatus from "@/app/pages/survey/_components/SurveyStatus";
import { getUser } from "@/app/utils/user/userData";
import api_icon from "@/public/icons/api_icon.png";
import build_pipeline from "@/public/icons/build_pipeline.png";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import Overview from "../flywheel/_components/Overview";
import {
  useFetchDataEntries,
  useFetchPipelines,
} from "../flywheel/_features/hook";
import SurveysListArea from "./_components/SurveysListArea";
import { statuses } from "./_components/SurveyStatus";
import { useFetchSurvey, useVerifySurvey } from "./_features/hooks";
import SurveyPageLoading from "./loading";
import SurveyTable from "./_components/SurveyTable";

const SurveyPage = () => {
  const [open, setOpen] = useState(false);
  const searchParam = useSearchParams();
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [entriesPage] = useState(1);
  const [entriesLimit] = useState(10);
  // const [filteredSuveys, setFilteredSurveys] = useState<SurveyListItem[]>([]);

  const surveyStatus = searchParam.get("status");

  const [pipelinesPage] = useState(1);
  const [pipelinesLimit] = useState(10);

  const user = getUser();

  const txRef = searchParams.get("tx_ref");
  const {
    mutateAsync: verifyPayment,
    isPending: isVerifing,
    isError,
  } = useVerifySurvey({
    axios,
  });

  const { data: surveysListResponse, isLoading } = useFetchSurvey({
    axios,
    businessUserId: user?.id ?? "",
    page: 1,
  });

  const filteredSurveys = useMemo(() => {
    const surveys: SurveyListItem[] = surveysListResponse?.survey || [];
    if (!surveyStatus || surveyStatus === "all") return surveys;
    if (surveyStatus.toLowerCase() === "active") {
      return surveys.filter((survey) => survey.isActive);
    } else {
      return surveys.filter((survey) => !survey.isActive);
    }
  }, [surveyStatus, surveysListResponse?.survey]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, [setOpen]);

  const verifyPayementFunc = useCallback(async () => {
    try {
      await verifyPayment(txRef || "");
    } catch (error) {
      console.log(error);
    }
  }, [txRef, verifyPayment]);

  useEffect(() => {
    try {
      if (txRef) verifyPayementFunc();
    } catch (error: any) {
      toast.error(`Error ---> ${error.message}`);
    }
  }, [txRef, verifyPayementFunc]);

  const { data: dataPointsData } = useFetchPipelines({
    axios,
    queryParams: {
      page: pipelinesPage,
      limit: pipelinesLimit,
    },
  });

  const { data: dataEntries } = useFetchDataEntries({
    axios,
    queryParams: {
      page: entriesPage,
      limit: entriesLimit,
    },
  });

  const dataentries = dataEntries?.data ?? [];
  // const paginationDataEntries = dataEntries?.pagination ?? {
  //   page: 1,
  //   limit: 10,
  //   pages: 1,
  //   total: 0,
  // };

  const pipelines = dataPointsData?.dataPoint ?? [];
  // const paginationDataPoints = dataPointsData?.pagination ?? {
  //   page: 1,
  //   limit: 10,
  //   pages: 1,
  //   total: 0,
  // };

  useEffect(() => {
    if (isError) toast.error(`An error occured when verifing your payment`);
  }, [isError, txRef, verifyPayementFunc]);

  // if (isVerifing) return <p>Is Verifing payment...</p>;

  if (isLoading || isVerifing) return <SurveyPageLoading />;

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
          <Link href="/pages/survey/new?survey=survey-name-and-description">
            <div className="flex fgap2 items-center gap-2">
              <Plus size={18} color="white" />
              <span className="text-white">Create new survey</span>
            </div>
          </Link>
        </button>
      </div>
      {/* Build the cards area */}
      {/* <div className="flex gap-6 mt-8">
        {[...Array(3)].map((_, index) => (
          <Card key={`${index}`} isHighLighted={index === 0} />
        ))}
      </div> */}
      <Overview
        pipelines={pipelines?.length}
        dataentries={dataentries?.length}
      />

      {/* Survey table  */}
      <div className="flex flex-col bg-white p-4 mt-8">
        <p className="font-bold text-black">Survey Table List</p>
        <div className="flex gap-4 my-4">
          {statuses.map((status) => (
            <SurveyStatus
              key={status}
              isSelected={status.toLowerCase() === surveyStatus}
              status={status}
              onClick={() =>
                router.push(`/pages/survey?status=${status.toLowerCase()}`)
              }
            />
          ))}
        </div>
        {/* <SurveyTable /> */}
        {/* <SurveysListArea data={filteredSurveys || []} /> */}
        <SurveyTable data={filteredSurveys || []} />
      </div>
    </DashboardLayout>
  );
};

export default SurveyPage;
