"use client";

import axios from "@/app/lib/axios";
import DashboardLayout from "@/app/DashboardLayout";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import { useVerifySurveyPayment } from "../_features/hooks";
import SurveyPageLoading from "../loading";
import toast from "react-hot-toast";
import { Verified } from "lucide-react";
import { Props } from "recharts/types/container/Surface";
import { formattedDate } from "@/app/utils/tools";

const PaymentMadePage = () => {
  const searchParams = useSearchParams();

  const txRef = searchParams.get("tx_ref");

  const {
    mutateAsync: verifyPayment,
    isPending: isVerifing,
    data: data,
    isSuccess: isVerifyPaymentSuccess,
    // isError,
  } = useVerifySurveyPayment({
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
      if (data.paymentResult.data.status === "successful") {
        toast.success("Payment successfull");
      } else {
        toast.error("Error when making payments");
      }
    }
  }, [
    txRef,
    data?.message,
    data?.paymentResult.data.status,
    isVerifyPaymentSuccess,
    verifyPayementFunc,
  ]);

  if (isVerifing) return <SurveyPageLoading />;

  return (
    <DashboardLayout>
      <div className="text-black">
        {data?.paymentResult.data.status === "successful" ? (
          <div className="bg-white p-4 rounded-lg max-w-xl mx-auto drop-shadow-2xl mt-12">
            <div className="flex gap-4 items-center mb-8">
              <div className="bg-green-300 rounded-full">
                <Verified color="white" />
              </div>
              <p className="text-xl font-bold">Payment successfull</p>
            </div>
            <PaymentItem
              label="Date"
              value={formattedDate(data.paymentResult?.data.created_at)}
            />

            <PaymentItem
              label="Reference"
              value={data.paymentResult?.data.tx_ref}
            />

            <PaymentItem
              label="Amount"
              value={`${data.paymentResult?.data.amount} ${data.paymentResult?.data.currency}`}
            />
            {/* <p>{data.paymentResult?.data.app_fee}</p>
            <p>{data.paymentResult?.data.merchant_fee}</p> */}
          </div>
        ) : (
          <div className="bg-red-50 p-4 rounded-md max-w-xl mx-auto">
            <p className="text-red-600 text-xl font-bold">{data?.message}</p>
            <p className="text-red-600">Error payment</p>
          </div>
        )}
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
