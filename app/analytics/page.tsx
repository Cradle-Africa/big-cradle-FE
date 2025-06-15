import AnalyticsCharts from "../components/charts/AnalyticsCharts";
import CampaignPerformance from "../components/analytics/CampaignPerformance";
import DataUploadMetrics from "../components/analytics/DataUploadMetrics";
import { Download, ListChecks, UsersRound, Wallet, AppWindow, CheckSquare, ClipboardList } from "lucide-react";
import Link from "next/link";
import DashboardLayout from "../DashboardLayout";

export default function AnalyticsPage() {
	return (
		<DashboardLayout>
			<div>
				<div className='flex justify-between items-center w-full'>
					<div>
						<p className='font-semibold text-md space-y-1'>Platform Analytics</p>
						<p className="text-sm">Real-time analytics on user engagement, task performance, feedback quality, and regional activity</p>
					</div>
					<div className='flex items-center gap-1 text-sm'>
						<Download size={13} />
						<Link href='' className="hover:text-gray-800">Export</Link>
					</div>
				</div>
				<div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-5">
					<div className="border border-[#F7F7F7] bg-[#fafafa] p-2 md:p-4 rounded-md">
						<h3 className="flex gap-1 items-center text-sm mb-2">
							<UsersRound size={13} />	Active Users
						</h3>
						<div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
							<p>4,326</p>
							<div className=" text-[10px] text-[#0BAD2E] border border-[#0BAD2E] px-[1px] rounded">10.2%</div>
						</div>
						<p className="text-xs">Total users who logged in during the selected period.</p>
					</div>

					<div className="border border-[#F7F7F7] bg-[#fafafa] p-2 md:p-4 rounded-md text-gray-700">
						<h3 className="flex gap-1 items-center text-sm mb-2">
							<ClipboardList size={13} />
							Surveys Created
						</h3>
						<div className="flex items-center gap-2 text-lg font-semibold">
							<p>612</p>
							<div className=" text-[10px] text-[#0BAD2E] border border-[#0BAD2E] px-[1px] rounded">10.2%</div>

						</div>
						<p className="text-xs">New feedback tasks launched by organisations </p>
					</div>

					<div className="border border-[#F7F7F7] bg-[#fafafa] p-2 md:p-4 rounded-md text-gray-700">
						<h3 className="flex gap-1 items-center text-sm mb-2">
							<ListChecks size={13} />
							Data Uploads
						</h3>
						<div className="flex items-center gap-2 text-lg font-semibold">
							<p>3m 42s</p>
							<div className=" text-[10px] text-[#0BAD2E] border border-[#0BAD2E] px-[1px] rounded">10.2%</div>
						</div>
						<p className="text-xs">Across mobile & QR responses</p>
					</div>

					<div className="border border-[#F7F7F7] bg-[#fafafa] p-2 md:p-4 rounded-md text-gray-700">
						<h3 className="flex gap-1 items-center text-sm mb-2">
							<CheckSquare size={13} />
							Average Task Completion Time
						</h3>
						<div className="flex items-center gap-2 text-lg font-semibold">
							<p>3m 47s</p>
							<div className=" text-[10px] text-[#0BAD2E] border border-[#0BAD2E] px-[1px] rounded">10.2%</div>
						</div>
						<p className="text-xs">Time users spend completing a typical task</p>
					</div>

					<div className="border border-[#F7F7F7] bg-[#fafafa] p-2 md:p-4 rounded-md text-gray-700">
						<h3 className="flex gap-1 items-center text-sm mb-2">
							<AppWindow size={13} />
							Platform Uptime
						</h3>
						<div className="flex items-center gap-2 text-lg font-semibold">
							<p>99.92%</p>
							<div className=" text-[10px] text-[#0BAD2E] border border-[#0BAD2E] px-[1px] rounded">10.2%</div>
						</div>
						<p className="text-xs">System reliability across all services</p>
					</div>

					<div className="border border-[#F7F7F7] bg-[#fafafa] p-2 md:p-4 rounded-md text-gray-700">
						<h3 className="flex gap-1 items-center text-sm mb-2">
							<Wallet size={13} />	Wallet Payouts
						</h3>
						<div className="flex items-center gap-2 text-lg font-semibold">
							<p>₦1,235,000</p>
							<div className=" text-[10px] text-[#0BAD2E] border border-[#0BAD2E] px-[1px] rounded">10.2%</div>
						</div>
						<p className="text-xs">Total rewards disbursed to contributors</p>
					</div>
				</div>

				<DataUploadMetrics />

				<AnalyticsCharts />

				<CampaignPerformance />
			</div>
		</DashboardLayout>
	);
}
