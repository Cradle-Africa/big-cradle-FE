import axios from "@/app/lib/axios";
import { useFetchMe } from "@/app/shared-data-point/_features/hooks";
import { useState } from "react";
import KycVerification from "../KycVerification";
import { Flex, Spinner } from "@radix-ui/themes";
import PlatformOverviewHeader from "../charts/PlatformOverviewHeader";
import EngagementChart from "../charts/EngagementChart";
import Summary from "../charts/Summary";
import FlywheelAverageEntriesChart from "../charts/FlywheelAverageEntriesChart";
import FlywheelEntryVolumeChart from "../charts/FlywheelEntryVolumeChart";
import TopSurveys from "../charts/TopSurveys";
import TopPipelines from "../charts/TopPipelines";
import SurveyPaymentStatsChart from "../charts/SurveyPaymentStatsChart";

const BusinessDashboard = () => {
	const [openBusinessKycVerification, setOpenBusinessKycVerification] =
		useState(false);
	const [openAdminKycVerification, setOpenAdminKycVerification] =
		useState(false);
	const [module, setModule] = useState<string>("Data Flywheel");
	const [business, setBusiness] = useState<string>("");

	const { data: Authuser, isLoading } = useFetchMe({ axios });

	if (Authuser?.data.kycStatus === 'not-submitted' || Authuser?.data.kycStatus === 'pending' || Authuser?.data.kycStatus === 'rejected') {
		return (
			<KycVerification
				openBusinessKycVerification={openBusinessKycVerification}
				setOpenBusinessKycVerification={setOpenBusinessKycVerification}
				openAdminKycVerification={openAdminKycVerification}
				setOpenAdminKycVerification={setOpenAdminKycVerification}
				user={Authuser?.data!}
			/>
		)
	}
	return (
		<div>
			{isLoading && (
				<div>
					<p>
						<Spinner />{" "}
					</p>
				</div>
			)}

			<KycVerification
				openBusinessKycVerification={openBusinessKycVerification}
				setOpenBusinessKycVerification={setOpenBusinessKycVerification}
				openAdminKycVerification={openAdminKycVerification}
				setOpenAdminKycVerification={setOpenAdminKycVerification}
				user={Authuser?.data!}
			/>

			{/* Header with module select */}
			<PlatformOverviewHeader
				user={Authuser?.data!}
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
			{/* <SentimentChart module={module} /> */}

			<Flex className="mt-5">
				{module === "Survey" && (
					<div className="w-full">
						<TopSurveys module={module} business={business} />
					</div>
				)}

				{module === "Data Flywheel" && (
					<div className="w-full">
						<TopPipelines business={business} />
					</div>
				)}

			</Flex>
		</div >
	);
};

export default BusinessDashboard;
