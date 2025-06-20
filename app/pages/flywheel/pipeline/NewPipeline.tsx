"use client";
import ErrorMessage from "@/app/components/form/ErrorMessage";
import axios from "@/app/lib/axios";
import { PipeLineSchema } from "@/app/lib/type";
import { pipeLineSchema } from "@/app/lib/validationSchemas";
import { getBusinessId, getEmployeeUserId } from "@/app/utils/user/userData";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useCreatePipeline } from "../_features/hook";

const NewPipeline = () => {
	const businessUserId = getBusinessId();
	const employeeUserId = getEmployeeUserId();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<PipeLineSchema>({
		resolver: zodResolver(pipeLineSchema),
	});

	const queryClient = useQueryClient();

	const { mutateAsync: createPipeline } = useCreatePipeline({ axios });

	const onButtonClick = async (data: PipeLineSchema) => {
		try {
			await createPipeline(
				{ ...data, businessUserId, employeeUserId },
				{
					onSuccess: () => {
						queryClient.invalidateQueries({ queryKey: ["pipelines"] });
						toast.success("New data pipeline created successfully");
						reset(); // clear form if needed
					},
					onError: (error: any) => {
						console.error("Pipeline creation failed:", error?.message);
						toast.error("Pipeline creation failed");
					},
				}
			);
		} catch (error: any) {
			console.error("Unexpected error:", error);
		}
	};

	return (
		<div className="mt-10">
			<h2 className="text-gray-800 text-lg font-normal">New Data Pipeline</h2>

			<form onSubmit={handleSubmit(onButtonClick)} className="lg:w-3/4">
				<input
					{...register("dataPointName")}
					type="text"
					placeholder="Data pipeline name"
					className="mt-5 w-full border border-gray-200 rounded px-3 py-2 outline-none"
				/>
				<ErrorMessage>{errors.dataPointName?.message}</ErrorMessage>

                
				<textarea
					{...register("dataPointDescription")}
					placeholder="Data pipeline Description"
					className="mt-5 w-full border border-gray-200 rounded px-3 py-2 outline-none"
				/>
                
				<ErrorMessage>{errors.dataPointDescription?.message}</ErrorMessage>

				<button
					disabled={isSubmitting}
					type="submit"
					className="mt-5 flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer disabled:opacity-50"
				>
					<Check size={16} className="mr-1" />
					{isSubmitting ? "Submitting..." : "Submit"}
				</button>
			</form>
		</div>
	);
};

export default NewPipeline ;
