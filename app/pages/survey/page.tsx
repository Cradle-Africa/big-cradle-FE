"use client";

import Pagination from "@/app/components/Pagination";
import DashboardLayout from "@/app/DashboardLayout";
import axios from "@/app/lib/axios";
import { DashboardMenu, SurveyListItem } from "@/app/lib/type";
import SurveyStatus from "@/app/pages/survey/_components/SurveyStatus";
import { getUser } from "@/app/utils/user/userData";
import { FolderOpenDot, Plus, ShieldBan, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import SurveyCard from "./_components/SurveyCard";
import { statuses } from "./_components/SurveyStatus";
import SurveyTable from "./_components/SurveyTable";
import {
  useFetchSuperAdminSurvey,
  useFetchSurvey,
  useFetchSurveyAnalyctics,
  useVerifySurveyPayment,
} from "./_features/hooks";
import SurveyPageLoading from "./loading";

const SurveyPage = () => {
  const searchParam = useSearchParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [surveyDashBoardItems, setSurveyDashBoardItems] =
    useState<DashboardMenu[]>();

  const surveyStatus = searchParam.get("status");
  const page = searchParams.get("page") ?? "";

  const user = getUser();

  const changeStatus = (status: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("status", status);
    router.push("?" + params.toString());
  };

  const txRef = searchParams.get("tx_ref");
  const {
    mutateAsync: verifyPayment,
    isPending: isVerifing,
    data: paymentMadeData,
    isSuccess: isVerifyPaymentSuccess,
    isError,
  } = useVerifySurveyPayment({
    axios,
  });

  const { data: surveysListResponse, isLoading } = useFetchSurvey({
    axios,
    page,
    businessUserId: user?.role === "business" ? user?.id : null,
    enabled: user?.role === "business",
  });

  const {
    data: superAdminSurveysListResponse,
    isLoading: isLoadingSuperAdminSurveys,
  } = useFetchSuperAdminSurvey({
    axios,
    page,
    enabled: user?.role === "super admin",
  });

  const {
    data: surveysAnalyticsResponse,
    isSuccess: analyticsSuccess,
    isLoading: analyticsLoading,
  } = useFetchSurveyAnalyctics({
    axios,
    businessUserId: user?.id ?? "",
  });

  const filteredSurveys = useMemo(() => {
    let surveys: SurveyListItem[] = [];
    if (user?.role === "business") {
      surveys = surveysListResponse?.survey || [];
    } else if (user?.role === "super admin") {
      surveys = superAdminSurveysListResponse?.data || [];
    }

    if (!surveyStatus || surveyStatus === "all") return surveys;
    if (surveyStatus.toLowerCase() === "active") {
      return surveys.filter((survey) => survey.isActive);
    } else {
      return surveys.filter((survey) => !survey.isActive);
    }
  }, [
    surveyStatus,
    surveysListResponse?.survey,
    superAdminSurveysListResponse?.data,
    user?.role,
  ]);

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
      toast.error(`${error.message}`);
    }
  }, [txRef, verifyPayementFunc]);

  useEffect(() => {
    if (isVerifyPaymentSuccess) {
      if (paymentMadeData.paymentResult.data.status === "successful") {
        toast.success("Payment made successfull");
      } else {
        toast.error("Error when making payments");
      }
    }
  }, [
    txRef,
    verifyPayementFunc,
    isVerifyPaymentSuccess,
    paymentMadeData?.paymentResult.data.status,
  ]);

  useEffect(() => {
    if (analyticsSuccess && surveysAnalyticsResponse) {
      const dashBoardValue: DashboardMenu[] = [
        {
          value: `${surveysAnalyticsResponse.data.totalSurveys}`,
          title: "All surveys",
          subTitle: "All created surveys",
          icon: <FolderOpenDot size={16} color="blue" />,
        },
        {
          value: `${surveysAnalyticsResponse.data.totalEntries}`,
          title: "Total entries",
          subTitle: "All regitered entries",
          icon: <ShieldCheck size={16} color="blue" />,
        },
        {
          value: `${surveysAnalyticsResponse.data.totalAmount}`,
          title: "Total Amount",
          subTitle: "Total amount",
          icon: <ShieldBan size={16} color="blue" />,
        },
      ];

      setSurveyDashBoardItems(dashBoardValue);
    }
  }, [analyticsSuccess, surveysAnalyticsResponse]);

  useEffect(() => {
    if (isError) toast.error(`An error occured when verifing your payment`);
  }, [isError, txRef, verifyPayementFunc]);

  if (isLoading || isLoadingSuperAdminSurveys || analyticsLoading || isVerifing)
    return <SurveyPageLoading />;

  return (
    <DashboardLayout>
      
      <div className="w-full">
        <div className="flex justify-between">
          <p className="font-semibold text-lg text-black">Surveys</p>

          {user?.role === "business" && (
            <button
              className="flex bg-blue-600 rounded-md px-4 py-1 lg:py-2 cursor-pointer"
              //   onClick={() => setOpen(true)}
            >
              <Link href="/pages/survey/new?survey=survey-name-and-description">
                <div className="flex items-center gap-2">
                  <Plus size={18} color="white" />
                  <span className="text-white">Create new survey</span>
                </div>
              </Link>
            </button>
          )}
        </div>
        {/* <p className="mt-2">
          View, manage, and track your survey tasks. Create new surveys to
          collect insights in real time
        </p> */}
      </div>
      {/* Build the cards area */}
      <div className="grid grid-cols-2 md:grid md:grid-cols-3 2xl:grid 2xl:grid-cols-4 gap-3 lg:gap-6 mt-8">
        {surveyDashBoardItems?.map((menu, index) => (
          <SurveyCard
            key={`${menu.title}`}
            data={menu}
            isHighLighted={index === 0}
          />
        ))}
      </div>
      {/* Survey table  */}
      <div className="flex flex-col bg-white lg:p-4 mt-8">
        <p className="font-bold text-black">Survey Table List</p>
        <div className="flex gap-4 my-4">
          {statuses.map((status) => (
            <SurveyStatus
              key={status}
              isSelected={status.toLowerCase() === surveyStatus}
              status={status}
              onClick={() => changeStatus(status.toLowerCase())}
            />
          ))}
        </div>
        <SurveyTable data={filteredSurveys || []} />
        <Pagination
          pageSize={10}
          currentPage={parseInt(page)}
          itemCount={
            (surveysListResponse?.pagination.total ||
              superAdminSurveysListResponse?.pagination.total) ??
            0
          }
          className="mt-4"
        />
      </div>
    </DashboardLayout>
  );
};

export default SurveyPage;
