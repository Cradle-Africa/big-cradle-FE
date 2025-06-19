'use client';
import DashboardLayout from "@/app/DashboardLayout";
import { List, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import DataPoints from "./_components/DataPoints";
import FlywheelTabs from "./_components/FlywheelTabs";
import NewDataPoint from "./_components/NewDataPoint";
import NewPipeLine from "./_components/NewPipeline";
import Overview from "./_components/Overview";
import Pipeline from "./_components/Pipeline";
import axios from "@/app/lib/axios"
import PopUp from "./_components/Popup";
import FlyWheelPageLoading from "./loading";
import { useFetchDataTypes } from "./_features/hook";

const Flywheel = () => {
	const [open, setOpen] = useState(false)
	const menuRef = useRef<HTMLDivElement>(null);
	const tabs = ["Overview", "Data Points", "Pipelines"];
	const [selectedTab, setSelectedTab] = useState<string>(tabs[0]);
	const [newPipeLine, setNewPipeline] = useState(false)
	const [openNewDataPoint, setOpenNewDataPoint] = useState(false)

	const { isLoading, data: dataTypes } = useFetchDataTypes({
		axios,
		queryParams: {
			page: 1,
			limit: 10
		}
	})

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener('mousedown', handler);

		return () => document.removeEventListener('mousedown', handler);
	}, [setOpen]);

	if(isLoading) return <FlyWheelPageLoading/>

	return (
		<DashboardLayout>

			<PopUp
				openPopup={open}
				onClose={() => setOpen(false)}
				onBuildPipeline={() => setNewPipeline(true)}
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
					<Overview />
				)}

				{selectedTab === 'Data Points' && (
					<div className="mt-5">
						{openNewDataPoint ? (
							<button
								className="flex items-center bg-blue-600 text-white px-4 py-1 rounded-full cursor-pointer"
								onClick={() => setOpenNewDataPoint(false)}
							>
								<List size={18} color="white" className="mr-1" />
								Data Points
							</button>
						) : (
							<button
								className="flex items-center bg-blue-600 text-white px-4 py-1 rounded-full cursor-pointer"
								onClick={() => setOpenNewDataPoint(true)}
							>
								<Plus size={18} color="white" className="mr-1" />
								New Data Point
							</button>
						)}
						{openNewDataPoint ? (
							<NewDataPoint />
						) : (
							<DataPoints data={dataTypes ?? []} />
						)}
					</div>
				)}

				{selectedTab === 'Pipelines' && (
					<>
						<div className="mt-5">
							{newPipeLine ? (
								<button
									className="flex items-center bg-blue-600 text-white px-4 py-1 rounded-full cursor-pointer"
									onClick={() => setNewPipeline(false)}
								>
									<List size={18} color="white" className="mr-1" />
									Pipeline
								</button>
							) :
								(
									<button
										className="flex items-center bg-blue-600 text-white px-4 py-1 rounded-full cursor-pointer"
										onClick={() => setOpen(true)}
									>
										<Plus size={18} color="white" className="mr-1" />
										Build a new Pipeline
									</button>
								)
							}

						</div>

						{newPipeLine ? (
							<NewPipeLine />
						) : (
							<Pipeline />
						)}
					</>
				)}

			</div>

		</DashboardLayout>
	);
};

export default Flywheel;
