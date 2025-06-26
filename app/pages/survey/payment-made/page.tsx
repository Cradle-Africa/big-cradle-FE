"use client";

import axios from "@/app/lib/axios";
import DashboardLayout from "@/app/DashboardLayout";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import { useVerifySurveyPayment } from "../_features/hooks";
import SurveyPageLoading from "../loading";
import toast from "react-hot-toast";

const PaymentMadePage = () => {
  const searchParams = useSearchParams();

  const txRef = searchParams.get("tx_ref");

  const {
    mutateAsync: verifyPayment,
    isPending: isVerifing,
    data: data,
    isSuccess: isVerifyPaymentSuccess,
    isError,
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
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    }
  }, [txRef, verifyPayementFunc]);

  if (isVerifing) return <SurveyPageLoading />;

  return (
    <DashboardLayout>
      <div className="text-black">
        {data?.paymentResult.data.status === "successful" ? (
          <div className="bg-green-100 p-4">
            <p className="text-xl font-bold mb-4">{data.message}</p>
            <p>{data.paymentResult?.data.id}</p>
            <p>{data.paymentResult?.data.tx_ref}</p>
            <p>{data.paymentResult?.data.flw_ref}</p>
            <p>
              {data.paymentResult?.data.amount}{" "}
              {data.paymentResult?.data.currency}
            </p>
            <p>{data.paymentResult?.data.app_fee}</p>
            <p>{data.paymentResult?.data.merchant_fee}</p>
          </div>
        ) : (
          <div className="bg-red-50 p-4">
            <p className="text-red-600 text-xl font-bold">{data?.message}</p>
            <p className="text-red-600">Error payment</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PaymentMadePage;
