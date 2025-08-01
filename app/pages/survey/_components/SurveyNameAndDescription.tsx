"use client";

import ErrorMessage from "@/app/components/form/ErrorMessage";
import { SurveySchema } from "@/app/lib/type";
import { ChevronLeft, ChevronRight, FilePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { JSX } from "react";
// import { Button } from "@radix-ui/themes";
import "react-country-state-city/dist/react-country-state-city.css";

import {
	FieldErrors,
	UseFormHandleSubmit,
	UseFormRegister,
} from "react-hook-form";

type Props = {
	surveyTab: JSX.Element
	register: UseFormRegister<SurveySchema>;
	errors: FieldErrors<SurveySchema>;
	handleSubmit: UseFormHandleSubmit<SurveySchema>;
	onSubmit: (data: SurveySchema) => void;
};

const SurveyNameAndDescription = ({
	surveyTab,
	errors,
	handleSubmit,
	onSubmit,
	register
}: Props) => {
	const router = useRouter();

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="my-6 flex flex-col gap-4 max-w-xl 2xl:max-w-3xl mx-auto"
		>

			<div className="relative flex justify-around ">
				<button
					type="button"
					className="absolute left-0 bg-gray-100 w-10 h-10 flex justify-start items-center rounded-full p-2 
				hover:cursor-pointer hover:bg-blue-600 hover:text-white transition duration-500 "
					onClick={() => router.back()}>
					<ChevronLeft size={30} />
				</button>
				<div className="flex flex-col justify-center">
					<div
						className="bg-blue-100 p-2 text-blue-600 rounded-full h-10 w-10
						flex items-center justify-center
					">
						<FilePlus size={20} />
					</div>
				</div>
			</div>
			<h3 className="flex w-full justify-center font-semibold teext-lg mt-2">Survey Details</h3>

			<p className="mt-5 mb-3">
				Fill in the details below. This information will help participants understand the purpose and content of the survey.
			</p>
			<div>
				<input
					{...register("surveyName")}
					placeholder="Survey name"
					className="w-full mb-1 border border-gray-300 rounded-md px-3 py-2 outline-none bg-white"
				/>
				<ErrorMessage>{errors.surveyName?.message}</ErrorMessage>
			</div>
			<div>
				<input
					{...register("surveyGoal")}
					placeholder="Survey Goal"
					className="w-full mb-1 border border-gray-300 rounded-md px-3 py-2 outline-none bg-white"
				/>
				<ErrorMessage>{errors.surveyGoal?.message}</ErrorMessage>
			</div>
			<div>
				<select
					{...register("surveyType")}
					className="w-full mb-1 border border-gray-300 rounded-md px-3 py-2 outline-none bg-white"
				>
					<option>Select the survey type</option>
					<option value="internal">Internal</option>
					<option value="external">External</option>
				</select>
				<ErrorMessage>{errors.surveyType?.message}</ErrorMessage>
			</div>
			<div className="flex gap-3">
				<div className="w-1/2">
					<input
						{...register("startDate")}
						placeholder="Survey start date"
						type="date"
						className="w-full mb-1 border border-gray-300 rounded-md px-3 py-2 outline-none bg-white"
					/>
					<ErrorMessage>{errors.startDate?.message}</ErrorMessage>
				</div>

				<div className="w-1/2">
					<input
						{...register("endDate")}
						placeholder="Survey end date"
						type="date"
						className="w-full mb-1 border border-gray-300 rounded-md px-3 py-2 outline-none bg-white"
					/>
					<ErrorMessage>{errors.endDate?.message}</ErrorMessage>
				</div>
			</div>

			<div>
				<textarea
					{...register("surveyDescription")}
					placeholder="Survey Description"
					className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none bg-white"
				/>
				<ErrorMessage>{errors.surveyDescription?.message}</ErrorMessage>
			</div>

			{/* JSX type Tab step */}
			{surveyTab}

			<button
				className="flex items-center w-full justify-center bg-blue-600 text-white rounded-md py-2 px-8 mr-auto
				hover:cursor-pointer
			">
				Next
				<ChevronRight size={13} className="iniline mr-1" />
			</button>
		</form>
	);
};

export default SurveyNameAndDescription;
