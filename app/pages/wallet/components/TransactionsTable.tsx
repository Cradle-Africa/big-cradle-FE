'use client';

import { WalletTransactionList } from "@/app/lib/type";
import WalletActions from "./WalletActions";
import { useState } from "react";
import TransactionModal from "./TransactionModal";

type TransactionsTableProps = {
	transactionsData?: WalletTransactionList[];
};

const TransactionsTable = ({ transactionsData = [] }: TransactionsTableProps) => {

	const [openIndex, setOpenIndex] = useState<number | null>(null);
	const [selectedTransaction, setSelectedTransaction] = useState<WalletTransactionList | null>(null);
	const [completePayment, setCompletePayment] = useState(false)

	if (!transactionsData.length) {
		return <p className="text-gray-500">No transactions available.</p>;
	}

	return (
		<div className="overflow-x-auto rounded-[8px] border border-gray-200 mt-5">
			<table className="min-w-[75%] md:w-full table-auto divide-y divide-gray-200 rounded-[8px] bg-white">
				<thead className="bg-gray-50">
					<tr>
						<th className="px-6 py-3 text-left text-sm font-semibold">#</th>
						<th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
						<th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
						<th className="px-6 py-3 text-left text-sm font-semibold">Type and Description</th>
						<th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
						<th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
					</tr>
				</thead>
				<tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-700">
					{transactionsData.map((transaction, index) => {
						return (
							<tr key={transaction.id} className="hover:bg-gray-50">
								<td className="px-6 py-4 font-medium">{index + 1}</td>
								<td className="px-6 py-4 font-medium">
									{new Date(transaction.createdAt).toLocaleString()}
								</td>
								<td className="px-6 py-4 font-semibold">{transaction.amount.toFixed(2)}</td>
								<td className="px-6 py-4 ">
									<span className="block font-semibold mt-5 capitalize">{transaction.type}</span>
									{transaction.description &&
										(transaction.description.length > 55
											? transaction.description.slice(0, 55) + '...'
											: transaction.description)}
								</td>
								<td className="px-6 py-4 w-44">
									<span className={`${transaction.paymentStatus === 'paid' ? 'border border-green-600 text-green-600' :
										'border border-red-600 text-red-600'}
										rounded-full px-5 py-1 capitalize w-full text-center
									`
									}>
										{transaction.paymentStatus}
									</span>
								</td>

								<td className="px-6 py-6" >
									<WalletActions
										index={index}
										openIndex={openIndex}
										setOpenIndex={setOpenIndex}
										paymentStatus={transaction.paymentStatus}
										setSelectedTransaction={() => {
											setSelectedTransaction(transaction);
											setCompletePayment(true);
										}}
									/>
								</td>

							</tr>
						);
					})}
				</tbody>
			</table>

			{
				completePayment && selectedTransaction &&  (
					<TransactionModal
						transaction={selectedTransaction}
						setOpen={setCompletePayment}
						completeTransaction={true}
					/>
				)
			}
		</div>
	);
};

export default TransactionsTable;
