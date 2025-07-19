"use client";

import ErrorMessage from "@/app/components/form/ErrorMessage";
import { Country, CountryAndCity, DemographicFormValues, DemographicSubmitValues, State } from "@/app/lib/type";
import { ChevronLeft, ChevronRight, FilePlus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CitySelect, CountrySelect, StateSelect } from "react-country-state-city";
import {
	Control,
	Controller,
	FieldErrors,
	UseFormHandleSubmit,
	UseFormRegister,
	SubmitHandler
} from "react-hook-form";
import LocationAndDemographicTable from "./LocationAndDemographicTable";
import toast from "react-hot-toast";
import Select from "react-select";
import { JSX } from "react";

type Props = {
	surveyTab: JSX.Element;
	register: UseFormRegister<DemographicFormValues>;
	control: Control<DemographicFormValues>;
	errors: FieldErrors<DemographicFormValues>;
	handleSubmit: UseFormHandleSubmit<DemographicFormValues>;
	onSubmit: (data: DemographicSubmitValues) => void;  // For final submission
	onAddLocation: (data: DemographicFormValues) => void; // For adding locations
	countryAndCitiesList: CountryAndCity[];
	onDeleteClick: (val: CountryAndCity) => void;
	onNextClicked: () => void;
};

const LocationAndDemographic = ({
	surveyTab,
	// register,
	control,
	errors,
	handleSubmit,
	onSubmit,
	onAddLocation,
	countryAndCitiesList,
	onDeleteClick,
	onNextClicked,
}: Props) => {
	const router = useRouter();
	const [country, setCountry] = useState<Country | null>(null);
	const [state, setState] = useState<State | null>(null);
	const [demographicSelections, setDemographicSelections] = useState<{
		age: string[];
		gender: string[];
		country: string;
		state: string;
		city: string;
	}[]>([]);


	const handleAddDemographic: SubmitHandler<DemographicFormValues> = (data) => {
		// Check if this country-state-city combination is already added
		const isDuplicate = demographicSelections.some(
			(selection) =>
				selection.country === data.country &&
				selection.state === data.state &&
				selection.city === data.city
		);

		if (isDuplicate) {
			toast.error("This region has already been added.");
			return;
		}

		// Add to location list
		onAddLocation(data);

		// Then add to demographic selections
		const newSelection = {
			age: data.ageDemographics,
			gender: data.gender,
			country: data.country,
			state: data.state,
			city: data.city
		};

		setDemographicSelections(prev => [...prev, newSelection]);
		// toast.success("Demographic selection added");
	};

	const handleDeleteDemographic = (index: number) => {
		setDemographicSelections(prev => prev.filter((_, i) => i !== index));
	};


	const handleFormSubmit = () => {
		if (demographicSelections.length === 0) {
			toast.error("Please add at least one demographic selection");
			return;
		}

		if (countryAndCitiesList.length === 0) {
			toast.error("Please add at least one location");
			return;
		}

		onSubmit({
			country: demographicSelections[0].country,
			state: demographicSelections[0].state,
			city: demographicSelections[0].city,
			ageDemographics: demographicSelections.map(s => s.age).flat(),  // string[]
			gender: demographicSelections.map(s => s.gender).flat(),        // string[]
		});

	};

	return (
		<div className="my-5 flex flex-col gap-4 max-w-xl 2xl:max-w-3xl mx-auto">
			<form onSubmit={handleSubmit(handleAddDemographic)}>

				<div className="relative flex justify-around ">
					<button
						type="button"
						className="absolute left-0 bg-gray-100 w-10 h-10 flex justify-start items-center rounded-full p-2 
				    	hover:cursor-pointer hover:bg-blue-600 hover:text-white transition duration-500 "
						onClick={() => router.back()}
					>
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
				<p className="mt-5 mb-8">
					Select demographic criteria for your survey participants
				</p>

				<div className="w-ful">
					<Controller
						control={control}
						name="ageDemographics"
						render={({ field }) => (
							<Select
								{...field}
								options={ageGroupsOptions}
								isMulti
								onChange={(selected) => field.onChange(selected.map(s => s.value))}
								value={ageGroupsOptions.filter(option => field.value?.includes(option.value))}
								placeholder='Select the age group'
							/>
						)}
					/>

					<ErrorMessage>{errors.ageDemographics?.message}</ErrorMessage>
				</div>
				<div className="w-full mt-5">
					<Controller
						control={control}
						name="gender"
						render={({ field }) => (
							<Select
								{...field}
								options={genders}
								isMulti
								onChange={(selected) => field.onChange(selected.map(s => s.value))}
								value={genders.filter(option => field.value?.includes(option.value))}
								placeholder='Select the gender'
							/>
						)}

					/>
					<ErrorMessage>{errors.gender?.message}</ErrorMessage>
				</div>
				<div className="w-full mt-5">
					<Controller
						control={control}
						name="country"
						render={({ field }) => (
							<div className="w-full">
								<CountrySelect
									className="mb-1 border-none"
									containerClassName="relative w-full !border-none"
									inputClassName="w-full !border-none rounded-md px-3 !py-[2px] pr-10 outline-none focus:ring-2 focus:ring-blue-500"
									onChange={(_country: any) => {
										field.onChange(_country.name);
										setCountry(_country);
										setState(null);
									}}
									value={field.name}
									placeHolder="Select Country"
								/>
								<ErrorMessage>{errors.country?.message}</ErrorMessage>
							</div>
						)}
					/>
				</div>
				<div className="flex justify-between gap-4 mt-5">

					<Controller
						control={control}
						name="state"
						render={({ field }) => (
							<div className="w-1/2">
								<StateSelect
									className="mb-1 border-none"
									containerClassName="relative w-full !border-none"
									inputClassName="w-full !border-none rounded-md px-3 !py-[2px] pr-10 outline-none focus:ring-2 focus:ring-blue-500"
									countryid={country?.id!}
									onChange={(_state: any) => {
										field.onChange(_state.name);
										setState(_state);
									}}
									placeHolder="Select State"
									value={field.name}
								/>
								<ErrorMessage>{errors.state?.message}</ErrorMessage>
							</div>
						)}
					/>

					<Controller
						control={control}
						name="city"
						render={({ field }) => (
							<div className="w-1/2">
								<CitySelect
									className="mb-1 border-none"
									containerClassName="relative w-full !border-none"
									inputClassName="w-full !border-none rounded-md px-3 !py-[2px] pr-10 outline-none focus:ring-2 focus:ring-blue-500"
									countryid={country?.id!}
									stateid={state?.id!}
									onChange={(_city: any) => {
										field.onChange(_city.name);
									}}
									placeHolder="Select city"
									value={field.value}
								/>
								<ErrorMessage>{errors.city?.message}</ErrorMessage>
							</div>
						)}
					/>
				</div>
				<p className="mt-5">
					Want to add multiple regions? Add this region to proceed
				</p>

				<button
					type="submit"
					className="bg-[#F0F8FF] w-full flex justify-center items-center px-5 py-1 mt-2 rounded-md
					 text-blue-600 border border-blue-600 hover:cursor-pointer
					">
					<Plus size={16} className="inline mr-1" />
					<span>Add Demographic Selection</span>
				</button>
			</form>

			{/* Combined Table for Locations and Demographics */}
			<LocationAndDemographicTable
				locationData={countryAndCitiesList}
				demographicData={demographicSelections}
				onDeleteLocation={onDeleteClick}
				onDeleteDemographic={handleDeleteDemographic}
			/>

			{/* JSX type Tab step */}
			<div className="w-full">
				{surveyTab}
			</div>
			<div className="flex justify-between w-full gap-4">
				<div
					className="w-1/2 flex items-center justify-center bg-gray-100 text-black hover:bg-blue-600 hover:text-white
					rounded-md py-2 px-8 mr-auto hover:cursor-pointer transition duration-500"
					onClick={ () => router.back()}
				>
					<ChevronLeft size={14} className="mr-1 inline" />
					Back
				</div>
				<button
					type="button"
					className="w-1/2 flex items-center justify-center bg-blue-600 text-white
					rounded-md py-2 px-8 mr-auto hover:cursor-pointer"
					onClick={() => {
						handleFormSubmit();
						onNextClicked();
					}}
				>
					Next
					<ChevronRight size={14} className="ml-1 inline" />

				</button>
			</div>

		</div>
	);
};

export default LocationAndDemographic;

export const ageGroupsOptions = [
	{ value: "18–24: Young Adults", label: "18–24: Young Adults" },
	{ value: "25–34: Millennials / Early career", label: "25–34: Millennials / Early career" },
	{ value: "35–44: Mid-career adults", label: "35–44: Mid-career adults" },
	{ value: "45–54: Mature adults", label: "45–54: Mature adults" },
	{ value: "55–64: Pre-retirement age", label: "55–64: Pre-retirement age" },
	{ value: "65+ 65+: Seniors / Elderly", label: "65+ 65+: Seniors / Elderly" }
];

export const genders = [
	{ value: 'male', label: 'Male' },
	{ value: 'female', label: 'Female' },
	{ value: 'prefer not to say', label: 'Prefer not to say' }
];