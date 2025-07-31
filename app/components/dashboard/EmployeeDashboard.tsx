import axios from "@/app/lib/axios";
// import SentimentAnalysis from "../charts/SentimentAnalysis";
import EngagementChart from "../charts/EngagementChart";
// import SentimentChart from "../charts/SentimentCharts";

import { useFetchMe } from "@/app/shared-data-point/_features/hooks";
import { Grid, Spinner } from "@radix-ui/themes";
import { useState } from "react";
import FlywheelAverageEntriesChart from "../charts/FlywheelAverageEntriesChart";
import PlatformOverviewHeader from "../charts/PlatformOverviewHeader";
import Summary from "../charts/Summary";
import TopPipelines from "../charts/TopPipelines";
import TopSurveys from "../charts/TopSurveys";
import KycVerification from "../KycVerification";

const EmployeeDashboard = () => {
  const [openBusinessKycVerification, setOpenBusinessKycVerification] =
    useState(false);
  const [openAdminKycVerification, setOpenAdminKycVerification] =
    useState(false);
  const [module, setModule] = useState<string>("Survey");

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
      <PlatformOverviewHeader
        user={user}
        module={module}
        setModule={setModule}
      />

      <Summary module={module} />

      {/* Engagement and sentiment charts*/}
      <div className="flex justify-between gap-5 mt-5">
        {module === "Survey" && <EngagementChart />}
        {module === "Data Flywheel" && <FlywheelAverageEntriesChart />}
        {/* <SentimentChart module={module} /> */}
      </div>
      <Grid columns="2" gap="2" my="4">
        <div>{module === "Survey" && <TopSurveys />}</div>

        <div>
          <TopPipelines />
        </div>

        {/* <div>
          <RespondersGrowth />
        </div>
        <div>
          <TopOrganization />
        </div> */}
      </Grid>
    </div>
  );
};

export default EmployeeDashboard;
