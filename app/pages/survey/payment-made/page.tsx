"use client";

import DashboardLayout from "@/app/DashboardLayout";
import axios from "@/app/lib/axios";
import { Verified, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { useVerifySurveyPayment, useVerifyWalletTrx } from "../_features/hooks";
import SurveyPageLoading from "../loading";

const PaymentMadePage = () => {
  const searchParams = useSearchParams();
  const txRef = searchParams.get("tx_ref");
  const status = searchParams.get("status");
  const source = searchParams.get("source"); // "wallet" = wallet verification, else survey
  const provider = searchParams.get("provider"); // "kuvarpay" for survey KuvarPay verification

  // Flutterwave verification
  const {
    mutateAsync: verifySurveyPayment,
    isPending: isSurveyPending,
    data: surveyData,
    isSuccess: isSurveySuccess,
  } = useVerifySurveyPayment({ axios });

  // Wallet verification
  const {
    mutateAsync: verifyWalletPayment,
    isPending: isWalletPending,
    data: walletData,
    isSuccess: isWalletSuccess,
  } = useVerifyWalletTrx({ axios });

  // Pick correct mutation based on "source"
  const verifyPaymentFunc = useCallback(async () => {
    try {
      if (!txRef) return;
      if (source === "wallet") {
        await verifyWalletPayment(txRef);
      } else {
        await verifySurveyPayment({
          txRef,
          provider: provider === "kuvarpay" ? "kuvarpay" : undefined,
        });
      }
    } catch (error: any) {
      toast.error(error.message || "Verification failed");
    }
  }, [txRef, source, provider, verifySurveyPayment, verifyWalletPayment]);

  useEffect(() => {
    if (txRef) verifyPaymentFunc();
  }, [txRef, verifyPaymentFunc]);

  useEffect(() => {
    const data = source === "wallet" ? walletData : surveyData;
    const success = source === "wallet" ? isWalletSuccess : isSurveySuccess;

    if (success) {
      if (data?.paymentStatus === "paid") {
        toast.success("Payment successful");
      } else {
        toast.error("Payment not paid");
      }
    }
  }, [source, walletData, surveyData, isWalletSuccess, isSurveySuccess]);

  const isVerifying = isSurveyPending || isWalletPending;
  const data = source === "wallet" ? walletData : surveyData;

  if (isVerifying) return <SurveyPageLoading />;

  if (status === "cancelled") {
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
    );
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

          <PaymentItem label="Reference" value={data?.tx_ref ?? ""} />
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
