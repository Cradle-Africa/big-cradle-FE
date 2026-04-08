import axios from "@/app/lib/axios";
// import SentimentAnalysis from "../charts/SentimentAnalysis";
import EngagementChart from "../charts/EngagementChart";
// import SentimentChart from "../charts/SentimentCharts";

import FlywheelAverageEntriesChart from "../charts/FlywheelAverageEntriesChart";
import FlywheelEntryVolumeChart from "../charts/FlywheelEntryVolumeChart";
import { useState } from "react";
import { useFetchMe } from "@/app/shared-data-point/_features/hooks";
import KycVerification from "../KycVerification";
import TopPipelines from "../charts/TopPipelines";
import { Spinner } from "@radix-ui/themes";
import PlatformOverviewHeader from "../charts/PlatformOverviewHeader";
import Summary from "../charts/Summary";
import SurveyPaymentStatsChart from "../charts/SurveyPaymentStatsChart";
import TopSurveys from "../charts/TopSurveys";

const EmployeeDashboard = () => {
	const [openBusinessKycVerification, setOpenBusinessKycVerification] =
		useState(false);
	const [openAdminKycVerification, setOpenAdminKycVerification] =
		useState(false);
	const [module, setModule] = useState<string>('Data Flywheel');
	const [business, setBusiness] = useState<string>("");

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
				user={user?.data!}
				module={module}
				setModule={setModule}
				setBusiness={setBusiness}
			/>

			<Summary module={module} business={business} />

			{/* Engagement and sentiment charts*/}
			{module === 'Survey' && (
				<>
					<div className="mt-5">
						<div className="md:flex justify-between gap-5">
							<div className="md:w-3/5">
								<EngagementChart module={module} business={business} />
							</div>
							<div className="md:w-2/4 mt-5 md:mt-0">
								<SurveyPaymentStatsChart business={business} />
							</div>
						</div>

						<div className="w-full mt-5 md:mt-0">
							<TopSurveys />
						</div>
					</div>
				</>
			)}
			{module === 'Data Flywheel' && (
				<div className="h-[410px] mt-5">
					<div className="md:flex justify-between gap-5">
						<div className="md:w-3/5">
							<FlywheelAverageEntriesChart business={business} />
						</div>
						<div className="md:w-2/4 mt-5 md:mt-0">
							<FlywheelEntryVolumeChart business={business} />
						</div>
					</div>
					<div className="w-full mt-5 md:mt-0">
						<TopPipelines business={business} />
					</div>
				</div>
			)}
		</div>
	);
};

export default EmployeeDashboard;
