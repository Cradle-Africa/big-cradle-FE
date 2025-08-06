import { useState } from "react";
import PlatformOverviewHeader from "../charts/PlatformOverviewHeader";
import Summary from "../charts/Summary";
import FormPopup from "../pop-up/PopUpForm";
import DashboardSkeleton from "../skeleton/Dashboardskeleton";
// import { Flex, Grid } from "@radix-ui/themes";
import axios from "@/app/lib/axios";
import { useFetchMe } from "@/app/shared-data-point/_features/hooks";
import CreatedDataPipeline from "../charts/CreatedDataPipelineCharts";
import CreatedSurvey from "../charts/CreatedSurveyCharts";
import TopResearchers from "../charts/TopResearchers";

const SuperAdminDashboard = () => {
	const [openKycVerification, setOpenKycVerification] = useState(false);
	const { data: Authuser, isLoading } = useFetchMe({ axios });

	const [module, setModule] = useState<string>("Survey");
	const [business, setBusiness] = useState<string>("");

	if (isLoading) {
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
							label: "Certificate of Corporation",
							type: "file",
							required: true,
						},
					]}
					defaultValues={{ email: Authuser?.data?.email }}
				/>
			)}
			{/* Header with module select */}
			<PlatformOverviewHeader
				user={Authuser?.data!}
				module={module}
				setModule={setModule}
				setBusiness={setBusiness}
			/>
			{/* Summary cards */}
			<Summary module={module} business={business} />


			<div className="flex justify-between gap-5 mt-5">
				<div className="w-5/5">
					<CreatedDataPipeline />
				</div>
			</div>


			<div className="flex justify-between gap-5 mt-5">
				<div className="w-5/5">
					<CreatedSurvey />
				</div>
			</div>

			<div className="flex w-full justify-between gap-5 mt-5" >
				<div className="w-2/5">
					<TopResearchers />
				</div>
			</div>
		</div>
	);
};


export default SuperAdminDashboard;
