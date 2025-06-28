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
import { useFetchDataEntries, useFetchDataPoints, useFetchPipelines } from "./_features/hook";
import NewPipeLine from '@/app/pages/flywheel/pipeline/NewPipeline';
import Pipeline from '@/app/pages/flywheel/pipeline/Pipeline';

type TabKey = 'Overview' | 'Data Pipelines' | 'Data Points';

const Flywheel = () => {
	const menuRef = useRef<HTMLDivElement>(null);

	const tabs: TabKey[] = ['Overview', 'Data Pipelines', 'Data Points'];
	const [selectedTab, setSelectedTab] = useState<TabKey>('Overview');

	const [popupOpen, setPopupOpen] = useState(false);
	const [creatingPipeline, setCreatingPipeline] = useState(false);
	const [creatingDataPoint, setCreatingDataPoint] = useState(false);

	const [pointsPage, setPointsPage] = useState(1);
	const [pointsLimit, setPointsLimit] = useState(10);
	const [pipelinePage, setPipelinePage ] = useState(1);
	const [pipelineLimit, setPipelineLimit] = useState(10);

	const { isLoading: isLoadingDataPoints, data: pipelineData } = useFetchPipelines({
		axios,
		queryParams: { page: pipelinePage, limit: pipelineLimit }
	});
	const pipelines = pipelineData?.dataPoint ?? [];
	const paginationDataPipeline = pipelineData?.pagination ?? { page: 1, limit: 10, pages: 1, total: pipelines.length }

	const { data: dataPoints } = useFetchDataPoints({
		axios,
		queryParams: { page: pointsPage, limit: pointsLimit }
	});
	const datapoints = dataPoints?.data ?? [];
	const paginationDataPoints = dataPoints?.pagination ?? { page: 1, limit: 10, pages: 1, total: 0 }

	const { data: dataEntries } = useFetchDataEntries({
		axios,
		queryParams: { page: 0, limit: 0 }
	});
	const dataentries = dataEntries?.data ?? [];

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setPopupOpen(false);
			}
		};
		document.addEventListener('mousedown', handler);
		return () => document.removeEventListener('mousedown', handler);
	}, []);

	// const TabContent = {
	const TabContent: Record<TabKey, () => JSX.Element> = {

		"Overview": () => (
			<Overview pipelines={pipelines?.length} dataentries={dataentries?.length} />
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
								className="flex items-center bg-blue-600 text-white px-4 py-1 rounded-md cursor-pointer"
								onClick={() => setPopupOpen(true)}
							>
								<Plus size={18} color="white" className="mr-1" />
								Build a new Pipeline
							</button>
						</div>
						<Pipeline
							data={pipelines}
							pagination={paginationDataPipeline}
							onPageChange={setPipelinePage}
							onLimitChange={(newLimit) => {
								setPipelineLimit(newLimit);
								setPipelinePage(1);
							}}
						/>
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
							pipelines={pipelines}
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
