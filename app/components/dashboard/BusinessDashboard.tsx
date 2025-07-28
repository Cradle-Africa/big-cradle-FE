import axios from "@/app/lib/axios";
// import { DashboardMenu } from "@/app/lib/type";
import BusinessCard from "@/app/pages/user/business/_components/BusinessCard";
import { useFetchMe } from "@/app/shared/_features/hooks";
import { Banknote, Users2, Wallet } from "lucide-react";
import { useState } from "react";
import DashboardCharts from "../charts/DashboardCharts";
import KycVerification from "../KycVerification";
import { Grid, Spinner } from "@radix-ui/themes";
import { MdChecklist } from "react-icons/md";
import SentimentAnalysis from "../charts/SentimentAnalysis";
import RespondersGrowth from "../charts/RespondersGrowth";
import TopOrganization from "../charts/TopOrganization";
// import { useFetchDataOverview } from "@/app/pages/flywheel/_features/hook";
// import { useFetchSurveyAnalyctics } from "@/app/pages/survey/_features/hooks";
// import { getBusinessId } from "@/app/utils/user/userData";

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

  // const {
  //   data: surveysAnalyticsResponse,
  //   isSuccess: analyticsSuccess,
  //   isLoading: analyticsLoading,
  // } = useFetchSurveyAnalyctics({
  //   axios,
  //   businessUserId: getBusinessId() ?? "",
  // });

  // if ( analyticsLoading) return (
  //   <div>
  //     Loading...
  //   </div>
  // )
  // if ( !surveysAnalyticsResponse) return (
  //   <div>
  //     No  data overview
  //   </div>
  // )


  return (
    <div>
      {isLoading ? (
        <div>
          <p><Spinner /> </p>
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
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mt-5">
        {/* {dataOverviewSuccess && ( */}
        <>
          <BusinessCard
            title={'Active users'}
            value={'500'}
            icon={<Users2 size={14} color="blue" />}
            iconClass="rounded-full bg-blue-100 p-1 lg:p-2"
            isHighLighted={false}
          />

          <BusinessCard
            title={'Survey created'}
            value={'2345'}
            icon={<Banknote size={14} color="green" />}
            iconClass="rounded-full bg-green-100 p-1 lg:p-2"
            isHighLighted={false}
          />
        </>
        <BusinessCard
          title={'Data uploads'}
          value={'2000'} 
          icon={<MdChecklist size={14} color="red" />}
          iconClass="rounded-full bg-red-100 p-1 lg:p-2"
          isHighLighted={false}
        />

        <BusinessCard
          title={'Wallets payouts'}
          value={'135000'}
          icon={<Wallet size={14} color="blue" />}
          iconClass="rounded-full bg-gray-100 p-1 lg:p-2"
          isHighLighted={true}
        />

      </div>
      <DashboardCharts />

      <Grid gap="4" columns="4" my="4">
        <div className="col-span-2">
          <SentimentAnalysis />
        </div>

        <div>
          <RespondersGrowth />
        </div>
        <div>
          <TopOrganization />
        </div>
      </Grid>
    </div>
  );
};

export default BusinessDashboard;
