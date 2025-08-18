import { Department } from "@/app/lib/type";
import { MoreVertical, Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import EditDepartment from "./EditDepartment";

const
	DepartmentTable = ({ departmentData }: { departmentData: Department[] }) => {
		const menuRef = useRef<HTMLUListElement>(null);
		const [openIndex, setOpenIndex] = useState<number | null>(null);
		const [editOpen, setEditOpen] = useState(false);
		const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
		const [uniqueId, setUniqueId] = useState<string>('');

		useEffect(() => {
			const handler = (e: MouseEvent) => {
				if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
					setOpenIndex(null);
				}
			};
			document.addEventListener("mousedown", handler);
			return () => document.removeEventListener("mousedown", handler);
		}, []);
		return (
			<>
				<div className="overflow-x-auto pb-10 rounded-[8px] border border-gray-200">
					<table className="min-w-[75%] md:w-full table-auto divide-y divide-gray-200 rounded-[8px] bg-white">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-sm font-semibold">
									#
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold">
									Department name
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold">
									Department Description
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-700">
							{/* Example row */}
							{departmentData.map((department, index) => (
								<tr key={index}>
									<td className="px-6 py-4 font-medium">
										{index + 1}
									</td>
									<td className="px-6 py-4 font-medium">
										{department.departmentName}
									</td>
									<td className="px-6 py-4">
										{department.departmentDescription &&
											(department.departmentDescription.length > 55
												? department.departmentDescription.slice(0, 55) + '...'
												: department.departmentDescription)}
									</td>
									<td className="px-6 py-4 mb-10 border-r border-gray-100 whitespace-nowrap relative">
										<button
											className="bg-gray-100 rounded-lg px-2 py-1 cursor-pointer hover:bg-blue-600 hover:text-white"
											onClick={() => setOpenIndex(openIndex === index ? null : index)}
										>
											<MoreVertical size={18} />
										</button>
										{openIndex === index && (
											<ul
												ref={menuRef}
												className="absolute z-60 right-10 py-1 mt-2 w-auto bg-white rounded-md shadow-md border border-gray-100"
											>
												<li className="px-2 py-2">
													<button
														onClick={() => {
															setUniqueId(department?.id ?? '')
															setSelectedDepartment(department);
															setEditOpen(true);
														}}
														className="flex w-full px-4 py-2 text-left text-sm rounded-md text-blue-700 hover:bg-blue-200 hover:cursor-pointer"
													>
														<div className="flex items-center gap-1">
															<Pencil size={13} />
															Edit
														</div>
													</button>
												</li>
											</ul>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div >

				{
					editOpen && selectedDepartment && (
						<EditDepartment uniqueId={uniqueId} department={selectedDepartment} setOpen={setEditOpen} />
					)
				}
			</>

		);
	};

export default DepartmentTable;
