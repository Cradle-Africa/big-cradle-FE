import ErrorMessage from "@/app/components/form/ErrorMessage";
import axios from "@/app/lib/axios";
import {
  DataPointForm,
  FlutterWavePaymentSubmit,
  Survey,
  SurveyPaymentSchema,
} from "@/app/lib/type";
import { surveyPaymentSchema } from "@/app/lib/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { useCreateSurvey, useSurveyPay } from "../_features/hooks";

import {
  getBusinessId,
  getEmployeeUserId,
  getUser,
} from "@/app/utils/user/userData";
import toast from "react-hot-toast";
import Spinner from "@/app/components/Spinner";

type Props = {
  form: DataPointForm;
  setForm: React.Dispatch<React.SetStateAction<DataPointForm>>;
  surveyName: string;
  surveyDescription: string;
};

const SurveyPayementArea = ({
  form,
  setForm,
  surveyName,
  surveyDescription,
}: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync: createSurvey, isPending: isCreatingSurvey } =
    useCreateSurvey({ axios });

  const { mutateAsync: makePayment, isPending: isMakingPayment } = useSurveyPay(
    { axios }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SurveyPaymentSchema>({
    resolver: zodResolver(surveyPaymentSchema),
  });

  const user = getUser();

  let businessUserId: string | null = null;
  const employeeUserId = getEmployeeUserId();

  if (user?.role === "business") {
    businessUserId = getBusinessId() || null;
  } else {
    businessUserId = user?.businessUserId || null;
  }

  const submitSurveyPayment = async (data: FlutterWavePaymentSubmit) => {
    try {
      await makePayment(
        {
          tx_ref: data.tx_ref,
          amount: data.amount,
          currency: data.currency,
          redirect_url: data.redirect_url,
          payment_options: data.payment_options,
          customer: data.customer,
          customizations: data.customizations,
        },
        {
          onSuccess: (data) => {
            window.location.href = data.data.link;
            toast.success("Survey payment initialized");
          },
        }
      );
    } finally {
    }
  };

  const submitSurvey = async (data: SurveyPaymentSchema) => {
    const payload: Survey = {
      businessUserId,
      employeeUserId,
      surveyName: surveyName,
      surveyDescription: surveyDescription,
      amount: parseInt(`${data.amount}`),
      field: form.field,
    };

    // console.log(JSON.stringify(data));

    await createSurvey(payload, {
      onSuccess: (createdSurvey) => {
        queryClient.invalidateQueries({ queryKey: ["pipelines"] });
        setForm({ dataPointId: "", field: [] }); // clear the form

        submitSurveyPayment({
          tx_ref: createdSurvey.data.tx_ref,
          amount: parseInt(data.amount),
          currency: "NGN",
          redirect_url: `https://big-cradle-frontend-eight.vercel.app/pages/survey?${createdSurvey.data.tx_ref}`,
          payment_options:
            "card,account,banktransfer,ussd,mpesa,ghana_mobilemoney,uganda_mobilemoney,rwanda_mobilemoney,barter,credit",
          customer: {
            email: user?.email || "",
          },
          customizations: {
            title: data.title,
            description: data.description,
          },
        });

        // verifyPayment(createdSurvey.data.tx_ref);
      },
      onError: (error: any) => {
        console.error("Create survey error:", error);
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to create the survey";
        toast.error(message);
      },
    });
  };

  //   useEffect(() => {
  //     if (isCreateSurveySuccess) {
  //       submitSurveyPayment();
  //     }
  //   }, []);

  return (
    <div className="max-w-3xl mx-auto my-8">
      <button
        type="button"
        onClick={() => router.back()}
        className="text-red-600 border border-red-600 px-4 py-1 cursor-pointer rounded-lg hover:bg-blue-50 mb-8"
      >
        <ArrowLeft />
      </button>
      <p className="text-3xl font-bold mb-1">Payment</p>
      <p className="mb-8">
        Fill the fields down and click on the proceed button to make payment
      </p>
      <form
        onSubmit={handleSubmit(submitSurvey)}
        className="flex flex-col gap-2"
      >
        <div className="flex xl:flex-wrap gap-4">
          <div className="w-full">
            <input
              {...register("amount")}
              placeholder="Amount"
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none "
            />
            <ErrorMessage>{errors.amount?.message}</ErrorMessage>
          </div>
          {/* <div className="w-full">
            <select
              {...register("paymentOption")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none bg-white"
              defaultValue=""
            >
              <option value="" disabled>
                Select a payment method
              </option>
              {paymentMethods.map((method) => (
                <option key={method} value={method}>
                  {method.replace(/_/g, " ").toUpperCase()}
                </option>
              ))}
            </select>
          </div> */}
        </div>
        <input
          {...register("title")}
          placeholder="Title of the payment"
          className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none "
        />
        <ErrorMessage>{errors.title?.message}</ErrorMessage>
        <textarea
          {...register("email")}
          placeholder="Description of the payment"
          className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none "
        />
        <ErrorMessage>{errors.email?.message}</ErrorMessage>

        <button
          disabled={isMakingPayment || isCreatingSurvey}
          className="bg-blue-600 rounded-md py-2 px-8 mr-auto mt-4"
        >
          <span className="text-white">
            {isMakingPayment || isCreatingSurvey ? (
              <>
                <span className="mr-2">Loading</span>
                <Spinner />
              </>
            ) : (
              "Proceed"
            )}
          </span>
        </button>
      </form>
    </div>
  );
};

// const paymentMethods = [
//   "card",
//   "account",
//   "banktransfer",
//   "ussd",
//   "mpesa",
//   "ghana_mobilemoney",
//   "uganda_mobilemoney",
//   "rwanda_mobilemoney",
//   "barter",
//   "credit",
// ];

export default SurveyPayementArea;
