"use client";

import DashboardLayout from "@/app/DashboardLayout";
import axios from "@/app/lib/axios";
import { formattedDate } from "@/app/utils/tools";
import { Verified } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { Spinner } from "@radix-ui/themes";
import { useVerifyTransaction } from "../_features/hook";

const PaymentMadePage = () => {
	const searchParams = useSearchParams();

	const txRef = searchParams.get("tx_ref");

	const {
		mutateAsync: verifyPayment,
		isPending: isVerifing,
		data: data,
		isSuccess: isVerifyPaymentSuccess,
		// isError,
	} = useVerifyTransaction({
		axios,
	});

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
			toast.success(data?.data?.paymentStatus);
		}
	}, [
		txRef,
		data?.message,
		data?.data.paymentStatus,
		isVerifyPaymentSuccess,
		verifyPayementFunc,
	]);

	if (isVerifing) return (
		<DashboardLayout >
			<Spinner />
		</DashboardLayout>
	)

	if (!data) return (
		''
	)

	return (
		<DashboardLayout>
			<div className="text-black">
				<div className="bg-white p-8 rounded-lg max-w-3xl mx-auto drop-shadow-2xl mt-10">

					<div className="bg-green-50 p-4 border border-green-400 rounded-md max-w-3xl mb-10 mx-auto">
						<div className="flex gap-4 items-center mb-8 mt-5">
							<div className="bg-green-300 rounded-full">
								<Verified color="white" />
							</div>
							<p className="text-xl font-bold">{data?.message}</p>
						</div>
						<span className=" text-green-600 border border-green-600 rounded-full py-1 px-5 capitalize mt-5">
							{
								data?.data.paymentStatus
							}
						</span>
					</div>


					<PaymentItem
						label="Date"
						value={formattedDate(data.data?.createdAt)}
					/>

					<PaymentItem
						label="Reference"
						value={data.data?.tx_ref}
					/>

					<PaymentItem
						label="Amount"
						value={`${data?.data.amount}`}
					/>
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

const renderPaymentMade = () => {
	<Suspense>
		<PaymentMadePage />
	</Suspense>
}
export default renderPaymentMade;
