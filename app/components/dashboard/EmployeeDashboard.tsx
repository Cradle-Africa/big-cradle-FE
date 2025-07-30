import axios from "@/app/lib/axios";
import { useFetchMe } from "@/app/shared-data-point/_features/hooks";
import { useState } from "react";
import KycVerification from "../KycVerification";
import { Grid, Spinner } from "@radix-ui/themes";
// import SentimentAnalysis from "../charts/SentimentAnalysis";
import RespondersGrowth from "../charts/RespondersGrowth";
import TopOrganization from "../charts/TopOrganization";
import PlatformOverviewHeader from "../charts/PlatformOverviewHeader";
import EngagementChart from "../charts/EngagementChart";
// import SentimentChart from "../charts/SentimentCharts";
import Summary from "../charts/Summary";
import FlywheelAverageEntriesChart from "../charts/FlywheelAverageEntriesChart";

const EmployeeDashboard = () => {
  const [openBusinessKycVerification, setOpenBusinessKycVerification] =
    useState(false);
  const [openAdminKycVerification, setOpenAdminKycVerification] =
    useState(false);
  const [module, setModule] = useState<string>('Survey');

  const { data: user, isLoading } = useFetchMe({ axios });

  return (
    <div>
      {isLoading ? (
        <div>
          <p>
            <Spinner />{" "}
          </p>
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

      {/* Header with module select */}
      <PlatformOverviewHeader user={user} module={module} setModule={setModule} />

      <Summary module={module} />

      {/* Engagement and sentiment charts*/}
      <div className="flex justify-between gap-5 mt-5">
        {module === 'Survey' && (
          <EngagementChart />
        )}
        {module === 'Data Flywheel' && (
          <FlywheelAverageEntriesChart />
        )}
        {/* <SentimentChart module={module} /> */}
      </div>
      <Grid gap="4" columns="4" my="4">
        <div className="col-span-2">
          {/* <SentimentAnalysis module={module} /> */}
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

export default EmployeeDashboard;
