import axios from "@/app/lib/axios";
import { useFetchMe } from "@/app/shared-data-point/_features/hooks";
import { useState } from "react";
import KycVerification from "../KycVerification";
import { IntroductionSkeleton } from "../skeleton/IntroductionSkeleton";
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
						<IntroductionSkeleton/>
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
					<div className="mt-5">
						<div className="relative md:flex justify-between gap-5">
							<div className="md:w-3/5">
								<EngagementChart  />
							</div>
							<div className="md:w-2/4 mt-5 md:mt-0">
								<SurveyPaymentStatsChart />
							</div>
						</div>
						{module === "Survey" && (
							<div className="w-full mt-5">
								<TopSurveys module={module} business={business} />
							</div>
						)}
					</div>
				</>
			)}
			{module === 'Data Flywheel' && (
				<>
					<div className=" h-[410px] gap-5 mt-5">
						<div className="relative md:flex justify-between gap-5">
							<div className="md:w-3/5">
								<FlywheelAverageEntriesChart />
							</div>
							<div className="relative md:w-2/4 mt-5 md:mt-0">
								<FlywheelEntryVolumeChart />
							</div>
						</div>
						<div className="w-full mt-5">
							<TopPipelines business={business} />
						</div>
					</div>
				</>

			)}
			{/* <SentimentChart module={module} /> */}


		</div >
	);
};

export default BusinessDashboard;
