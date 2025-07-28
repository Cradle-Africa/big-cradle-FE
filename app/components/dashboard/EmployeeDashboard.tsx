import axios from "@/app/lib/axios";
import { useFetchMe } from "@/app/shared/_features/hooks";
import { useState } from "react";
import DashboardCharts from "../charts/DashboardCharts";
import KycVerification from "../KycVerification";
import { Grid, Spinner } from "@radix-ui/themes";
import SentimentAnalysis from "../charts/SentimentAnalysis";
import RespondersGrowth from "../charts/RespondersGrowth";
import TopOrganization from "../charts/TopOrganization";
import PlatformOverviewHeader from "../charts/PlatformOverviewHeader";
import Summary from "../charts/Summary";

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

			<Summary module={module}/>

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

export default EmployeeDashboard;
