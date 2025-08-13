"use client";

import DashboardLayout from "@/app/DashboardLayout";
import axios from "@/app/lib/axios";
// import { formattedDate } from "@/app/utils/tools";
import { Verified, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { useVerifySurveyPayment } from "../_features/hooks";
import SurveyPageLoading from "../loading";

const PaymentMadePage = () => {
	const searchParams = useSearchParams();
	const txRef = searchParams.get("tx_ref");
	const status = searchParams.get("status");

	const {
		mutateAsync: verifyPayment,
		isPending: isVerifing,
		data: data,
		isSuccess: isVerifyPaymentSuccess,
	} = useVerifySurveyPayment({ axios, });

	const verifyPayementFunc = useCallback(async () => {
		try {
			await verifyPayment(txRef || "");
		} catch (error) {
			console.log(error);
		}
	}, [txRef, verifyPayment]);

	useEffect(() => {
		try {
			if (txRef) verifyPayementFunc();
		} catch (error: any) {
			toast.error(`${error.message}`);
		}
	}, [txRef, verifyPayementFunc]);

	useEffect(() => {
		if (isVerifyPaymentSuccess) {
			if (data.paymentStatus === "paid") {
				toast.success("Payment successful");
			} else {
				toast.error("Payments not paid");
			}
		}
	}, [
		txRef,
		data?.paymentStatus,
		isVerifyPaymentSuccess,
		verifyPayementFunc,
	]);

	if (isVerifing) return <SurveyPageLoading />;

	if (status === 'cancelled') {
		return (
			<DashboardLayout>
				<div className="bg-red-50 p-4 border border-red-200 rounded-md max-w-3xl mb-10 mx-auto">
					<div className="flex gap-4 items-center mb-8 mt-5">
						<div className="bg-red-300 rounded-full p-1">
							<X size={20} color="red" />
						</div>
						<p className="text-xl font-bold">Payment Cancelled</p>
					</div>
					<span className="text-red-600 border border-red-600 rounded-full py-1 px-5 capitalize mt-5">
						Payment Cancelled
					</span>
				</div>
			</DashboardLayout>
		)
	}

	return (
		<DashboardLayout>
			<div className="text-black">
				<div className="bg-white p-8 rounded-lg max-w-3xl mx-auto drop-shadow-2xl mt-10">
					<div className="bg-green-50 p-4 border border-green-400 rounded-md max-w-3xl mb-10 mx-auto">
						<div className="flex gap-4 items-center mb-8 mt-5">
							<div className="bg-green-300 rounded-full p-2">
								<Verified color="white" />
							</div>
							{data?.paymentStatus === "paid" && (
								<div className="text-green-600 border border-green-600 rounded-full py-1 px-5 capitalize">
									Payment Successful
								</div>
							)}
							{data?.paymentStatus === "not-paid" && (
								<div className="text-red-600 border border-red-600 rounded-full py-1 px-5 capitalize">
									Payment Failed
								</div>
							)}
						</div>


					</div>

					<PaymentItem label="Reference" value={data?.tx_ref ?? ''} />
					<PaymentItem label="Amount" value={`${data?.amount ?? 0}`} />
				</div>
			</div>
		</DashboardLayout>
	);
};

type PaymentItemProps = {
	label: string;
	value: string;
};

const PaymentItem = ({ label, value }: PaymentItemProps) => {
	return (
		<div className="flex flex-col gap-1 mb-4">
			<p>{label}</p>
			<p className="font-bold">{value}</p>
		</div>
	);
};

export default PaymentMadePage;
