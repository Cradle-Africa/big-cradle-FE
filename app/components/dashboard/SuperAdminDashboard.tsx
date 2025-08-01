import { useUser } from "@/app/hooks/useUser";
import { useState } from "react";
import FormPopup from "../pop-up/PopUpForm";
import DashboardSkeleton from "../skeleton/Dashboardskeleton";
import EngagementChart from "../charts/EngagementChart";
import PlatformOverviewHeader from "../charts/PlatformOverviewHeader";
import Summary from "../charts/Summary";
import FlywheelAverageEntriesChart from "../charts/FlywheelAverageEntriesChart";
import FlywheelEntryVolumeChart from "../charts/FlywheelEntryVolumeChart";
import SurveyPaymentStatsChart from "../charts/SurveyPaymentStatsChart";
// import { Flex, Grid } from "@radix-ui/themes";
import TopSurveys from "../charts/TopSurveys";
import TopPipelines from "../charts/TopPipelines";
import TopOrganization from "../charts/TopOrganization";
import RespondersGrowth from "../charts/RespondersGrowth";

const SuperAdminDashboard = () => {
	const [openKycVerification, setOpenKycVerification] = useState(false);
	const user = useUser();
	const [module, setModule] = useState<string>("Data Flywheel");

	if (!user) {
		return <DashboardSkeleton />;
	}

	return (
		<div>
			{openKycVerification && (
				<FormPopup
					setOpen={setOpenKycVerification}
					title="KYC Verification"
					method={"POST"}
					endPoint="business-auth/upload-certificate-of-incorporation"
					fields={[
						{ name: "email", label: "", type: "hidden", required: true },
						{
							name: "certificateOfIncorporation",
							label: "Certificate of Incorporation",
							type: "file",
							required: true,
						},
					]}
					defaultValues={{ email: user?.email }}
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
						<div className="w-3/5">
							<EngagementChart />
						</div>
						<div className="w-2/4">
							<SurveyPaymentStatsChart />
						</div>
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

			<div className="flex w-full justify-between gap-5 mt-5" >
				{module === "Survey" && (
					<div className="w-2/5">
						<TopSurveys />
					</div>
				)}

				{module === "Data Flywheel" && (
					<div className="w-2/5">
						<TopPipelines />
					</div>
				)}

				<div className="flex w-3/5 gap-5">
					<RespondersGrowth />
					<TopOrganization />
				</div>
			</div>
		</div>
	);
};


export default SuperAdminDashboard;
