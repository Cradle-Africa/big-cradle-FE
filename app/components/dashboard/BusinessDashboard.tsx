import axios from "@/app/lib/axios";
// import { DashboardMenu } from "@/app/lib/type";
import BusinessCard from "@/app/pages/user/business/_components/BusinessCard";
import { useFetchMe } from "@/app/shared/_features/hooks";
import { Album, ArrowDownUp, Database } from "lucide-react";
import { useState } from "react";
import DashboardCharts from "../charts/DashboardCharts";
import KycVerification from "../KycVerification";
// import { useFetchDataOverview } from "@/app/pages/flywheel/_features/hook";
import { useFetchSurveyAnalyctics } from "@/app/pages/survey/_features/hooks";
import { getBusinessId } from "@/app/utils/user/userData";

const BusinessDashboard = () => {
  const [openBusinessKycVerification, setOpenBusinessKycVerification] =
    useState(false);
  const [openAdminKycVerification, setOpenAdminKycVerification] =
    useState(false);

  const { data: user, isLoading } = useFetchMe({ axios });

  // const {
  //   data: dataOverview,
  //   isLoading: isLoadingDataOverview,
  //   isSuccess: dataOverviewSuccess,
  //   isError
  // } = useFetchDataOverview(axios);

  const {
    data: surveysAnalyticsResponse,
    isSuccess: analyticsSuccess,
    isLoading: analyticsLoading,
  } = useFetchSurveyAnalyctics({
    axios,
    businessUserId: getBusinessId() ?? "",
  });

  if ( analyticsLoading) return (
    <div>
      Loading...
    </div>
  )
  if ( !surveysAnalyticsResponse) return (
    <div>
      No  data overview
    </div>
  )


  return (
    <div>
      {isLoading ? (
        <div>
          <p>Loading kwc verification... </p>
        </div>
      ) : (
        <KycVerification
          openBusinessKycVerification={openBusinessKycVerification}
          setOpenBusinessKycVerification={setOpenBusinessKycVerification}
          openAdminKycVerification={openAdminKycVerification}
          setOpenAdminKycVerification={setOpenAdminKycVerification}
          user={user?.data!}
        />
      )}

      <div className="w-full mt-2">
        <p className="font-semibold text-md space-y-1">
          Hi{" "}
          {user?.data?.contactPersonFirstName ?? user?.data?.firstName ?? user?.data?.fullName ?? user?.data?.businessFirstName ?? ""},{" "}
          here’s your platform overview for today
        </p>

        <p className="text-sm">
          All systems operational. Last sync: 10 mins ago
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-5">
        {/* {dataOverviewSuccess && ( */}
          <>
            <BusinessCard
              title={'Pipelines'}
              subTitle={'Total Pipelines'}
              value={'0'} //{dataOverview.totalDataPoints}
              icon={<ArrowDownUp size={14} color="blue" />}
              isHighLighted={true}
            />

            <BusinessCard
              title={'Data Points'}
              subTitle={'Total Data Points'}
              value={'0'} //{dataOverview.totalFields}
              icon={<Database size={14} color="blue" />}
              isHighLighted={false}
            />
          </>
        {/* )} */}

        {analyticsSuccess && (
          <BusinessCard
            title={'Surveys'}
            subTitle={'Total Surveys'}
            value={surveysAnalyticsResponse.data.totalSurveys.toString() ?? 0}
            icon={<Album size={14} color="blue" />}
            isHighLighted={false}
          />
        )}

      </div>
      <DashboardCharts />
    </div>
  );
};

export default BusinessDashboard;
