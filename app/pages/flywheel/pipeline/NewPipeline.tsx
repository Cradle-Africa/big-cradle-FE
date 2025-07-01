"use client";
import ErrorMessage from "@/app/components/form/ErrorMessage";
import axios from "@/app/lib/axios";
import { PipeLineSchema } from "@/app/lib/type";
import { pipeLineSchema } from "@/app/lib/validationSchemas";
import { getBusinessId, getEmployeeUserId, getUser } from "@/app/utils/user/userData";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useCreatePipeline } from "../_features/hook";

type Props = {
	setCreatingPipeline: (value: boolean) => void;
};

const NewPipeline = ({ setCreatingPipeline }: Props) => {

	const user = getUser()
	const employeeUserId = getEmployeeUserId();

	let businessUserId: string | null = null;

	if (user?.role === 'business') {
		businessUserId = getBusinessId() || null;
	} else {
		businessUserId = user?.businessUserId || null;
	}

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<PipeLineSchema>({
		resolver: zodResolver(pipeLineSchema),
	});

	const queryClient = useQueryClient();

	const { mutate: createPipeline, isPending } = useCreatePipeline({ axios });

	const onButtonClick = (data: PipeLineSchema) => {
		createPipeline(
			{ ...data, businessUserId, employeeUserId },
			{
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: ["data-points"] });
					toast.success("New data pipeline created successfully");
					reset(); // clear form
					setCreatingPipeline(false);
				},
				onError: (error: any) => {
					toast.error(error.message || "Failed to create data point");
				}
			}
		);
	};



	return (
		<div className="mt-5 py-5">
			<h2 className="text-gray-800 text-lg font-normal">New Data Pipeline</h2>

			<form onSubmit={handleSubmit(onButtonClick)} className="lg:w-3/4">
				<input
					{...register("dataPointName")}
					type="text"
					placeholder="Data pipeline name"
					className="mt-5 w-full bg-white border border-gray-300 rounded-md px-3 py-2 outline-none"
				/>
				<ErrorMessage>{errors.dataPointName?.message}</ErrorMessage>


				<textarea
					{...register("dataPointDescription")}
					placeholder="Data pipeline Description"
					className="mt-5 w-full bg-white border border-gray-300 rounded-md px-3 py-2 outline-none"
				/>

				<ErrorMessage>{errors.dataPointDescription?.message}</ErrorMessage>

				<button
					disabled={isPending}
					type="submit"
					className="mt-5 flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer disabled:opacity-50"
				>
					<Check size={16} className="mr-1" />
					{isPending ? "Submitting..." : "Submit"}
				</button>
			</form>
		</div>
	);
};

export default NewPipeline;
