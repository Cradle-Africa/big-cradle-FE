import { Admin } from "@/app/lib/type";

const AdminTable = ({ data }: { data: Admin[] }) => {

	return (
		<>
			<div className="overflow-x-auto  pb-14 rounded-[8px] border border-gray-200">
				<table className="min-w-[75%] md:w-full table-auto divide-y divide-gray-200 rounded-[8px]">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">#</th>
							<th className={`px-6 py-3 text-left text-sm font-semibold whitespace-nowrap` }>User</th>
							<th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">User type</th>
							<th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">Email</th>
							<th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">Country</th>
							<th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">City</th>
							<th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">State</th>
							<th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">Address</th>
							<th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">KYC Status</th>
							<th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">Status</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-700">
						{data.map((admin, index) => (
							<tr key={index} className="hover:bg-gray-50">
								<td className="px-6 py-4 font-medium">{index + 1}</td>
								<td className="px-6 py-4 font-medium">
									{admin.firstName } {admin.lastName}
									<br />
									{admin.businessName}  {admin.fullName}
								</td>
								<td className="px-6 py-6 font-medium">
									<span 
										className={`flex wrap-normal w-[140px] justify-center
                  						${admin?.userType === 'individual' ? 'border border-blue-500 text-blue-600' : 
										'border border-orange-500 text-orange-600'} 
                  						px-3 lg:px-5 py-1 rounded-full`
										}>
										{admin.userType}
									</span>
								</td>
								<td className="px-6 py-4 font-medium">{admin.email}</td>
								<td className="px-6 py-4">{admin.country}</td>
								<td className="px-6 py-4">{admin.city}</td>
								<td className="px-6 py-4">{admin.state}</td>
								<td className="px-6 py-4">{admin.address}</td>
								<td className="px-6 py-4">
									<span 
										className={`flex wrap-normal w-[140px] justify-center
                  						${admin?.kycStatus === 'approved' ? 'border border-green-500 text-green-600' : 
										'border border-red-500 text-red-600'} 
                  						px-3 lg:px-5 py-1 rounded-full`
										}>
										{admin.kycStatus}
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	);
};

export default AdminTable;
