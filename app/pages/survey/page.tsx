"use client";

import DashboardLayout from "@/app/DashboardLayout";
import axios from "@/app/lib/axios";
import { DashboardMenu, SurveyListItem } from "@/app/lib/type";
import SurveyStatus from "@/app/pages/survey/_components/SurveyStatus";
import { getUser } from "@/app/utils/user/userData";
import { FolderOpenDot, Plus, ShieldBan, ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import SurveyCard from "./_components/SurveyCard";
import { statuses } from "./_components/SurveyStatus";
import SurveyTable from "./_components/SurveyTable";
import {
	useFetchSuperAdminSurvey,
	useFetchSurvey,
	useFetchSurveyAnalyctics,
	useVerifySurveyPayment,
} from "./_features/hooks";
import SurveyPageLoading from "./loading";
import { Spinner } from "@radix-ui/themes";
import PopUp from "./_components/Popup";

const SurveyPage = () => {
	const searchParam = useSearchParams();
	const router = useRouter();
	const searchParams = useSearchParams();
	const [surveyDashBoardItems, setSurveyDashBoardItems] = useState<DashboardMenu[]>();
	const [popupOpen, setPopupOpen] = useState(false);
	const [, setCreatingSurvey] = useState(false);

	const surveyStatus = searchParam.get("status");
	const user = getUser();
	const changeStatus = (status: string) => {
		const params = new URLSearchParams(searchParams);
		params.set("status", status);
		router.push("?" + params.toString());
	};

	const txRef = searchParams.get("tx_ref");
	const {
		mutateAsync: verifyPayment,
		isPending: isVerifing,
		data: paymentMadeData,
		isSuccess: isVerifyPaymentSuccess,
		isError,
	} = useVerifySurveyPayment({
		axios,
	});

	const [selectedStartDate, setSelectedStartDate] = useState('');
	const [selectedEndDate, setSelectedEndDate] = useState('');
	const [search, setSearch] = useState('');

	const [surveyPage, setSurveyPage] = useState(1);
	const [surveyLimit, setSurveyLimit] = useState(10);

	const isBusiness = user?.role === "business";
	const isSuperAdmin = user?.role === "super admin";

	const {
		data: surveysListResponse,
		isLoading: isLoadingSurveyList,
		refetch: refetchSurveyList,
	} = useFetchSurvey({
		axios,
		page: surveyPage,
		limit: surveyLimit,
		startDate: selectedStartDate,
		endDate: selectedEndDate,
		search: search,
		businessUserId: isBusiness ? user?.id : null,
		enabled: isBusiness,
	});

	const {
		data: superAdminSurveysListResponse,
		isLoading: isLoadingSuperAdminSurveys,
		refetch: refetchSuperAdminSurvey,
	} = useFetchSuperAdminSurvey({
		axios,
		page: surveyPage,
		limit: surveyLimit,
		startDate: selectedStartDate,
		endDate: selectedEndDate,
		search: search,
		enabled: isSuperAdmin,
	});

	// Pagination for business
	const survey_pagination = {
		page: surveysListResponse?.pagination?.page || 1,
		limit: surveysListResponse?.pagination?.limit || 10,
		total: surveysListResponse?.pagination?.total || 0,
		pages: Math.ceil((surveysListResponse?.pagination?.total || 0) / (surveysListResponse?.pagination?.limit || 10)),
	};

	// Pagination for super admin
	const super_admin_survey_pagination = {
		page: Number(superAdminSurveysListResponse?.pagination?.page || 1),
		limit: Number(superAdminSurveysListResponse?.pagination?.limit || 10),
		total: Number(superAdminSurveysListResponse?.pagination?.total || 0),
		pages: Math.ceil(
			Number(superAdminSurveysListResponse?.pagination?.total || 0) /
			Number(superAdminSurveysListResponse?.pagination?.limit || 10)
		),
	};

	const {
		data: surveysAnalyticsResponse,
		isSuccess: analyticsSuccess,
		isLoading: analyticsLoading,
	} = useFetchSurveyAnalyctics({
		axios,
		businessUserId: user?.id ?? "",
	});

	const filteredSurveys = useMemo(() => {
		let surveys: SurveyListItem[] = [];
		if (user?.role === "business") {
			surveys = surveysListResponse?.survey || [];
		} else if (user?.role === "super admin") {
			surveys = superAdminSurveysListResponse?.data || [];
		}

		if (!surveyStatus || surveyStatus === "all") return surveys;
		if (surveyStatus.toLowerCase() === "active") {
			return surveys.filter((survey) => survey.isActive);
		} else {
			return surveys.filter((survey) => !survey.isActive);
		}
	}, [
		surveyStatus,
		surveysListResponse?.survey,
		superAdminSurveysListResponse?.data,
		user?.role,
	]);

	const verifyPayementFunc = useCallback(async () => {
		try {
			await verifyPayment(txRef || "");
		} catch (error) {
			console.log(error);
		}
	}, [txRef, verifyPayment]);

	useEffect(() => {
		try {
			if (txRef) verifyPayementFunc();
		} catch (error: any) {
			toast.error(`${error.message}`);
		}
	}, [txRef, verifyPayementFunc]);

	useEffect(() => {
		if (isVerifyPaymentSuccess) {
			if (paymentMadeData?.paymentStatus === "paid") {
				toast.success("Payment made successfull");
			} else {
				toast.error("Error when making payments");
			}
		}
	}, [
		txRef,
		verifyPayementFunc,
		isVerifyPaymentSuccess,
		paymentMadeData?.paymentStatus,
	]);

	useEffect(() => {
		if (analyticsSuccess && surveysAnalyticsResponse) {
			const dashBoardValue: DashboardMenu[] = [
				{
					value: `${surveysAnalyticsResponse.data.totalSurveys}`,
					title: "All surveys",
					subTitle: "All created surveys",
					icon: <FolderOpenDot size={16} color="blue" />,
				},
				{
					value: `${surveysAnalyticsResponse.data.totalEntries}`,
					title: "Total entries",
					subTitle: "All regitered entries",
					icon: <ShieldCheck size={16} color="blue" />,
				},
				{
					value: `${surveysAnalyticsResponse.data.totalAmount}`,
					title: "Total Amount",
					subTitle: "Total amount",
					icon: <ShieldBan size={16} color="blue" />,
				},
			];

			setSurveyDashBoardItems(dashBoardValue);
		}
	}, [analyticsSuccess, surveysAnalyticsResponse]);

	useEffect(() => {
		if (isError) toast.error(`An error occured when verifing your payment`);
	}, [isError, txRef, verifyPayementFunc]);

	useEffect(() => {
		if (user?.role === 'business') {
			refetchSurveyList();
		}
	}, [user?.role, refetchSurveyList, selectedStartDate, selectedEndDate, search, surveyLimit, surveyPage]);

	useEffect(() => {
		if (user?.role === 'super admin') {
			refetchSuperAdminSurvey();
		}
	}, [user?.role, refetchSuperAdminSurvey, selectedStartDate, selectedEndDate, search, surveyLimit, surveyPage]);


	if (analyticsLoading || isVerifing)
		return <SurveyPageLoading />;

	// if (isLoadingSurveyList || isLoadingSuperAdminSurveys)
	// 	return <SurveyPageLoading />;

	return (
		<DashboardLayout>

			<PopUp
				openPopup={popupOpen}
				onClose={() => setPopupOpen(false)}
				onBuildPipeline={() => {
					setCreatingSurvey(true);
					// setCreatingDataPoint(false);
				}}
			/>
			<div className="w-full">
				<div className="flex justify-between">
					<p className="font-semibold text-lg text-black">Surveys</p>

					<button
						className="flex bg-blue-600 rounded-md px-4 py-1 lg:py-2 cursor-pointer"
					//   onClick={() => setOpen(true)}
					>
						<button
							onClick={() => setPopupOpen(true)}
							// href="/pages/survey/new?survey=survey-name-and-description">
							className="flex items-center gap-2 hover:cursor-pointer">
							<Plus size={18} color="white" />
							<span className="text-white">Create new survey</span>
						</button>
					</button>

				</div>
				<p className="mt-2">
					View, manage, and track your survey tasks. Create new surveys to
					collect insights in real time
				</p>
			</div>
			{/* Build the cards area */}
			<div className="grid grid-cols-2 md:grid md:grid-cols-3 2xl:grid 2xl:grid-cols-4 gap-3 lg:gap-6 mt-8">
				{surveyDashBoardItems?.map((menu, index) => (
					<SurveyCard
						key={`${menu.title}`}
						data={menu}
						isHighLighted={index === 0}
					/>
				))}
			</div>
			{/* Survey table  */}
			<div className="flex flex-col rounded-md bg-white lg:p-4 mt-8">
				<p className="font-bold text-black">Surveys</p>
				<div className="flex gap-4 my-4">
					{statuses.map((status) => (
						<SurveyStatus
							key={status}
							isSelected={status.toLowerCase() === surveyStatus}
							status={status}
							onClick={() => changeStatus(status.toLowerCase())}
						/>
					))}
				</div>

				{isLoadingSurveyList && isLoadingSuperAdminSurveys && (
					<div> <Spinner /> </div>
				)}

				<SurveyTable
					data={filteredSurveys || []}
					pagination={user?.role === "super admin" ? super_admin_survey_pagination : survey_pagination}
					onPageChange={setSurveyPage}
					onLimitChange={(newLimit) => {
						setSurveyLimit(newLimit);
						setSurveyPage(1);
					}}
					selectedStartDate={selectedStartDate}
					selectedEndDate={selectedEndDate}
					setSelectedStartDate={setSelectedStartDate}
					setSelectedEndDate={setSelectedEndDate}
					search={search}
					setSearch={setSearch}
					loading={false} // Set to false here since we already checked loading state
				/>



			</div>
		</DashboardLayout>
	);
};

export default SurveyPage;
