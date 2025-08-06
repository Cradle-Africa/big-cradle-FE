'use client';

import DashboardLayout from '@/app/DashboardLayout';
import React, { useEffect, useRef, useState } from 'react';
import { GoChecklist } from 'react-icons/go';
import TransactionsTable from './components/TransactionsTable';
import { Check, Wallet } from 'lucide-react';
import toast from 'react-hot-toast';
import {
	useCreateWallet,
	useFetchWallet,
	useFetchWalletTransactions,
} from './_features/hook';
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
		const userData = getUser();
		setUser(userData);
	}, []);

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setOpenTransaction(false);
			}
		};
		document.addEventListener('mousedown', handler);
		return () => document.removeEventListener('mousedown', handler);
	}, []);

	const {
		data: wallet,
		isLoading: isLoadingWallet,
		refetch: refetchWallet,
		isError: isWalletError,
		error: walletError,
	} = useFetchWallet({
		axios,
		userId: user?.id || '',
		enabled: !!user,
	});

	const mutation = useCreateWallet({ axios });

	const {
		data: transactionsData,
		isLoading: isLoadingTransactions,
		isError: isTransactionsError
	} = useFetchWalletTransactions({
		axios,
		queryParams: { userId: user?.id },
		enabled: !!user?.id,
	});

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

	if (!user || isLoadingWallet || isLoadingTransactions) {
		return (
			<DashboardLayout>
				<div className="flex justify-center items-center min-h-screen">
					<Spinner />
				</div>
			</DashboardLayout>
		);
	}

	if (isTransactionsError) {
		return (
			<DashboardLayout>
				<div className="text-center text-red-600 mt-10">
					Failed to fetch transactions.
				</div>
			</DashboardLayout>
		);
	}

	if (isWalletError) {
		const errorMessage = walletError?.message || 'You currently do not have a wallet, create one now';

		return (
			<DashboardLayout>
				<div className="flex flex-col h-150 w-full m-auto justify-center text-center items-center">
					<Wallet size={65} className="text-[#2694F6]" />
					<p className="text-gray-700 mt-2">No wallet found</p>
					<p className="text-gray-700 mb-4">{errorMessage}</p>
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
			</DashboardLayout>
		);
	}

	return (
		<DashboardLayout>
			<div className="w-full">
				<h2 className="font-bold text-lg text-black mb-4">Wallet</h2>
				<p>
					View and manage all financial activities across the BigCradle ecosystem including
					partner payouts, organisation plans, and platform-wide transactions.
				</p>

				{wallet?.data && (
					<>
						<div className="w-full bg-[#2694F6] text-white rounded-lg mt-5 px-8 py-5">
							<h3 className="flex items-center gap-1 justify-start">
								<GoChecklist />
								Total Wallet
							</h3>
							<div className="flex justify-between items-center mt-5">
								<p className="font-bold text-2xl">{wallet.data.balance}</p>
								<button
									className="bg-white text-[#2694F6] px-4 py-2 rounded-md font-medium hover:bg-gray-100 hover:cursor-pointer"
									onClick={() => setOpenTransaction(true)}
								>
									+ Add to Wallet
								</button>
							</div>
						</div>

						<div className="mt-10">
							<h3 className="font-semibold">Transactions history</h3>
							<TransactionsTable transactionsData={transactionsData?.data} />
						</div>
					</>
				)}

				{openTransaction && wallet?.data && (
					<NewTransaction wallet={wallet} setOpenTransaction={setOpenTransaction} />
				)}
			</div>
		</DashboardLayout>
	);
};

export default Page;