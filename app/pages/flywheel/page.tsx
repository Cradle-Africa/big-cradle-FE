'use client';
import DashboardLayout from "@/app/DashboardLayout";
import { List, Plus } from "lucide-react";
import FlywheelTabs from "./_components/FlywheelTabs";
import { useEffect, useRef, useState } from "react";
import api_icon from '@/public/icons/api_icon.png'
import build_pipeline from '@/public/icons/build_pipeline.png'
import Image from 'next/image'
import DataPoint from "./_components/DataPoint";
import Overview from "./_components/Overview";
import Pipeline from "./_components/Pipeline";
import NewPipeLine from "./_components/NewPipeline"

const SurveyCard = () => {
	const [open, setOpen] = useState(false)
	const menuRef = useRef<HTMLDivElement>(null);
	const tabs = ["Overview", "Data Points", "Pipelines"];
	const [selectedTab, setSelectedTab] = useState<string>(tabs[0]);
	const [newPipeLine, setNewPipeline] = useState(false)

	useEffect(() => {

		const handler = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener('mousedown', handler);

		return () => document.removeEventListener('mousedown', handler);
	}, [setOpen]);

	return (
		<DashboardLayout>

			{open && (
				<>
					<div className="fixed inset-0 bg-black/40 z-40" />
					<div className="text-center bg-white px-5 py-5 md:px-8 md:py-8 rounded-lg w-82 md:w-full max-w-xl z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" ref={menuRef}>
						<h2 className="text-gray-800 text-lg font-normal">How would you like to collect your data?</h2>
						<p className="mt-5 text-gray-700">Choose an integration method or build your own feedback tool</p>
						<div className="flex justify-between gap-5 mt-10">
							<div className="w-1/2 px-6 py-6 bg-[#FCEBFF] rounded-lg cursor-pointer">
								<div className="flex justify-center">
									<Image alt="api icon" src={api_icon} width={40} height={40} />
								</div>
								<p className="mt-3 text-md text-gray-800">Connect via API</p>
								<p className="text-sm mt-3">Integrate with your existing apps, websites, or CRM</p>
							</div>

							<div className="w-1/2 px-6 py-6 bg-[#E6E9FF] rounded-lg cursor-pointer">
								<div className="flex justify-center">
									<Image alt="build icon" src={build_pipeline} width={40} height={40} />
								</div>
								<p className="mt-3 text-md text-gray-800">Build Custom Pipeline</p>
								<p className="text-sm mt-3">Use our form builder to create your own survey</p>
							</div>

						</div>
					</div>
				</>
			)}


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
					<DataPoint />
				)}

				{selectedTab === 'Pipelines' && (
					<>
						<div>

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
										onClick={() => setNewPipeline(true)}
									>
										<Plus size={18} color="white" className="mr-1" />
										New Pipeline
									</button>
								)
							}

						</div>

						{newPipeLine ? (
							<NewPipeLine />
						):(
							<Pipeline/>
						)}
					</>
				)}

			</div>

		</DashboardLayout>
	);
};

export default SurveyCard;
