'use client';
import DashboardLayout from "@/app/DashboardLayout";
import { List, Plus } from "lucide-react";
import { JSX, useEffect, useRef, useState } from "react";
import DataPoints from "./datapoint/DataPoints";
import FlywheelTabs from "./_components/FlywheelTabs";
import NewDataPoint from "./datapoint/NewDataPoint";
import Overview from "./_components/Overview";
import axios from "@/app/lib/axios";
import PopUp from "./_components/Popup";
import { useFetchDataOverview, useFetchDataPoints, useFetchPipelines, useFetchPipelinesByDepartment } from "./_features/hook";
import NewPipeLine from '@/app/pages/flywheel/pipeline/NewPipeline';
import Pipeline from '@/app/pages/flywheel/pipeline/Pipeline';
import { getBusinessId, getUser } from "@/app/utils/user/userData";
import { useSearchParams } from "next/navigation";

type TabKey = 'Overview' | 'Data Pipelines' | 'Data Points' | '';

const Flywheel = () => {
	const menuRef = useRef<HTMLDivElement>(null);
	const tabs: TabKey[] = ['Overview', 'Data Pipelines', 'Data Points'];
	const [selectedTab, setSelectedTab] = useState<TabKey>('');
	const searchParams = useSearchParams();

	useEffect(() => {
		const tabParam = searchParams.get('tab')?.toLowerCase().trim();

		switch (tabParam) {
			case 'pipelines':
				setSelectedTab('Data Pipelines');
				break;
			case 'data-points':
				setSelectedTab('Data Points');
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
	const [popupOpen, setPopupOpen] = useState(false);
	const [creatingPipeline, setCreatingPipeline] = useState(false);
	const [creatingDataPoint, setCreatingDataPoint] = useState(false);

	const [pointsPage, setPointsPage] = useState(1);
	const [pointsLimit, setPointsLimit] = useState(10);
	const [pipelinePage, setPipelinePage] = useState(1);
	const [pipelineLimit, setPipelineLimit] = useState(10);

	const { data: dataPoints } = useFetchDataPoints({
		axios,
		queryParams: { page: pointsPage, limit: pointsLimit }
	});
	const datapoints = dataPoints?.data ?? [];
	const paginationDataPoints = dataPoints?.pagination ?? { page: 1, limit: 10, pages: 1, total: 0 }

	const { data: dataOverview, isLoading: isLoadingDataOverview, isError } = useFetchDataOverview(axios);

	const {
		isLoading: isLoadingDataPoints,
		data: pipelineData,
		refetch: refetchPipelines
	} = useFetchPipelines({
		axios,
		queryParams: { page: pipelinePage, limit: pipelineLimit }
	});

	const {
		data: filteredPipelineData,
		isLoading: isLoadingFilteredPipeline,
	} = useFetchPipelinesByDepartment({
		axios,
		queryParams: {
			businessUserId: businessUserId,
			departmentId: selectedDepartment,
			page: pipelinePage,
			limit: pipelineLimit,
		},
		enabled: !!selectedDepartment, // only fetch when department is selected
	});

	// Simplified pipelines to render logic
	const pipelinesToRender = selectedDepartment
		? filteredPipelineData?.data ?? []
		: pipelineData?.data ?? [];

	const isLoadingPipelines = selectedDepartment
		? isLoadingFilteredPipeline
		: isLoadingDataPoints;

	const pipelinePaginationToRender = selectedDepartment
		? {
			page: filteredPipelineData?.page || 1,
			limit: filteredPipelineData?.limit || 10,
			total: filteredPipelineData?.total || 0,
			pages: Math.ceil((filteredPipelineData?.total || 0) / (filteredPipelineData?.limit || 10)),
		}
		: {
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
        refetchPipelines();
    }, [refetchPipelines, searchParams])

	if (isLoadingDataOverview) return (
		<div>
			<DashboardLayout>
				Loading...
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
			<p>Loading ...</p>
		), 

		"Overview": () => (
			<Overview
				pipelines={dataOverview.totalDataPoints}
				dataPoint={dataOverview.totalFields}
				dataEntries={dataOverview.totalEntries}
			/>
		),

		"Data Pipelines": () => (
			<div className="mt-5">
				{creatingPipeline ? (
					<>
						<div className="">
							<button
								className="flex justify-end items-center bg-blue-600 text-white px-4 mt-5 py-1 rounded-md cursor-pointer"
								onClick={() => setCreatingPipeline(false)}
							>
								<List size={18} color="white" className="mr-1" />
								View Pipelines
							</button>
						</div>

						<NewPipeLine setCreatingPipeline={setCreatingPipeline} />
					</>
				) : (
					<>
						<div className="flex justify-between">
							<h2 className="text-lg text-black">Data pipelines</h2>
							<button
								className="flex items-center bg-blue-600 text-white px-3 py-1 rounded-md cursor-pointer"
								onClick={() => setPopupOpen(true)}
							>
								<Plus size={18} color="white" className="mr-1" />
								Build a new Pipeline
							</button>
						</div>

						{/* Add proper loading and empty state handling */}
						{isLoadingPipelines ? (
							<div className="mt-5">Loading pipelines...</div>
						) : (
							<>
								{/* {pipelinesToRender.length === 0 ? (
									<div className="mt-5">
										{selectedDepartment
											? "No pipelines found for this department"
											: "No pipelines found"}
									</div>
								) : ( */}
								<Pipeline
									pipelineData={pipelinesToRender}
									pagination={pipelinePaginationToRender}
									onPageChange={setPipelinePage}
									onLimitChange={(newLimit) => {
										setPipelineLimit(newLimit);
										setPipelinePage(1);
									}}
									selectedDepartment={selectedDepartment}
									setSelectedDepartment={setSelectedDepartment}
									loading={false} // Set to false here since we already checked loading state
								/>
								{/* )} */}
							</>
						)}
					</>
				)}
			</div>
		),

		"Data Points": () => (
			<div className="mt-5">
				{creatingDataPoint ? (
					<>
						<NewDataPoint
							creatingDataPoint={creatingDataPoint}
							setCreatingDataPoint={setCreatingDataPoint}
							pipelines={pipelinesToRender}
						/>
					</>
				) : (
					<>
						{isLoadingDataPoints ? (
							<div className="mt-5">Loading ...</div>
						) : (
							<DataPoints
								data={datapoints}
								pagination={paginationDataPoints}
								onPageChange={setPointsPage}
								onLimitChange={(newLimit) => {
									setPointsLimit(newLimit);
									setPointsPage(1);
								}}
								creatingDataPoint={creatingDataPoint}
								setCreatingDataPoint={setCreatingDataPoint}
							/>

						)}
					</>
				)}
			</div>
		)
	};

	return (
		<DashboardLayout>
			<PopUp
				openPopup={popupOpen}
				onClose={() => setPopupOpen(false)}
				onBuildPipeline={() => {
					setCreatingPipeline(true);
					setCreatingDataPoint(false);
				}}
			/>

			<div className="flex justify-between">
				<div className="flex flex-col gap-2">
					<p className="font-medium text-black">Data flywheel</p>
					<p>Transform insights into actions that accelerate your business growth</p>
				</div>
			</div>

			<div className="flex flex-col bg-[#fcfcfc] py-4 mt-5">
				<div className="flex gap-4 bg-[#fcfcfc]">
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
