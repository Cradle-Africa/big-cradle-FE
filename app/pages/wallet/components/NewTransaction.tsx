import ErrorMessage from '@/app/components/form/ErrorMessage';
import AmountInput from '@/app/components/form/AmountInput';
import PaymentProviderSelector from '@/app/components/PaymentProviderSelector';
import axios, { INTERNAL_URL } from '@/app/lib/axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Check, Wallet, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Spinner } from '@radix-ui/themes';
import { useCreateTransaction, useInitiateTransaction } from '../_features/hook';
import { CreateTransactionPayload, FlutterwavePaymentMethod, InitializePaymentPayload, PaymentProvider, TransactionSchema, WalletSuccessResponse } from '@/app/lib/type';
import { transactionSchema } from '@/app/lib/validationSchemas';
import { getUser } from '@/app/utils/user/userData';
import FlutterwaveCountrySelect from '@/app/components/FlutterwaveCountrySelect';
import { useKuvarPay } from '@/app/hooks/useKuvarPay';
import { useFlutterwavePaymentMethods } from '../../survey/_features/hooks';

interface Props {
	setOpenTransaction: React.Dispatch<React.SetStateAction<boolean>>;
	wallet?: WalletSuccessResponse;
}

const NewTransaction: React.FC<Props> = ({ setOpenTransaction, wallet }) => {
	const menuRef = useRef<HTMLDivElement>(null);
	const queryClient = useQueryClient();
	const user = getUser();
	const [selectedCountry, setSelectedCountry] = useState("");
	const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('flutterwave');
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<{ code: string; currency: string } | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<TransactionSchema>({
		resolver: zodResolver(transactionSchema),
	});

	// Create transaction mutation
	const {
		mutateAsync: createTransaction,
		isSuccess: isCreateSuccess,
	} = useCreateTransaction({ axios });

	// Get Flutterwave payment methods
	const { data: paymentMethodsData, isLoading: isLoadingPaymentMethods } = useFlutterwavePaymentMethods(
		selectedCountry,
		Boolean(selectedCountry)
	);

	const { mutateAsync: initiateTransaction } = useInitiateTransaction(
		{ axios }
	);
	const { openPayment: openKuvarPayModal } = useKuvarPay();

	const submitInitiateTransaction = async (payload: InitializePaymentPayload) => {
		try {
			toast.loading('Initializing payment ...');

			const result = await initiateTransaction(payload);

			toast.dismiss();
			toast.success("Payment initialized");

			if (payload.provider === 'kuvarpay' && result?.sessionId) {
				openKuvarPayModal(result.sessionId, {
					onSuccess: () => {
						window.location.href = `${INTERNAL_URL}/pages/wallet/payment-made?tx_ref=${payload.reference}`;
					},
					onCancel: () => toast.error('Payment cancelled'),
					onError: () => toast.error('Payment failed'),
				});
			} else {
				const paymentUrl = result?.paymentUrl ?? result?.link;
				if (paymentUrl) {
					window.location.href = paymentUrl;
				} else {
					toast.error("Redirect link not found.");
				}
			}
		} finally {
			toast.dismiss();
		}
	};


	const onSubmit = async (data: TransactionSchema) => {
		try {
			const createPayload: CreateTransactionPayload = {
				walletId: wallet?.data.id ?? '',
				type: 'credit',
				amount: Number(data.amount),
				description: data.description,
				provider: selectedProvider,
			};

			const response = await createTransaction(createPayload);

			const { tx_ref, amount } = response.data;

			const initPayload: InitializePaymentPayload = {
				reference: tx_ref,
				amount,
				currency: selectedProvider === 'kuvarpay' ? 'USDT' : (selectedPaymentMethod?.currency ?? ''),
				redirectUrl: `${INTERNAL_URL}/pages/wallet/payment-made?tx_ref=${tx_ref}`,
				customerEmail: user?.email || '',
				customerName: (user as { fullName?: string })?.fullName
					|| ((user as { contactPersonFirstName?: string; contactPersonLastName?: string })?.contactPersonFirstName
						? `${(user as any).contactPersonFirstName} ${(user as any).contactPersonLastName ?? ''}`.trim()
						: undefined),
				title: 'Credit wallet',
				description: data.description || '',
				provider: selectedProvider,
				country: selectedCountry || undefined,
			};

			if (selectedProvider === 'flutterwave' && !selectedPaymentMethod) {
				toast.error('Please select a payment method');
				return;
			}

			await submitInitiateTransaction(initPayload);
		} catch (error: any) {
			toast.error(error?.message || 'Failed to create transaction');
		}
	};


	useEffect(() => {
		if (isCreateSuccess) {
			queryClient.invalidateQueries({ queryKey: ["wallet-transactions"] });
			toast.success(`Transaction created successfully`);
			setOpenTransaction(false);
		}

		const handler = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setOpenTransaction(false);
			}
		};

		document.addEventListener('mousedown', handler);
		return () => document.removeEventListener('mousedown', handler);
	}, [isCreateSuccess, queryClient, setOpenTransaction]);

	return (
		<div>
			<div className="fixed inset-0 bg-[#0000004D] bg-opacity-30 z-40"></div>

			<div
				ref={menuRef}
				className="bg-white p-6 rounded-md shadow-md w-82 md:w-full max-w-2xl z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
			>
				<button
					onClick={() => setOpenTransaction(false)}
					className='flex w-full justify-end hover:cursor-pointer'
				>
					<X size={22} className='text-red-500' />
				</button>

				<div className="flex justify-center mt-5">
					<div className='bg-blue-100 rounded-full px-3 py-3'>
						<Wallet size={18} className="text-blue-600" />
					</div>
				</div>
				<div className="items-center text-center mt-5">
					<h2 className="text-md font-semibold text-black mb-4">Add to wallet</h2>
					<p>Fill in the details below to add to your wallet</p>
				</div>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="space-y-4 mt-5 lg:mt-12">
					<div>
						<AmountInput
							currency={selectedProvider === 'kuvarpay' ? 'USDT' : (selectedPaymentMethod?.currency ?? '')}
							register={register("amount")}
							placeholder="Amount"
						/>
						<ErrorMessage>{errors.amount?.message}</ErrorMessage>
					</div>

					<PaymentProviderSelector
						selected={selectedProvider}
						onChange={setSelectedProvider}
					/>

					{selectedProvider === 'flutterwave' && (
						<>
							<FlutterwaveCountrySelect
								value={selectedCountry}
								onChange={(value) => {
									setSelectedCountry(value);
								}}
							/>

							{ isLoadingPaymentMethods && <Spinner className='inline mr-1' />}

							{paymentMethodsData?.paymentMethods?.methods?.length ? (
								<ul className="mt-2 space-y-2">
									{paymentMethodsData.paymentMethods.methods.map((method: FlutterwavePaymentMethod) => (
										<li key={method.code} className="border border-gray-300 p-2 rounded">
											<label className="flex items-center gap-2 cursor-pointer">
												<input
													type="radio"
													name="paymentMethod"
													value={method.code}
													onChange={() =>
														setSelectedPaymentMethod({
															code: method.code,
															currency: paymentMethodsData?.paymentMethods.currency || "",
														})
													}
												/>
												{method.label} ({method.code})
											</label>
										</li>
									))}
								</ul>
							) : null}
						</>
					)}

					<div>
						<textarea
							{...register("description")}
							placeholder="Description"
							className="w-full border border-gray-300 rounded px-3 py-2 outline-none"
						/>
						<ErrorMessage>{errors.description?.message}</ErrorMessage>
					</div>

					<div className="flex justify-between mt-8 gap-5">
						<button
							type="button"
							onClick={() => setOpenTransaction(false)}
							className="w-full hover:cursor-pointer py-2 rounded-md bg-gray-100 hover:text-white hover:bg-blue-600"
						>
							Cancel
						</button>

						<button
							type="submit"
							disabled={isSubmitting}
							className="w-full flex justify-center items-center py-2 rounded-md text-white bg-blue-600 hover:cursor-pointer"
						>
							{isSubmitting ? (
								<Spinner className='inline mr-1' />
							) : (
								<Check size={14} className='mr-1 inline' />
							)}
							{isSubmitting ? "Adding..." : "Submit"}
						</button>
					</div>
				</form>
			</div>
		</div >
	);
};

export default NewTransaction;
