import axios from "@/app/lib/axios";
import DashboardSkeleton from "../skeleton/Dashboardskeleton";
import { useFetchMe } from "@/app/shared-data-point/_features/hooks";
import KycVerification from "../KycVerification";
import { useState } from "react";
import { Flex, Spinner } from "@radix-ui/themes";
import EngagementChart from "../charts/EngagementChart";
import PlatformOverviewHeader from "../charts/PlatformOverviewHeader";
import Summary from "../charts/Summary";
import FlywheelAverageEntriesChart from "../charts/FlywheelAverageEntriesChart";
import FlywheelEntryVolumeChart from "../charts/FlywheelEntryVolumeChart";
import SurveyPaymentStatsChart from "../charts/SurveyPaymentStatsChart";
import TopSurveys from "../charts/TopSurveys";
import TopPipelines from "../charts/TopPipelines";

const BusinessDashboard = () => {
	const [openBusinessKycVerification, setOpenBusinessKycVerification] = useState(false);
	const [openAdminKycVerification, setOpenAdminKycVerification] = useState(false);
	const { data: user, isLoading } = useFetchMe({ axios });
	const [module, setModule] = useState<string>("Data Flywheel");
	const [business, setBusiness] = useState<string>("");

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
				user={user?.data!}
				module={module}
				setModule={setModule}
				setBusiness={setBusiness}
			/>
			{/* Summary cards */}
			<Summary module={module} business={business} />

			{/* Engagement and sentiment charts*/}
			{module === 'Survey' && (
				<>
					<div className="flex justify-between gap-5 mt-5">
						<div className="w-3/5">
							<EngagementChart module={module} business={business}/>
						</div>
						<div className="w-2/4">
							<SurveyPaymentStatsChart business={business} />
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

			<Flex className="mt-5">
				{module === "Survey" && (
					<div className="w-full">
						<TopSurveys  module={module} business={business} />
					</div>
				)}

				{module === "Data Flywheel" && (
					<div className="w-full">
						<TopPipelines />
					</div>
				)}
			</Flex>
		</div>
	);
};

export default BusinessDashboard;
