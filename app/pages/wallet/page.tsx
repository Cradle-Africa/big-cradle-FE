'use client';

import DashboardLayout from '@/app/DashboardLayout';
import React, { useEffect, useRef, useState } from 'react';
import { GoChecklist } from 'react-icons/go';
import TransactionsTable from './components/TransactionsTable';
import { Check, Wallet } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCreateWallet, useFetchWallet, useFetchWalletTransactions } from './_features/hook';
import axios from '@/app/lib/axios';
import { getUser } from '@/app/utils/user/userData';
import { Spinner } from '@radix-ui/themes';
import NewTransaction from './components/NewTransaction';

const Page = () => {
	const [user, setUser] = useState<any>(null);
	const [userType] = useState<string>('business');
	const [openTransaction, setOpenTransaction] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Ensure this only runs on the client
		const userData = getUser();
		setUser(userData);
	}, []);

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setOpenTransaction(false);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, [setOpenTransaction]);

	const {
		data: wallet,
		isLoading: isLoadingWallet,
		refetch: refetchWallet,
	} = useFetchWallet({
		axios,
		userId: user?.id || '',
		enabled: !!user, // Only fetch after user is available
	});

	const mutation = useCreateWallet({ axios });

	const userId = user?.id;

	const { data: transactionsData, isLoading, isError } = useFetchWalletTransactions({
		axios,
		queryParams: { userId },
		enabled: !!userId, // fetch only when userId is available
	});


	if (isLoading) return <div>
		<DashboardLayout>
			<Spinner />
		</DashboardLayout>
	</div>;
	if (isError) return <div>
		<DashboardLayout>
			Failed to fetch transactions.
		</DashboardLayout>
	</div>;


	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!user?.id) return;

		mutation.mutate(
			{
				userId: user.id,
				userType,
				balance: 0,
				lockedBalance: 0,
			},
			{
				onSuccess: () => {
					toast.success('Wallet created successfully!');
					refetchWallet();
				},
				onError: (err) => {
					toast.error('Failed to create wallet');
					console.error(err);
				},
			}
		);
	};

	return (
		<DashboardLayout>
			{!user || isLoadingWallet && (
				<div className="flex justify-center items-center min-h-screen">
					<Spinner />
				</div>
			)}

			{(!user && !isLoadingWallet  && !wallet) && (
				<div className="flex flex-col h-150 w-full m-auto justify-center text-center items-center">
					<Wallet size={65} className="text-[#2694F6]" />
					<p className="text-gray-700 mt-2">No wallet</p>
					<p className="text-gray-700 mb-4">You currently do not have a wallet, create one now</p>
					<form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
						<button
							type="submit"
							disabled={mutation.isPending}
							className="flex justify-center gap-1 items-center bg-[#2694F6] text-white rounded-md px-5 py-2 mt-5 hover:bg-[#2695f6df]"
						>
							{mutation.isPending ? (
								<>
									<Spinner className="inline mr-1" />
									Creating wallet
								</>
							) : (
								<>
									<Check size={15} className="inline mr-1" />
									Create wallet
								</>
							)}
						</button>
					</form>
				</div>
			)
			}

			{
				wallet && (
					<div className="w-full">
						<h2 className="font-bold text-lg text-black mb-4">Wallet</h2>
						<p>
							View and manage all financial activities across the BigCradle ecosystem including partner payouts, organisation plans, and platform-wide transactions.
						</p>

						<div className="w-full bg-[#2694F6] text-white rounded-lg mt-5 px-8 py-5">
							<h3 className="flex items-center gap-1 justify-start">
								<GoChecklist />
								Total Wallet
							</h3>
							<div className="flex justify-between items-center mt-5">
								<p className="font-bold text-2xl">{wallet?.balance}</p>
								<button
									className="bg-white text-[#2694F6] px-4 py-2 rounded-md font-medium hover:bg-gray-100 hover:cursor-pointer"
									onClick={() => setOpenTransaction(true)}
								>
									+ Add to Wallet
								</button>
							</div>
						</div>

						<div className="mt-10">
							<h3 className='font-semibold'>Transactions history</h3>
							<TransactionsTable
								transactionsData={transactionsData?.data}
							/>
						</div>
					</div>
				)
			}

			{openTransaction && <NewTransaction wallet={wallet} setOpenTransaction={setOpenTransaction} />}

		</DashboardLayout >
	);
};

export default Page;
