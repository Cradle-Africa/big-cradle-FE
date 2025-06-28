"use client";

import axios from "@/app/lib/axios";
import { useFetchSingleDataPoint, useFetchSinglePipeline } from "../_features/hook";
import { X } from "lucide-react";

interface PopUpProps {
	openViewDataPoint: boolean;
	onClose: () => void;
	uniqueId: string;
}

const ViewDataPoint: React.FC<PopUpProps> = ({
	openViewDataPoint,
	onClose,
	uniqueId,
}) => {
	const { data: pipeline, isLoading } = useFetchSingleDataPoint({
		axios,
		id: uniqueId,
		enabled: openViewDataPoint,
	});

	const { data: singlePipeline } = useFetchSinglePipeline({
		axios,
		id: pipeline?.dataPointId || '',
		enabled: openViewDataPoint,
	});

	const renderField = (field: any, index: number) => {
		const baseStyle =
			"w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed";

		switch (field.type) {
			case "text":
			case "email":
			case "number":
			case "date":
				return (
					<input
						key={index}
						type={field.type}
						readOnly
						value={`Sample ${field.label}`}
						className={baseStyle}
					/>
				);

			case "textarea":
				return (
					<textarea
						readOnly
						value={`Sample text for ${field.label}`}
						className={`${baseStyle} resize-none h-24`}
					/>
				);

			case "select":
				return (
					<select disabled className={baseStyle}>
						{field.options?.map((opt: string, i: number) => (
							<option key={i} value={opt}>
								{opt}
							</option>
						))}
					</select>
				);

			case "radio":
				return (
					<div className="grid gap-2">
						{field.options?.map((opt: string, i: number) => (
							<label key={i} className="flex items-center gap-2 text-sm">
								<input
									type="radio"
									disabled
									name={`radio-${index}`}
									checked={i === 0}
									className="cursor-not-allowed"
								/>
								{opt}
							</label>
						))}
					</div>
				);

			case "checkbox":
				return (
					<div className="grid gap-2">
						{field.options?.map((opt: string, i: number) => (
							<label key={i} className="flex items-center gap-2 text-sm">
								<input
									type="checkbox"
									disabled
									name={`checkbox-${index}`}
									checked={i === 0}
									className="cursor-not-allowed"
								/>
								{opt}
							</label>
						))}
					</div>
				);

			default:
				return (
					<input
						type="text"
						readOnly
						value={`${field.type}`}
						className={baseStyle}
					/>
				);
		}
	};

	if (!openViewDataPoint) return (null)
	return (
		<>
			<div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />

			<div className="fixed z-50 inset-0 flex items-center justify-center px-4">
				<div className="relative w-full bg-white rounded-xl shadow-xl max-w-2xl p-5">
					<button
						onClick={onClose}
						className="absolute top-8 right-7 text-gray-400 hover:text-blue-600 cursor-pointer text-xl"
					>
						<X />
					</button>

					<h2 className="text-blue-600 text-xl mb-6 flex items-center gap-2">
						View Data Point
					</h2>
					{isLoading ? (
						<p className="flex justify-center px-10 py-10 text-gray-800 text-sm">Loading...</p>
					) : (
						<>
							<h2 className="text-xl text-blue-600">{singlePipeline?.dataPointName }</h2>
							<div className="overflow-y-auto max-h-[70vh] py-8 ">
								<form className="space-y-6 text-left text-sm">
									{pipeline?.field.map((field, index) => (
										<div key={index}>
											<label className="block text-gray-700 mb-1 font-medium">
												{field.label}
												{field.required && (
													<span className="text-red-500 ml-1">*</span>
												)}
											</label>
											{renderField(field, index)}
										</div>
									))}
								</form>
							</div>
						</>

					)}

				</div>
			</div>
		</>

	);
};

export default ViewDataPoint;
