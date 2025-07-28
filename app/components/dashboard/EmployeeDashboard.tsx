import axios from "@/app/lib/axios";
import { useFetchMe } from "@/app/shared/_features/hooks";
<<<<<<< HEAD
import { Grid, Spinner } from "@radix-ui/themes";
import { ArrowDownUp, Database, Scan, UsersRound } from "lucide-react";
import { useState } from "react";
import DashboardCharts from "../charts/DashboardCharts";
=======
import { useState } from "react";
import DashboardCharts from "../charts/DashboardCharts";
import KycVerification from "../KycVerification";
import { Grid, Spinner } from "@radix-ui/themes";
import SentimentAnalysis from "../charts/SentimentAnalysis";
>>>>>>> 01ebbee1abfc4dce082a5aea426272af267bbf74
import RespondersGrowth from "../charts/RespondersGrowth";
import SentimentAnalysis from "../charts/SentimentAnalysis";
import TopOrganization from "../charts/TopOrganization";
<<<<<<< HEAD
import KycVerification from "../KycVerification";
=======
import PlatformOverviewHeader from "../charts/PlatformOverviewHeader";
import Summary from "../charts/Summary";
>>>>>>> 01ebbee1abfc4dce082a5aea426272af267bbf74

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
