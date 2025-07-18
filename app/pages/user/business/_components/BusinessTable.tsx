import { Business } from "@/app/lib/type";
import { Eye, MoreVertical, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import axios from "@/app/lib/axios";
import { useDeleteBusinesses } from "../_features/hook";
import Link from "next/link";

const BusinessTable = ({ data }: { data: Business[] }) => {
	const menuRef = useRef<HTMLUListElement>(null);
	const [openIndex, setOpenIndex] = useState<number | null>(null);
	const [openDelete, setOpenDelete] = useState(false);
	const [uniqueId, setUniqueId] = useState<string>('')

	const { mutate: deleteBusiness, isPending: deletePending } = useDeleteBusinesses(axios);

	// const { mutate: resetBusinessPassword, isPending: resetPasswordPending } = useBusinessesResetPassword(axios);


	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setOpenIndex(null);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	const handleDelete = (id: string) => {
		setOpenDelete(true)
		setUniqueId(id)
		setOpenIndex(null);
	};

	// const handleResetPassword = (id: string) => {
	//   resetBusinessPassword(id);
	//   setOpenIndex(null); 
	// };


	return (
		<>
			<div className="overflow-x-auto  pb-14 rounded-[8px] border border-gray-200">
				<table className="min-w-[75%] md:w-full table-auto divide-y divide-gray-200 rounded-[8px]">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">#</th>
							<th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">Business Name</th>
							<th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">Email</th>
							<th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">First Name</th>
							<th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">Last Name</th>
							<th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">Country</th>
							<th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">City</th>
							<th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">State</th>
							<th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">Address</th>
							<th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">Size</th>
							<th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">KYC Status</th>
							<th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">Status</th>
							<th className="px-6 py-3 text-left text-sm font-semibold whitespace-nowrap">Actions</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-700">
						{data.map((business, index) => (
							<tr key={index}>
								<td className="px-6 py-4 font-medium">{index + 1}</td>
								<td className="px-6 py-4 font-medium">{business.businessName}</td>
								<td className="px-6 py-4 font-medium">{business.email}</td>
								<td className="px-6 py-4">{business.contactPersonFirstName}</td>
								<td className="px-6 py-4">{business.contactPersonLastName}</td>
								<td className="px-6 py-4">{business.businessCountry}</td>
								<td className="px-6 py-4">{business.businessCity}</td>
								<td className="px-6 py-4">{business.businessState}</td>
								<td className="px-6 py-4">{business.businessAddress}</td>
								<td className="px-6 py-4">{business.organizationSize}</td>
								<td className="px-6 py-4">
									<span className={`
                  flex wrap-normal w-[140px] justify-center
                  ${business?.kycStatus === 'approved'
											? 'border border-green-500 text-green-600'
											: 'border border-red-500 text-red-600'} 
                  px-3 lg:px-5 py-1 rounded-full`}>
										{business.kycStatus}
									</span>
								</td>
								<td className="px-6 py-4">
									<span className={`
                  ${business?.isActive
											? 'border border-green-500 text-green-600'
											: 'border border-red-500 text-red-600'} 
                  px-3 lg:px-5 py-1 rounded-full`}>
										{business.isActive ? 'Active' : 'Inactive'}
									</span>
								</td>
								<td className="px-6 py-4 border-r border-gray-100 whitespace-nowrap relative">
									<button
										className="bg-gray-100 rounded-lg px-2 py-1 cursor-pointer hover:bg-blue-600 hover:text-white"
										onClick={() => setOpenIndex(openIndex === index ? null : index)}
									>
										<MoreVertical size={18} />
									</button>
									{openIndex === index && (
										<ul
											ref={menuRef}
											className="absolute right-10 py-1 mt-2 w-auto bg-white rounded-md shadow-md border border-gray-100 z-50"
										>

											<li className="px-1">
												<Link
													href={`/pages/survey/list?status=active&page=1&business=${business.id}`}
													className="flex w-full px-4 py-2 text-left text-sm rounded-md text-blue-700 hover:bg-blue-200 hover:cursor-pointer"
												>
													<div className="flex items-center gap-1">
														<Eye size={13} />
														View Business Surveys
													</div>
												</Link>
											</li>
											<li className="px-1">
												<button
													onClick={() => handleDelete(business.id)}
													className="flex w-full px-4 py-2 text-left text-sm rounded-md text-red-700 hover:bg-red-200 hover:cursor-pointer"
												>
													<div className="flex items-center gap-1">
														<Trash size={13} />
														{deletePending ? 'Deleting...' : 'Delete this business'}
													</div>
												</button>
											</li>

											{/* <li className="px-1">
                      <button
                        onClick={() => handleResetPassword(business.id)}
                        className="flex w-full px-4 py-2 text-left text-sm rounded-md text-red-700 hover:bg-red-200 hover:cursor-pointer"
                      >
                        <div className="flex items-center gap-1">
                          <LockKeyhole size={13} />
                          {resetPasswordPending ? 'Resetting the password...' : 'Reset Password'}
                        </div>
                      </button>
                    </li> */}
										</ul>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>


			{openDelete && (
				<div>
					<div className="fixed inset-0 bg-[#0000004D] bg-opacity-30 z-40"></div>
					<div
						className="bg-white p-6 rounded-md shadow-md w-82 md:w-full max-w-md z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
					>
						<div className="flex justify-center mt-5">
							<div className='bg-red-200 text-red-500 rounded-full px-2 py-2'>
								<Trash size={20} className="" />
							</div>
						</div>
						<div className="items-center text-center mt-5">
							<h2 className="text-md font-semibold text-gray-700 mb-4">Delete business</h2>
						</div>

						<div className="flex justify-between mt-8 gap-5">
							<button
								type="button"
								onClick={() => setOpenDelete(false)}
								className="w-full border border-gray-400 hover:cursor-pointer py-2 rounded-md hover:text-white hover:bg-blue-600"
							>
								Close
							</button>

							<button
								onClick={() => {
									deleteBusiness(uniqueId);
									setOpenDelete(false)
								}}
								className="flex w-full px-4 py-2 text-left text-sm rounded-md border border-red-500 text-red-700 hover:bg-red-200 hover:cursor-pointer"
							>
								<div className="flex items-center gap-1">
									<Trash size={13} />
									{deletePending ? 'Deleting...' : 'Delete this business'}
								</div>
							</button>
						</div>
					</div>
				</div>
			)}

		</>
	);
};

export default BusinessTable;
