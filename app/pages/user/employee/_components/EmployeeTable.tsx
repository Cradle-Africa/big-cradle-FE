import { Check, MoreVertical, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import EmployeeStatus from "./EmployeeStatus";
import { Employee } from "@/app/lib/type";

interface Props {
	employeeData: Employee[];
}

const EmployeeTable = ({ employeeData }: Props) => {
	const menuRef = useRef<HTMLUListElement>(null);
	const [openIndex, setOpenIndex] = useState<number | null>(null);
	const [suspendOpen, setSuspendOpen] = useState(false);
	const [activateOpen, setActivateOpen] = useState(false);

	const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
	const [uniqueId, setUniqueId] = useState<string>("");

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
				<table className="min-w-[72%] md:w-full table-auto divide-y divide-gray-200 rounded-[8px] bg-white">
					<thead className="bg-gray-50">
						<tr>
							{["#", "First Name", "Last Name", "Email", "Invitation Status", "Status", "Actions"].map((header) => (
								<th key={header} className="px-6 py-3 text-left text-sm font-semibold">{header}</th>
							))}
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-100 text-sm">
						{employeeData.map((employee, index) => (
							<tr key={employee.id || index}>
								<td className="px-6 py-4 font-medium">{index + 1}</td>
								<td className="px-6 py-4 font-medium">{employee.firstName}</td>
								<td className="px-6 py-4 font-medium">{employee.lastName}</td>
								<td className="px-6 py-4 font-medium">{employee.email}</td>
								<td className="px-6 py-4 font-medium text-center">
									<div className={` ${employee.invitationStatus === 'pending' ? 'border border-red-600 text-red-600' :
										'border border-green-600 text-green-600'} w-34 rounded-full py-1 px-5 capitalize`}>
										{employee.invitationStatus}
									</div>
								</td>
								<td className="px-6 py-4 font-medium text-center">
									<div className={` ${!employee.isActive ? 'border border-red-600 text-red-600' :
										'border border-green-600 text-green-600'} w-34 rounded-full py-1 px-5 capitalize`}>
										{employee.isActive ? 'Active' : 'Suspended'}
									</div>
								</td>
								<td className="px-6 py-4 relative">
									<button
										className="bg-gray-100 rounded-lg px-2 py-1 hover:bg-blue-600 hover:text-white hover:cursor-pointer"
										onClick={() => setOpenIndex(openIndex === index ? null : index)}
									>
										<MoreVertical size={18} />
									</button>

									{openIndex === index && (
										<ul
											ref={menuRef}
											className="absolute z-60 right-10 py-1 mt-2 w-auto bg-white rounded-md shadow-md border border-gray-100"
										>
											{employee.isActive && (
												<li className="px-2 py-2">
													<button
														onClick={() => {
															setUniqueId(employee.id);
															setSelectedEmployee(employee);
															setSuspendOpen(true);
														}}
														className="flex items-center w-full px-4 py-2 text-left text-sm rounded-md text-red-700 hover:bg-blue-200 hover:cursor-pointer"
													>
														<X size={13} className="mr-1" />
														Suspend
													</button>
												</li>
											)}

											{!employee.isActive && (
												<li className="px-2 py-2">
													<button
														onClick={() => {
															setUniqueId(employee.id);
															setSelectedEmployee(employee);
															setActivateOpen(true);
														}}
														className="flex items-center w-full px-4 py-2 text-left text-sm rounded-md text-blue-800 hover:bg-blue-200 hover:cursor-pointer"
													>
														<Check size={13} className="mr-1" />
														Activate
													</button>
												</li>
											)}

										</ul>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{suspendOpen && selectedEmployee && (
				<EmployeeStatus
					uniqueId={uniqueId}
					suspend={true}
					activate={false}
					employee={selectedEmployee}
					setOpen={setSuspendOpen}
				/>
			)}

			{activateOpen && selectedEmployee && (
				<EmployeeStatus
					uniqueId={uniqueId}
					suspend={false}
					activate={true}
					employee={selectedEmployee}
					setOpen={setActivateOpen}
				/>
			)}
		</>
	);
};

export default EmployeeTable
