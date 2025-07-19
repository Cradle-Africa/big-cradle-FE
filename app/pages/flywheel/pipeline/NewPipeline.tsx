"use client";
import ErrorMessage from "@/app/components/form/ErrorMessage";
import axios from "@/app/lib/axios";
import { PipeLineSchema } from "@/app/lib/type";
import { pipeLineSchema } from "@/app/lib/validationSchemas";
import { getBusinessId, getEmployeeUserId, getUser } from "@/app/utils/user/userData";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useCreatePipeline } from "../_features/hook";
import { useFetchDepartments } from "../../user/department/_features/hook";
import { Spinner } from "@radix-ui/themes";

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
					queryClient.invalidateQueries({ queryKey: ["pipelines"] });
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

	//call department list api
	const { data: departments } = useFetchDepartments({
		axios,
		queryParams: {
			businessUserId: businessUserId || undefined,
		},
	});
	const departmentData = departments?.data ?? [];


	return (
		<div
			className="max-w-full mx-auto h-screen p-5 bg-gray-50 rounded-md space-y-4"
		>

			<form onSubmit={handleSubmit(onButtonClick)}
				className="gap-4 max-w-xl 2xl:max-w-3xl mx-auto"
			>
				<div className="flex justify-between items-center ">
					<h2 className="text-black font-semibold text-lg">New Data Pipeline</h2>

					<button
						className="flex justify-end items-center bg-blue-600 text-white px-4 py-1 rounded-md cursor-pointer"
						onClick={() => setCreatingPipeline(false)}
					>
						<ArrowLeft size={18} color="white" className="mr-1" />
						Back
					</button>
				</div>

				<select
					{...register("departmentId")}
					className="mt-5 w-full bg-white border border-gray-300 rounded-md px-3 py-2 outline-none"
				>
					<option value="">Select the department</option>
					{departmentData.map((department, index) =>
						<option key={index} value={department?.id}>{department?.departmentName}</option>
					)}
				</select>
				<ErrorMessage>{errors.departmentId?.message}</ErrorMessage>

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
					className="mt-5 w-full flex justify-center items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer disabled:opacity-50"
				>
					{isPending ? (
						<Spinner className='inline mr-1' />
					) : (
						<Check size={14} className="inline mr-1" />
					)
					}
					{isPending ? "Submitting..." : "Submit"}
				</button>
			</form>
		</div>
	);
};

export default NewPipeline;
