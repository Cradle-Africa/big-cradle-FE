import { useUser } from "@/app/hooks/useUser";
import { useState } from "react";
import FormPopup from "../pop-up/PopUpForm";
import DashboardSkeleton from "../skeleton/Dashboardskeleton";
import EngagementChart from "../charts/EngagementChart";
import SentimentChart from "../charts/SentimentCharts";
import PlatformOverviewHeader from "../charts/PlatformOverviewHeader";
import Summary from "../charts/Summary";

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
			<div className="flex justify-between gap-5 mt-5">
				<EngagementChart />
				<SentimentChart module={module} />
			</div>
		</div>
	);
};


export default SuperAdminDashboard;
