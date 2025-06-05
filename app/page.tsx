import DashboardCharts from "./components/charts/DashboardCharts";
import UserRoleTable from "./components/dashboard/UserRoleTable";
import { UsersRound, CheckSquare, Banknote } from "lucide-react";
import DashboardLayout from "./components/layouts/DashboardLayout";

export default function Home() {
	return (
		<DashboardLayout>
			<div>

				<div className='w-full'>
					<p className='font-semibold text-md space-y-1'>Hi Esther, here’s your platform overview for today</p>
					<p className="text-sm">All systems operational. Last sync: 10 mins ago</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
					<div className="border border-[#F7F7F7] bg-[#fafafa] p-4 rounded-md">
					<h3 className="flex gap-1 items-center text-sm mb-2">
						<UsersRound size={13}/>	
						Total Users</h3>
					<div className="flex items-center gap-2 text-xl font-semibold text-gray-700">
						<p>1,2340</p>
						<div className=" text-[10px] text-[#0BAD2E] border border-[#0BAD2E] px-[1px] rounded">10.2%</div>

					</div>
					<p className="text-xs">Registered accross all roles</p>
				</div>

				<div className="border border-[#F7F7F7] bg-[#fafafa] p-4 rounded-md text-gray-700">
					<h3 className="flex gap-1 items-center text-sm mb-2">
						<Banknote size={13}/> Revenue (This Month)
					</h3>
					<div className="flex items-center gap-2 text-xl font-semibold">
						<p>₦1,845,200</p>
						<div className=" text-[10px] text-[#0BAD2E] border border-[#0BAD2E] px-[1px] rounded">10.2%</div>

					</div>
					<p className="text-xs">Total from active campaigns</p>
				</div>

				<div className="border border-[#F7F7F7] bg-[#fafafa] p-4 rounded-md text-gray-700">
					<h3 className="flex gap-1 items-center text-sm mb-2">
						<CheckSquare size={13}/> Avg. Task Completion Time
					</h3>
					<div className="flex items-center gap-2 text-xl font-semibold">
						<p>3m 42s</p>
						<div className=" text-[10px] text-[#0BAD2E] border border-[#0BAD2E] px-[1px] rounded">10.2%</div>

					</div>
					<p className="text-xs">Across mobile & QR responses</p>
				</div>
			</div>

			<DashboardCharts/>
			
			<UserRoleTable/>
		</div>

		</DashboardLayout>


	);
}
