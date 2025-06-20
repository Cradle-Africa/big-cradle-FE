'use client';
import DashboardLayout from "@/app/DashboardLayout";
import { List, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import DataPoints from "./datapoint/DataPoints";
import FlywheelTabs from "./_components/FlywheelTabs";
import NewDataPoint from "./datapoint/NewDataPoint";
import Overview from "./_components/Overview";
import axios from "@/app/lib/axios"
import PopUp from "./_components/Popup";
import FlyWheelPageLoading from "./loading";
import { useFetchDataPoints, useFetchPipelines } from "./_features/hook";
import NewPipeLine from '@/app/pages/flywheel/pipeline/NewPipeline'
import Pipeline from '@/app/pages/flywheel/pipeline/Pipeline'

const Flywheel = () => {
	const menuRef = useRef<HTMLDivElement>(null);
	const tabs = ["Overview", "Data Pipelines", "Data Points"];
	const [selectedTab, setSelectedTab] = useState<string>(tabs[0]);
	const [popupOpen, setPopupOpen] = useState(false); // Controls main popup
	const [creatingPipeline, setCreatingPipeline] = useState(false); // Toggles NewPipeline view
	const [creatingDataPoint, setCreatingDataPoint] = useState(false); // Toggles NewDataPoint view

	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);

	const { isLoading: isLoadingPipelines, data: pipelinesData } = useFetchDataPoints({
		axios,
		queryParams: {
			page: 1,
			limit: 10
		}
	})

	const pipelines = pipelinesData?.dataPoint ?? [];
	const paginationPipelines = pipelinesData?.pagination;

	const { data: dataPoints } = useFetchPipelines({
		axios,
		queryParams: {
			page,
			limit,
		},
	});
	const datapoints = dataPoints?.data ?? []
	const paginationDataPoints = dataPoints?.pagination

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setPopupOpen(false);
			}
		};
		document.addEventListener('mousedown', handler);
		return () => document.removeEventListener('mousedown', handler);
	}, []);

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
					<p>
						Transform insights into actions that accelerate your business growth
					</p>
				</div>
			</div>

			<div className="flex flex-col bg-white p-4 mt-8">
				<div className="flex gap-4 my-4">
					{tabs.map((tab) => (
						<FlywheelTabs
							key={tab}
							isSelected={tab === selectedTab}
							label={tab}
							onClick={() => setSelectedTab(tab)}
						/>
					))}
				</div>
				{selectedTab === 'Overview' && (
					<Overview 
						pipelines={pipelines?.length}
					/>
				)}

				{selectedTab === 'Data Pipelines' && (
					<div className="mt-5">
						{creatingPipeline ? (
							<>
								<button
									className="flex items-center bg-blue-600 text-white px-4 py-1 rounded-full cursor-pointer"
									onClick={() => setCreatingPipeline(false)}
								>
									<List size={18} color="white" className="mr-1" />
									View Pipelines
								</button>
								<NewPipeLine />
							</>
						) : (
							<>
								<button
									className="flex items-center bg-blue-600 text-white px-4 py-1 rounded-full cursor-pointer"
									onClick={() => setPopupOpen(true)}
								>
									<Plus size={18} color="white" className="mr-1" />
									Build a new Pipeline
								</button>
								<Pipeline
									data={pipelines ?? []}
									pagination={paginationDataPoints ?? { page: 1, limit: 10, pages: 1 }}
									onPageChange={setPage}
									onLimitChange={setLimit}
								/>
							</>
						)}
					</div>
				)}


				{selectedTab === 'Data Points' && (
					<>
						<div className="mt-5">
							{creatingDataPoint ? (
								<button
									className="flex items-center bg-blue-600 text-white px-4 py-1 rounded-full cursor-pointer"
									onClick={() => setCreatingDataPoint(false)}
								>
									<List size={18} color="white" className="mr-1" />
									View Data Points
								</button>
							) : (
								<button
									className="flex items-center bg-blue-600 text-white px-4 py-1 rounded-full cursor-pointer"
									onClick={() => {
										setCreatingDataPoint(true);
									}}
								>
									<Plus size={18} color="white" className="mr-1" />
									New Data Point
								</button>
							)}
						</div>

						{creatingDataPoint ? (
							<NewDataPoint
								pipelines={pipelines ?? []}
							/>
						) : (
							<>
								{ isLoadingPipelines ? (
									<FlyWheelPageLoading/>
									
								): (
									<DataPoints
									data={datapoints ?? []}
									pagination={paginationPipelines ?? { page: 1, limit: 10, pages: 1 }}
									onPageChange={setPage}
									onLimitChange={setLimit}
								/>
								) }
								
							</>

						)}
					</>
				)}


			</div>

		</DashboardLayout>
	);
};

export default Flywheel;
