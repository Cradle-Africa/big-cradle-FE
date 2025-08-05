'use client';

import DashboardLayout from '@/app/DashboardLayout';
import React, { useEffect, useState } from 'react';
import { GoChecklist } from 'react-icons/go';
import TransactionsTable from './components/TransactionsTable';
import { Check, Wallet } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCreateWallet, useFetchWallet } from './_features/hook';
import axios from '@/app/lib/axios';
import { getUser } from '@/app/utils/user/userData';
import { Spinner } from '@radix-ui/themes';

const Page = () => {
	const [user, setUser] = useState<any>(null);
	const [userType] = useState<string>('business');

	useEffect(() => {
		// Ensure this only runs on the client
		const userData = getUser();
		setUser(userData);
	}, []);

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

			{ !wallet && (
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
							<p className="font-bold text-2xl mt-5">{wallet?.balance}</p>
						</div>

						<div className="mt-10">
							Transactions history
							<TransactionsTable />
						</div>
					</div>
				)
			}
		</DashboardLayout >
	);
};

export default Page;
