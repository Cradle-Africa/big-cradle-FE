
import UserManagementComponent from "@/app/components/user-management/UserManagementComponent";
import AccessLogsComponent from "@/app/components/user-management/AccessLogsComponent";
import RoleComponent from "@/app/components/user-management/RoleComponent";

import { Download, UsersRound } from "lucide-react";
import Link from "next/link";
import DashboardLayout from "../../components/layouts/DashboardLayout";

export default function Analytics() {
	return (
		<DashboardLayout>
			<div>
				<div className='lg:flex justify-between items-center w-full'>
					<div>
						<p className='font-semibold text-md space-y-1'>User Management & Access Control</p>
						<p className="text-sm">View and manage every user in the system, their roles, permissions, login activity, and security status.</p>
					</div>
					<div className='flex items-center gap-1 md:mt-0 mt-3 text-sm'>
						<Download size={13} />
						<Link href='' className="hover:text-gray-800">Export</Link>
					</div>
				</div>
				<div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-5">
					<div className="border border-[#F7F7F7] bg-[#fafafa] p-4 rounded-md">
						<h3 className="flex gap-1 items-center text-sm mb-2">
							<UsersRound size={13} /> Super admins
						</h3>
						<div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
							<p>4,326</p>
						</div>
						<p className="text-xs">Registred accross all roles.</p>
					</div>

					<div className="border border-[#F7F7F7] bg-[#fafafa] p-4 rounded-md text-gray-700">
						<h3 className="flex gap-1 items-center text-sm mb-2">
							<UsersRound size={13} />
							Researchers<span className="hidden md:inline">/ Contributors</span>
						</h3>
						<div className="flex items-center gap-2 text-lg font-semibold">
							<p>200</p>
						</div>
						<p className="text-xs">Total from active campaigns</p>
					</div>

					<div className="border border-[#F7F7F7] bg-[#fafafa] p-4 rounded-md text-gray-700">
						<h3 className="flex gap-1 items-center text-sm mb-2">
							<UsersRound size={13} />
							Suspended Users
						</h3>
						<div className="flex items-center gap-2 text-lg font-semibold">
							<p>12</p>
						</div>
						<p className="text-xs">Across mobile & QR responses</p>
					</div>
				</div>

				<UserManagementComponent />

				<RoleComponent />

				<AccessLogsComponent />
			</div>
		</DashboardLayout>
	);
}
