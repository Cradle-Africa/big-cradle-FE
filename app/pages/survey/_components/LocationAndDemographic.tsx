"use client";

import ErrorMessage from "@/app/components/form/ErrorMessage";
import { Country, CountryAndCity, DemographicFormValues, DemographicSubmitValues, State } from "@/app/lib/type";
import { Button, IconButton } from "@radix-ui/themes";
import { ArrowLeft, Plus } from "lucide-react";
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

type Props = {
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
    <div className="my-8 flex flex-col gap-4 max-w-3xl mx-auto">
      <form onSubmit={handleSubmit(handleAddDemographic)}>
        <IconButton type="button" onClick={() => router.back()}>
          <ArrowLeft />
        </IconButton>

        <p className="mt-5 mb-8">
          Please select demographic criteria for your survey participants.
        </p>

        <div className="flex justify-between gap-4">
          <Controller
            control={control}
            name="country"
            render={({ field }) => (
              <div className="w-1/3">
                <h6 className="mb-2">Country</h6>
                <CountrySelect
                  className="mb-1 border-none"
                  containerClassName="relative w-full !border-none"
                  inputClassName="w-full !border-none rounded-md px-3 !py-1 pr-10 outline-none focus:ring-2 focus:ring-blue-500"
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

          <Controller
            control={control}
            name="state"
            render={({ field }) => (
              <div className="w-1/3">
                <h6 className="mb-2">State</h6>
                <StateSelect
                  className="mb-1 border-none"
                  containerClassName="relative w-full !border-none"
                  inputClassName="w-full !border-none rounded-md px-3 !py-1 pr-10 outline-none focus:ring-2 focus:ring-blue-500"
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
              <div className="w-1/3">
                <h6 className="mb-2">City</h6>
                <CitySelect
                  className="mb-1 border-none"
                  containerClassName="relative w-full !border-none"
                  inputClassName="w-full !border-none rounded-md px-3 !py-1 pr-10 outline-none focus:ring-2 focus:ring-blue-500"
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

        <div className="flex justify-between gap-4 mt-4">
          <div className="w-1/2">
            <h6 className="mb-2">Age Group</h6>
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
                />
              )}
            />

            <ErrorMessage>{errors.ageDemographics?.message}</ErrorMessage>
          </div>

          <div className="w-1/2">
            <h6 className="mb-2">Gender</h6>

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
                />
              )}
            />
            <ErrorMessage>{errors.gender?.message}</ErrorMessage>
          </div>
        </div>

        <Button type="submit" variant="outline" mt="4" mb="6">
          <Plus />
          <span>Add Demographic Selection</span>
        </Button>
      </form>

      {/* Combined Table for Locations and Demographics */}
      <LocationAndDemographicTable
        locationData={countryAndCitiesList}
        demographicData={demographicSelections}
        onDeleteLocation={onDeleteClick}
        onDeleteDemographic={handleDeleteDemographic}
      />

      <div className="w-1/4">
        <Button
          type="button"
          mt="3"
          onClick={() => {
            handleFormSubmit();
            onNextClicked();
          }}
        >
          <span className="px-4">Next</span>
        </Button>
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