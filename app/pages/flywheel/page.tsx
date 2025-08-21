'use client';
import DashboardLayout from "@/app/DashboardLayout";
import { Plus } from "lucide-react";
import { JSX, useEffect, useRef, useState } from "react";
// import DataPoints from "./datapoint/DataPoints";
import FlywheelTabs from "./_components/FlywheelTabs";
import Overview from "./_components/Overview";
import axios from "@/app/lib/axios";
import PopUp from "./_components/Popup";
import { useFetchDataOverview, useFetchPipelines } from "./_features/hook";
import NewPipeLine from '@/app/pages/flywheel/pipeline/NewPipeline';
import Pipeline from '@/app/pages/flywheel/pipeline/Pipeline';
import { getBusinessId, getUser } from "@/app/utils/user/userData";
import { useSearchParams } from "next/navigation";
import { Spinner } from "@radix-ui/themes";
// import NewDataPoint from "./datapoint/new/NewDataPoint";

type TabKey = 'Overview' | 'Data Pipelines' | '';

const Flywheel = () => {
	const menuRef = useRef<HTMLDivElement>(null);
	const tabs: TabKey[] = ['Overview', 'Data Pipelines', ''];
	const [selectedTab, setSelectedTab] = useState<TabKey>('');
	const searchParams = useSearchParams();

	useEffect(() => {
		const tabParam = searchParams.get('tab')?.toLowerCase().trim();
		switch (tabParam) {
			case 'pipelines':
				setSelectedTab('Data Pipelines');
				break;
			default:
				setSelectedTab('Overview');
		}
	}, [searchParams]);

	const user = getUser();
	let businessUserId = '';
	if (user?.role === 'business') {
		businessUserId = getBusinessId() ?? ''
	} else if (user?.role === 'employee') {
		businessUserId = user.businessUserId
	}

	const [selectedDepartment, setSelectedDepartment] = useState('');
	const [selectedStartDate, setSelectedStartDate] = useState('');
	const [selectedEndDate, setSelectedEndDate] = useState('');
	const [search, setSearch] = useState('');

	const [popupOpen, setPopupOpen] = useState(false);
	const [creatingPipeline, setCreatingPipeline] = useState(false);

	const [pipelinePage, setPipelinePage] = useState(1);
	const [pipelineLimit, setPipelineLimit] = useState(10);


	const { data: dataOverview, isLoading: isLoadingDataOverview, isError } = useFetchDataOverview(axios);

	const {
		isLoading: isLoadingPipelines,
		data: pipelineData,
		refetch,
	} = useFetchPipelines({
		axios,
		queryParams: {
			businessUserId,
			departmentId: selectedDepartment || '',
			startDate: selectedStartDate,
			endDate: selectedEndDate,
			search: search,
			page: pipelinePage,
			limit: pipelineLimit,
		},
	});

	const pagination = {
		page: pipelineData?.page || 1,
		limit: pipelineData?.limit || 10,
		total: pipelineData?.total || 0,
		pages: Math.ceil((pipelineData?.total || 0) / (pipelineData?.limit || 10)),
	};

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setPopupOpen(false);
			}
		};
		document.addEventListener('mousedown', handler);
		return () => document.removeEventListener('mousedown', handler);
	}, []);

	useEffect(() => {
		refetch();
	}, [
		refetch,
		selectedStartDate,
		selectedEndDate,
		selectedDepartment,
		search,
		pipelinePage,
		pipelineLimit,
	]);

	if (isLoadingDataOverview) return (
		<div>
			<DashboardLayout>
				<Spinner />
			</DashboardLayout>
		</div>
	);
	if (isError || !dataOverview) return (
		<div>
			<DashboardLayout>
				No  data overview
			</DashboardLayout>
		</div>
	)

	// const TabContent = {
	const TabContent: Record<TabKey, () => JSX.Element> = {

		"": () => (
			<Spinner />
		),

		"Overview": () => (

			<>
				<div className="flex justify-between mb-5 border-b border-gray-300 pb-3">
					<div className="flex justify-between mt-5">
						<div className="flex flex-col gap-2">
							<p>Transform insights into actions that accelerate your business growth</p>
						</div>
					</div>
				</div>
				<Overview
					pipelines={dataOverview.totalDataPoints}
					dataPoint={dataOverview.totalFields}
					dataEntries={dataOverview.totalEntries}
				/>
			</>

		),

		"Data Pipelines": () => (
			<div className="mt-5">
				{creatingPipeline ? (
					<>
						<NewPipeLine setCreatingPipeline={setCreatingPipeline} />
					</>
				) : (
					<>
						<div className="flex justify-between mb-5 border-b border-gray-300 pb-3">
							<div className="flex justify-between">
								<div className="flex flex-col gap-2">
									<p>Transform insights into actions that accelerate your business growth</p>
								</div>
							</div>
							<button
								className="flex items-center bg-blue-600 text-white px-3 h-[35px] rounded-md cursor-pointer"
								onClick={() => setPopupOpen(true)}
							>
								<Plus size={18} color="white" className="mr-1" />
								Build a new Pipeline
							</button>
						</div>

						{/* Add proper loading and empty state handling */}
						{isLoadingPipelines ? (
							<div className="mt-5">
								<Spinner />
							</div>
						) : (
							<>
								<Pipeline
									pipelineData={pipelineData?.data ?? []}
									pagination={pagination}
									onPageChange={setPipelinePage}
									onLimitChange={(newLimit) => {
										setPipelineLimit(newLimit);
										setPipelinePage(1);
									}}
									selectedDepartment={selectedDepartment}
									selectedStartDate={selectedStartDate}
									selectedEndDate={selectedEndDate}
									setSelectedDepartment={setSelectedDepartment}
									setSelectedStartDate={setSelectedStartDate}
									setSelectedEndDate={setSelectedEndDate}
									search={search}
									setSearch={setSearch}
									loading={false} // Set to false here since we already checked loading state
								/>
							</>
						)}
					</>
				)}
			</div>
		),
	};

	return (
		<DashboardLayout>
			<PopUp
				openPopup={popupOpen}
				onClose={() => setPopupOpen(false)}
				onBuildPipeline={() => {
					setCreatingPipeline(true);
					// setCreatingDataPoint(false);
				}}
			/>

			<div className="flex flex-col h-screen py-4">
				<div className="flex gap-4">
					{tabs.map((tab) => (
						<FlywheelTabs
							key={tab}
							isSelected={tab === selectedTab}
							label={tab}
							onClick={() => setSelectedTab(tab)}
						/>
					))}
				</div>

				{/* Tab Layout Rendering */}
				{TabContent[selectedTab]?.()}
			</div>
		</DashboardLayout>
	);
};

export default Flywheel;
