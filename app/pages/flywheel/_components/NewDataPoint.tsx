"use client";
import ErrorMessage from "@/app/components/form/ErrorMessage";
import axios from "@/app/lib/axios";
import { DataPointSchema } from "@/app/lib/type";
import { dataPointSchema } from "@/app/lib/validationSchemas";
import { getBusinessId, getEmployeeUserId } from "@/app/utils/user/userData";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useCreateDataPoint } from "../_features/hook";

const NewDataPoint = () => {

    const businessusinessUserId = getBusinessId()
    const employeeUserId = getEmployeeUserId()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<DataPointSchema>({
        resolver: zodResolver(dataPointSchema),
    });

    const queryClient = useQueryClient()

    const {
        mutateAsync: createDataPoint,
        // error: createError,
        isSuccess: isCreateSuccess,
    } = useCreateDataPoint({
        axios,
    });

    const onButtonClick = async (data: DataPointSchema) => {
        try {
            console.log(JSON.stringify(data))
            await createDataPoint(
                {...data, businessusinessUserId, employeeUserId }
            );
        } catch (error: any) {
            toast.error(JSON.stringify(error));
        }
    }

    useEffect(() => {
        if (isCreateSuccess) {
            queryClient.invalidateQueries({ queryKey: ["data-points"] });
            toast.success(`New data point created successfully`);
            // router.back();
        }
    }, [isCreateSuccess, queryClient]);

    return (
        <div className="mt-10">
            <h2 className="text-gray-800 text-lg font-normal">
                New Data Point
            </h2>
            <form onSubmit={handleSubmit(onButtonClick)} className="lg:w-3/4">
                <input
                {...register("dataPointName")}
                    type="text"
                    placeholder="Data point name"
                    name="dataPointName"
                    className="mt-5 w-full border border-gray-200 rounded px-3 py-2 outline-none"
                />
                <ErrorMessage>{errors.dataPointName?.message}</ErrorMessage>

                <input
                {...register("dataPointDescription")}
                    type="text"
                    placeholder="Data point Description"
                    name="dataPointDescription"
                    className="mt-5 w-full border border-gray-200 rounded px-3 py-2 outline-none"
                />
                <ErrorMessage>{errors.dataPointDescription?.message}</ErrorMessage>

                <button
                    disabled={isSubmitting}
                    type="submit"
                    className="mt-5 flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer"
                >
                    <Check size={16} className="mr-1" />
                    {isSubmitting ? 'Submitting' : 'Submit'}
                </button>
            </form>

        </div>
    );
};

export default NewDataPoint;
