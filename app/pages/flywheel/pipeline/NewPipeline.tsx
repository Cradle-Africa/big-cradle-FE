"use client";
import ErrorMessage from "@/app/components/form/ErrorMessage";
import axios from "@/app/lib/axios";
import { PipeLineSchema } from "@/app/lib/type";
import { pipeLineSchema } from "@/app/lib/validationSchemas";
import { getBusinessId, getEmployeeUserId } from "@/app/utils/user/userData";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useCreatePipeline } from "../_features/hook";

const NewDataPoint = () => {

    const businessUserId = getBusinessId()
    const employeeUserId = getEmployeeUserId()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<PipeLineSchema>({
        resolver: zodResolver(pipeLineSchema),
    });

    const queryClient = useQueryClient()

    const {
        mutateAsync: createPipeline,
        // error: createError,
        isSuccess: isCreateSuccess,
    } = useCreatePipeline({
        axios,
    });

    const onButtonClick = async (data: PipeLineSchema) => {
        try {
            await createPipeline(
                {...data, businessUserId, employeeUserId }
            );
        } catch (error: any) {
            console.log(JSON.stringify(error));
        }
    }

    useEffect(() => {
        if (isCreateSuccess) {
            queryClient.invalidateQueries({ queryKey: ["pipelines"] });
            toast.success(`New data pipeline created successfully`);
            // router.back();
        }
    }, [isCreateSuccess, queryClient]);

    return (
        <div className="mt-10">
            <h2 className="text-gray-800 text-lg font-normal">
                New Data Pipeline
            </h2>
            <form onSubmit={handleSubmit(onButtonClick)} className="lg:w-3/4">
                <input
                {...register("pipelineName")}
                    type="text"
                    placeholder="Data pipeline name"
                    name="dataPointName"
                    className="mt-5 w-full border border-gray-200 rounded px-3 py-2 outline-none"
                />
                <ErrorMessage>{errors.pipelineName?.message}</ErrorMessage>

                <input
                {...register("pipelineDescription")}
                    type="text"
                    placeholder="Data pipeline Description"
                    name="pipelineDescription"
                    className="mt-5 w-full border border-gray-200 rounded px-3 py-2 outline-none"
                />
                <ErrorMessage>{errors.pipelineDescription?.message}</ErrorMessage>

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









