// import { Department } from "@/app/lib/type";

const
	TransactionsTable = ({ transactionsData }: { transactionsData?: any }) => {
		
		
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
									Date
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold">
									Type
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold">
									Org / Partner
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold">
									Amount
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold">
									Status
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold">
									Method
								</th>
								<th className="px-6 py-3 text-left text-sm font-semibold">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-700">
							{/* Example row */}
							{/* {transactionsData.map((transaction: any, index: any) => ( */}
								<tr key={''}>
									<td className="px-6 py-4 font-medium">
										{/* {index + 1} */}
									</td>
									<td className="px-6 py-4 font-medium">
										{/* {transaction.departmentName} */}
									</td>
									<td className="px-6 py-4">
										{/* {transaction.departmentDescription} */}
									</td>
								</tr>
							{/* ))} */}
						</tbody>
					</table>
				</div >
			</>

		);
	};

export default TransactionsTable;
