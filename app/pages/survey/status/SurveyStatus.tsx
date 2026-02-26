import axios, { INTERNAL_URL } from '@/app/lib/axios';
import { useQueryClient } from '@tanstack/react-query';
import { Banknote, Check, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useActivateSurvey, useFlutterwavePaymentMethods, useSurveyPay, useSuspendSurvey } from '../_features/hooks';
import { Spinner } from '@radix-ui/themes';
import { FlutterwavePaymentMethod, InitializePaymentPayload, PaymentProvider, SurveyListItem } from '@/app/lib/type';
import { getUser } from '@/app/utils/user/userData';
import FlutterwaveCountrySelect from '@/app/components/FlutterwaveCountrySelect';
import { useKuvarPay } from '@/app/hooks/useKuvarPay';


interface Props {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    uniqueId: string;
    activate: boolean;
    suspend: boolean;
    survey: SurveyListItem;
    completePayment?: boolean
}

const SurveyStatus: React.FC<Props> = ({ setOpen, uniqueId, survey, activate, suspend, completePayment }) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();
    const user = getUser();
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('flutterwave');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<{ code: string; currency: string } | null>(null);

    const {
        mutateAsync: activateSurvey,
        isSuccess: isSucessActivate,
        isPending: isPendingActivate
    } = useActivateSurvey({ axios });

    // Get Flutterwave payment methods
    const { data: paymentMethodsData, isLoading: isLoadingPaymentMethods } = useFlutterwavePaymentMethods(
        selectedCountry,
        Boolean(selectedCountry)
    );

    //activate a survey
    const onSubmitActivate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await activateSurvey({ id: uniqueId });
        } catch (error: any) {
            toast.error(error?.message || 'Failed to activate a survey');
        }
    };

    //suspend a survey
    const {
        mutateAsync: suspendSurvey,
        isSuccess: isSucessSuspend,
        isPending: isPendingSuspend
    } = useSuspendSurvey({ axios });


    const onSubmitSuspend = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await suspendSurvey({ id: uniqueId });
        } catch (error: any) {
            toast.error(error?.message || 'Failed to suspend a survey');
        }
    };

    const { mutateAsync: makePayment, isPending: isMakingPayment } = useSurveyPay(
        { axios }
    );
    const { openPayment: openKuvarPayModal } = useKuvarPay();

    const submitSurveyPayment = async (payload: InitializePaymentPayload) => {
        try {
            toast.loading('Initializing payment ...');
            await makePayment(payload, {
                onSuccess: (result) => {
                    toast.dismiss();
                    toast.success("Survey payment initialized");
                    if (payload.provider === 'kuvarpay' && result.sessionId) {
                        openKuvarPayModal(result.sessionId, {
                            onSuccess: () => {
                                window.location.href = `${INTERNAL_URL}/pages/survey/payment-made?tx_ref=${payload.reference}&provider=kuvarpay`;
                            },
                            onCancel: () => toast.error('Payment cancelled'),
                            onError: () => toast.error('Payment failed'),
                        });
                    } else if (result.paymentUrl) {
                        window.location.href = result.paymentUrl;
                    }
                },
            });
        } finally {
            toast.dismiss();
        }
    };

    useEffect(() => {
        if (isSucessActivate) {
            queryClient.invalidateQueries({ queryKey: ['surveys'] });
            toast.success(`Survey Activated successfully`);
            setOpen(false);
        }

        if (isSucessSuspend) {
            queryClient.invalidateQueries({ queryKey: ['surveys'] });
            toast.success(`Survey Suspended successfully`);
            setOpen(false);
        }

        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isSucessActivate, isMakingPayment, isSucessSuspend, queryClient, setOpen]);


    return (

        <div>
            <div className="fixed inset-0 bg-[#0000004D] bg-opacity-30 z-40"></div>

            <div
                ref={menuRef}
                className="bg-white p-6 rounded-md shadow-md w-82 md:w-full max-w-xl z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
                <div className="flex justify-center mt-5">
                    {
                        activate && (
                            <div className='bg-blue-100 rounded-full px-3 py-3'>
                                <Check size={15} className="text-blue-600" />
                            </div>
                        )
                    }
                    {
                        suspend && (
                            <div className='bg-red-100 rounded-full px-3 py-3'>
                                <X size={15} className="text-red-500" />
                            </div>
                        )
                    }

                    {
                        completePayment && (
                            <div className='bg-green-100 rounded-full px-3 py-3'>
                                <Banknote size={15} className="text-green-500" />
                            </div>
                        )
                    }
                </div>
                {activate && (
                    <div className="items-center text-center mt-5">
                        <h2 className="text-md font-semibold text-black mb-4">Activate {survey.surveyName}</h2>
                        <p className="text-sm text-gray-500">Are you sure you want to activate this survey?</p>
                    </div>
                )}

                {suspend && (
                    <div className="items-center text-center mt-5">
                        <h2 className="text-md font-semibold text-black mb-4">Suspend {survey.surveyName}</h2>
                        <p className="text-sm text-gray-500">Are you sure you want to delete this survey?</p>
                    </div>
                )}

                {completePayment && (
                    <div className="items-center text-center mt-5">
                        <h2 className="text-md font-semibold text-black mb-4">Complete the payment of the survey: {survey.surveyName}</h2>
                        <p className="text-sm text-gray-500 mb-5">Select the country and click on continue to complete your survey payment?</p>

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

                                    {isLoadingPaymentMethods && <Spinner className='inline mr-1' />}

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
                        if (activate) return onSubmitActivate(e);
                        if (suspend) return onSubmitSuspend(e);

                        if (completePayment) {
                            if (selectedProvider === 'flutterwave' && !selectedPaymentMethod) {
                                toast.error("Please select a payment method");
                                return;
                            }

                            submitSurveyPayment({
                                reference: survey.tx_ref,
                                amount: survey?.amount,
                                currency: selectedProvider === 'kuvarpay' ? 'NGN' : selectedPaymentMethod!.currency,
                                redirectUrl: `${INTERNAL_URL}/pages/survey/payment-made?tx_ref=${survey.tx_ref}`,
                                customerEmail: user?.email || '',
                                customerName: (user as { fullName?: string })?.fullName
                                    || ((user as { contactPersonFirstName?: string; contactPersonLastName?: string })?.contactPersonFirstName
                                        ? `${(user as any).contactPersonFirstName} ${(user as any).contactPersonLastName ?? ''}`.trim()
                                        : undefined),
                                title: 'Survey Budget',
                                description: 'Budget allocated to the survey ' + survey?.surveyName,
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

                        {activate && (
                            <button
                                type="submit"
                                disabled={isPendingActivate}
                                className="flex justify-center items-center w-1/2 py-2 rounded-md text-white bg-blue-600 hover:cursor-pointer"
                            >
                                {isPendingActivate ? (
                                    <Spinner className='mr-1 inline' />
                                ) : (
                                    <> <Check size={14} className='mr-1 inline' /> </>
                                )}
                                {(isPendingActivate) ? 'Activating...' : 'Activate'}
                            </button>
                        )}

                        {suspend && (
                            <button
                                type="submit"
                                disabled={isPendingSuspend}
                                className="flex justify-center items-center w-1/2 py-2 rounded-md text-white bg-red-600 hover:cursor-pointer"
                            >
                                {isPendingSuspend ? (
                                    <Spinner className='mr-1 inline' />
                                ) : (
                                    <> <Check size={14} className='mr-1 inline' /> </>
                                )}
                                {isPendingSuspend ? 'Suspending...' : 'Suspend'}
                            </button>
                        )}

                        {completePayment && (
                            <>
                                <button
                                    type="submit"
                                    disabled={isPendingSuspend}
                                    className="flex justify-center items-center w-1/2 py-2 rounded-md text-white bg-blue-600 hover:cursor-pointer"
                                >
                                    {isPendingSuspend ? (
                                        <Spinner className='mr-1 inline' />
                                    ) : (
                                        <> <Check size={14} className='mr-1 inline' /> </>
                                    )}
                                    {isPendingSuspend ? 'Prcessing...' : 'Continue'}
                                </button>
                            </>

                        )}

                    </div>
                </form>
            </div>
        </div >
    );
};

export default SurveyStatus;
