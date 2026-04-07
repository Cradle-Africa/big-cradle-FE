import axios from "@/app/lib/axios";
import DashboardSkeleton from "../skeleton/Dashboardskeleton";
import { useFetchMe } from "@/app/shared-data-point/_features/hooks";
import KycVerification from "../KycVerification";
import { useState } from "react";
import { Flex, Spinner } from "@radix-ui/themes";
import EngagementChart from "../charts/EngagementChart";
import PlatformOverviewHeader from "../charts/PlatformOverviewHeader";
import Summary from "../charts/summaryCard/Summary";
import FlywheelAverageEntriesChart from "../charts/flywheelaverageentriescharts.ts/FlywheelAverageEntriesChart";
import FlywheelEntryVolumeChart from "../charts/flywheelentryvolumecharts.tsx/FlywheelEntryVolumeChart";
import SurveyPaymentStatsChart from "../charts/SurveyPaymentStatsChart";
import TopSurveys from "../charts/TopSurveys";
import TopPipelines from "../charts/toppipelines/TopPipelines";

const AdminDashboard = () => {
	const [openBusinessKycVerification, setOpenBusinessKycVerification] = useState(false);
	const [openAdminKycVerification, setOpenAdminKycVerification] = useState(false);
	const { data: user, isLoading } = useFetchMe({ axios });
	const [module, setModule] = useState<string>("Survey");
	const [business, setBusiness] = useState<string | null>(null); // null means "not loaded yet"
	const [businessLoaded, setBusinessLoaded] = useState(false); // track when business is set

	if (isLoading) {
		return <DashboardSkeleton />;
	}

	const handleSetBusiness = (value: string | null) => {
		setBusiness(value);
		setBusinessLoaded(true);
	};
	if (
		user?.data.kycStatus === 'not-submitted' ||
		user?.data.kycStatus === 'pending' ||
		user?.data.kycStatus === 'rejected'
	) {
		return (
			<KycVerification
				openBusinessKycVerification={openBusinessKycVerification}
				setOpenBusinessKycVerification={setOpenBusinessKycVerification}
				openAdminKycVerification={openAdminKycVerification}
				setOpenAdminKycVerification={setOpenAdminKycVerification}
				user={user?.data!}
			/>
		);
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
				setBusiness={handleSetBusiness}
			/>

			{businessLoaded && !business && (
				<div className="flex justify-center px-10 py-10 bg-gray-100 rounded-md">
					No business attached to this account
				</div>
			)}

			{/* Summary cards */}
			{business && (
				<Summary module={module} business={business} />
			)}

			{/* Engagement and sentiment charts*/}
			{module === 'Survey' && business && (
				<>
					<div className="md:flex justify-between gap-5 mt-5">
						<div className="md:w-3/5">
							<EngagementChart module={module} business={business} />
						</div>
						<div className="md:w-2/4 mt-5 md:mt-0">
							<SurveyPaymentStatsChart business={business} />
						</div>
					</div>
				</>
			)}
			{module === 'Data Flywheel' && business && (
				<div className="flex justify-between h-[410px] gap-5 mt-5">
					<div className="w-3/5">
						<FlywheelAverageEntriesChart business={business} />
					</div>
					<div className="w-2/4">
						<FlywheelEntryVolumeChart business={business} />
					</div>
				</div>
			)}

			<Flex className="mt-5">
				{module === "Survey" && business && (
					<div className="w-full">
						<TopSurveys module={module} business={business} />
					</div>
				)}

				{module === "Data Flywheel" && business && (
					<div className="w-full">
						{business && <TopPipelines business={business} />}
					</div>
				)}
			</Flex>
		</div>
	);
};

export default AdminDashboard;
