import axios from "@/app/lib/axios";
import { useFetchMe } from "@/app/shared-data-point/_features/hooks";
import { useState } from "react";
import KycVerification from "../KycVerification";
import { Grid, Spinner } from "@radix-ui/themes";
// import SentimentAnalysis from "../charts/SentimentAnalysis";
import RespondersGrowth from "../charts/RespondersGrowth";
import TopOrganization from "../charts/TopOrganization";
import PlatformOverviewHeader from "../charts/PlatformOverviewHeader";
import { getUser } from "@/app/utils/user/userData";
import EngagementChart from "../charts/EngagementChart";
// import SentimentChart from "../charts/SentimentCharts";
import Summary from "../charts/Summary";
import FlywheelAverageEntriesChart from "../charts/FlywheelAverageEntriesChart";
import FlywheelEntryVolumeChart from "../charts/FlywheelEntryVolumeChart";

const BusinessDashboard = () => {
	const [openBusinessKycVerification, setOpenBusinessKycVerification] =
		useState(false);
	const [openAdminKycVerification, setOpenAdminKycVerification] =
		useState(false);
	const [module, setModule] = useState<string>("Data Flywheel");

	const { data: Authuser, isLoading } = useFetchMe({ axios });
	const user = getUser();

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
					user={Authuser?.data!}
				/>
			)}

			{/* Header with module select */}
			<PlatformOverviewHeader
				user={user}
				module={module}
				setModule={setModule}
			/>
			{/* Summary cards */}
			<Summary module={module} />

			{/* Engagement and sentiment charts*/}
			{module === 'Survey' && (
				<>
					<div className="flex justify-between gap-5 mt-5">
						<EngagementChart />
					</div>
				</>
			)}
			{module === 'Data Flywheel' && (
				<div className="flex justify-between h-[410px] gap-5 mt-5">
					<div className="w-3/5">
						<FlywheelAverageEntriesChart />
					</div>
					<div className="w-2/4">
						<FlywheelEntryVolumeChart />
					</div>
				</div>
			)}


			{/* <SentimentChart module={module} /> */}

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

export default BusinessDashboard;
