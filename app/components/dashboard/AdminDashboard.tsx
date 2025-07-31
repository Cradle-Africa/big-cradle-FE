import axios from "@/app/lib/axios";
import DashboardSkeleton from "../skeleton/Dashboardskeleton";
import { useFetchMe } from "@/app/shared-data-point/_features/hooks";
import KycVerification from "../KycVerification";
import { useState } from "react";
import { Spinner } from "@radix-ui/themes";
import EngagementChart from "../charts/EngagementChart";
// import SentimentChart from "../charts/SentimentCharts";
import PlatformOverviewHeader from "../charts/PlatformOverviewHeader";
import Summary from "../charts/Summary";
import FlywheelAverageEntriesChart from "../charts/FlywheelAverageEntriesChart";
import FlywheelEntryVolumeChart from "../charts/FlywheelEntryVolumeChart";

const BusinessDashboard = () => {
	const [openBusinessKycVerification, setOpenBusinessKycVerification] = useState(false);
	const [openAdminKycVerification, setOpenAdminKycVerification] = useState(false);
	const { data: user, isLoading } = useFetchMe({ axios });
	const [module, setModule] = useState<string>("Data Flywheel");

	if (isLoading) {
		return <DashboardSkeleton />;
	}

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
		</div>
	);
};

export default BusinessDashboard;
