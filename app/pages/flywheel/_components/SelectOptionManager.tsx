"use client";

import React from "react";
import { DataPointForm } from "@/app/lib/type";
import { FieldType } from "@/app/lib/type";
interface SelectOptionManagerProps {
	index: number;
	newOptions: string[];
	setNewOptions: React.Dispatch<React.SetStateAction<string[]>>;
	formFields: Field[];
	setFormFields: React.Dispatch<React.SetStateAction<DataPointForm>>;
}


export type Field = {
	label: string;
	key: string;
	type: FieldType;
	required: boolean;
	options?: string[];
};


const SelectOptionManager: React.FC<SelectOptionManagerProps> = ({
	index,
	newOptions,
	setNewOptions,
	formFields,
	setFormFields,
}) => {
	const field = formFields[index];

	if (!["select", "checkbox", "radio"].includes(field.type)) return null;

	const handleAddOption = () => {
		const option = newOptions[index]?.trim();
		if (!option) return;

		const updatedFields = [...formFields];
		updatedFields[index].options = [...(updatedFields[index].options || []), option];
		setFormFields((prev) => ({ ...prev, field: updatedFields }));

		const updatedOptions = [...newOptions];
		updatedOptions[index] = "";
		setNewOptions(updatedOptions);
	};

	const handleRemoveOption = (i: number) => {
		const updatedFields = [...formFields];
		updatedFields[index].options = updatedFields[index].options?.filter((_, idx) => idx !== i);
		setFormFields((prev) => ({ ...prev, field: updatedFields }));
	};

	return (
		<div className="space-y-2">
			<label className="text-sm font-medium mb-1 block">Options</label>

			<div className="flex gap-2">
				<input
					type="text"
					placeholder="Enter option"
					value={newOptions[index] || ""}
					onChange={(e) => {
						const updated = [...newOptions];
						updated[index] = e.target.value;
						setNewOptions(updated);
					}}
					className="flex-1 border bg-white border-gray-300 rounded px-3 py-2"
				/>

				<button
					type="button"
					className="text-blue-600 border border-blue-600 px-3 py-1 rounded-lg hover:bg-blue-50 cursor-pointer"
					onClick={handleAddOption}
				>
					Add
				</button>
			</div>

			{field.options && field.options.length > 0 && (
				<ul className="list-disc text-sm text-gray-600 space-y-1">
					{field.options.map((option, i) => (
						<li key={i} className="flex justify-between rounded-sm px-2 py-2 items-center bg-gray-100 border-b border-gray-100 pb-2">
							{option}
							<button
								type="button"
								onClick={() => handleRemoveOption(i)}
								className="text-red-500 text-xs ml-2 cursor-pointer"
							>
								Remove
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default SelectOptionManager;
