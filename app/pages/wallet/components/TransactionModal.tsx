import axios, { INTERNAL_URL } from '@/app/lib/axios';
import { useQueryClient } from '@tanstack/react-query';
import { Banknote, Check } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Spinner } from '@radix-ui/themes';
import { FlutterwavePaymentMethod, InitializePaymentPayload, PaymentProvider, WalletTransactionList } from '@/app/lib/type';
import { getUser } from '@/app/utils/user/userData';
import FlutterwaveCountrySelect from '@/app/components/FlutterwaveCountrySelect';
import { useKuvarPay } from '@/app/hooks/useKuvarPay';
import { useFlutterwavePaymentMethods } from '../../survey/_features/hooks';
import { useInitiateTransaction } from '../_features/hook';


interface Props {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    transaction: WalletTransactionList;
    completeTransaction?: boolean
}

const TransactionModal: React.FC<Props> = ({ setOpen, transaction, completeTransaction }) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();
    const user = getUser();
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('flutterwave');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<{ code: string; currency: string } | null>(null);

   
    // Get Flutterwave payment methods
    const { data: paymentMethodsData, isLoading: isLoadingPaymentMethods } = useFlutterwavePaymentMethods(
        selectedCountry,
        Boolean(selectedCountry)
    );

   // complete transaction
    const { mutateAsync: completePayment, isPending: isMakingPayment } = useInitiateTransaction(
        { axios }
    );
    const { openPayment: openKuvarPayModal } = useKuvarPay();

    const submitSurveyPayment = async (payload: InitializePaymentPayload) => {
        try {
            toast.loading('Initializing payment ...');
            await completePayment(payload, {
                onSuccess: (result) => {
                    toast.dismiss();
                    toast.success("Payment initialized successfully");
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
                        if (paymentUrl) window.location.href = paymentUrl;
                    }
                },
            });
        } finally {
            toast.dismiss();
        }
    };

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [queryClient, setOpen]);


    return (

        <div>
            <div className="fixed inset-0 bg-[#0000004D] bg-opacity-30 z-40"></div>

            <div
                ref={menuRef}
                className="bg-white p-6 rounded-md shadow-md w-82 md:w-full max-w-xl z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
                <div className="flex justify-center mt-5">
                   
                    {
                        completeTransaction && (
                            <div className='bg-green-100 rounded-full px-3 py-3'>
                                <Banknote size={15} className="text-green-500" />
                            </div>
                        )
                    }
                </div>

                {completeTransaction && (
                    <div className="items-center text-center mt-5">
                        <h2 className="text-md font-semibold text-black mb-4">Complete the transaction  {transaction.amount}</h2>
                        <p className="text-sm text-gray-500 mb-5">Select the country and select the payment method to complete your transaction</p>

                        <>
                            {/* Payment method selector */}
                            <div className="space-y-2 mb-4">
                                <label className="block text-sm font-medium text-gray-700">Payment method</label>
                                <div className="flex gap-4 flex-wrap">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="paymentProvider"
                                            value="flutterwave"
                                            checked={selectedProvider === 'flutterwave'}
                                            onChange={() => setSelectedProvider('flutterwave')}
                                        />
                                        <span>Card / Bank (Flutterwave)</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="paymentProvider"
                                            value="kuvarpay"
                                            checked={selectedProvider === 'kuvarpay'}
                                            onChange={() => setSelectedProvider('kuvarpay')}
                                        />
                                        <span>Crypto (KuvarPay)</span>
                                    </label>
                                </div>
                            </div>

                            {selectedProvider === 'flutterwave' && (
                                <>
                                    <FlutterwaveCountrySelect
                                        value={selectedCountry}
                                        onChange={(value) => {
                                            setSelectedCountry(value);
                                        }}
                                    />

                                    {isLoadingPaymentMethods && <Spinner className='mt-5 flex justify-center  mr-1' />}

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
                        </>
                    </div>
                )}

                <form
                    onSubmit={(e) => {
                        e.preventDefault();

                        if (completeTransaction) {
                            if (selectedProvider === 'flutterwave' && !selectedPaymentMethod) {
                                toast.error("Please select a payment method to proceed");
                                return;
                            }

                            submitSurveyPayment({
                                reference: transaction.tx_ref,
                                amount: transaction?.amount,
                                currency: selectedProvider === 'kuvarpay' ? 'NGN' : selectedPaymentMethod!.currency,
                                redirectUrl: `${INTERNAL_URL}/pages/wallet/payment-made?tx_ref=${transaction.tx_ref}`,
                                customerEmail: user?.email || '',
                                customerName: (user as { fullName?: string })?.fullName
                                    || ((user as { contactPersonFirstName?: string; contactPersonLastName?: string })?.contactPersonFirstName
                                        ? `${(user as any).contactPersonFirstName} ${(user as any).contactPersonLastName ?? ''}`.trim()
                                        : undefined),
                                title: 'Complete transaction',
                                description: 'complete transaction of ' + transaction?.amount,
                                provider: selectedProvider,
                                country: selectedCountry || undefined,
                            });
                        }

                    }}
                    className="space-y-4 mt-5 lg:mt-12"
                >

                    <div className="flex justify-between mt-8 gap-2">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="w-1/2 hover:cursor-pointer py-2 bg-gray-100 rounded-md hover:text-white hover:bg-blue-600"
                        >
                            Cancel
                        </button>

                        {completeTransaction && (
                            <>
                                <button
                                    type="submit"
                                    disabled={isMakingPayment}
                                    className="flex justify-center items-center w-1/2 py-2 rounded-md text-white bg-blue-600 hover:cursor-pointer"
                                >
                                    {isMakingPayment ? (
                                        <Spinner className='mr-1 inline' />
                                    ) : (
                                        <> <Check size={14} className='mr-1 inline' /> </>
                                    )}
                                    {isMakingPayment ? 'Prcessing...' : 'Continue'}
                                </button>
                            </>

                        )}

                    </div>
                </form>
            </div>
        </div >
    );
}

export default TransactionModal;
