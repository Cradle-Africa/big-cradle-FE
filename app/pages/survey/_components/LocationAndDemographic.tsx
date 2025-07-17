"use client";


import ErrorMessage from "@/app/components/form/ErrorMessage";
import { Country, CountryAndCity, DemographicSchema, State } from "@/app/lib/type";
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
} from "react-hook-form";
import AgeGroupSelect from "./AgeGroupSelect";
import LocationAndDemographicTable from "./LocationAndDemographicTable";


type Props = {
  register: UseFormRegister<DemographicSchema>;
  control: Control<DemographicSchema>;
  errors: FieldErrors<DemographicSchema>;
  handleSubmit: UseFormHandleSubmit<DemographicSchema>;
  onSubmit: (data: DemographicSchema) => void;
  countryAndCitiesList: CountryAndCity[];
  onDeleteClick: (val: CountryAndCity) => void;
  onNextClicked: () => void;
  // setCountriesAndCities: React.Dispatch<React.SetStateAction<CountryAndCity[]>>;
  // onAddCountryClicked : (val : CountryAndCity) => void;
};

const LocationAndDemographic = ({
  register,
  control,
  errors,
  handleSubmit,
  onSubmit,
  countryAndCitiesList,
  onDeleteClick,
  onNextClicked,
}: // setCountriesAndCities,
  Props) => {
  const router = useRouter();
  const [country, setCountry] = useState<Country | null>(null);
  const [state, setState] = useState<State | null>(null);

  return (
    <div className="my-8 flex flex-col gap-4 max-w-3xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>

        <IconButton type="button" onClick={() => router.back()}>
          <ArrowLeft />
        </IconButton>

        <p className="mt-5 mb-8">
          Please enter the age demographic for your survey participants. This information will help ensure that your survey reaches the right audience.
        </p>

        <div className="flex justify-between gap-4">
          <Controller
            control={control}
            name="country"
            render={({ field }) => (
              <div className="w-1/2">
                <h6 className="mb-2">Country</h6>
                <CountrySelect
                  className="mb-1 border-none"
                  containerClassName="relative w-full !border-none"
                  inputClassName="w-full !border-none rounded-md px-3 !py-1 pr-10 outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(_country: any) => {
                    // console.log(_country);
                    field.onChange(_country.name);
                    setCountry(_country);
                    setState(null);
                  }}
                  onTextChange={(_txt) => console.log(_txt)}
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
              <div className="w-1/2">
                <h6 className="mb-2">State</h6>
                <StateSelect
                  className="mb-1 border-none"
                  containerClassName="relative w-full !border-none"
                  inputClassName="w-full !border-none rounded-md px-3 !py-1 pr-10 outline-none focus:ring-2 focus:ring-blue-500"
                  countryid={country?.id!}
                  onChange={(_state: any) => {
                    // console.log('State', _state);
                    field.onChange(_state.name);
                    setState(_state);
                  }}
                  onTextChange={(_txt) => console.log(_txt)}
                  placeHolder="Select State"
                  value={field.name}
                />
                <ErrorMessage>{errors.state?.message}</ErrorMessage>
              </div>
            )}
          />
        </div>

        <div className="flex justify-between gap-4">
          <Controller
            control={control}
            name="city"
            render={({ field }) => (
              <div className="w-1/2">
                <h6 className="mb-2 mt-4">City</h6>
                <CitySelect
                  className="mb-1 border-none"
                  containerClassName="relative w-full !border-none"
                  inputClassName="w-full !border-none rounded-md px-3 !py-1 pr-10 outline-none focus:ring-2 focus:ring-blue-500"
                  countryid={country?.id!}
                  stateid={state?.id!}
                  onChange={(_city: any) => {
                    // console.log('City:', _city);
                    field.onChange(_city.name);
                  }}
                  onTextChange={(_txt) => console.log(_txt)}
                  placeHolder="Select city"
                  value={field.value}
                />
                <ErrorMessage>{errors.city?.message}</ErrorMessage>
              </div>
            )}
          />

          <div className="w-1/2">
            <AgeGroupSelect registration={register("ageDemographics")} />
            <ErrorMessage>{errors.ageDemographics?.message}</ErrorMessage>
          </div>
        </div>



        <Button variant="outline" mt="4" mb="6">
          <Plus />
          <span>Add Country and City to the list</span>
        </Button>
        <LocationAndDemographicTable
          demographicData={countryAndCitiesList}
          onDeleteClick={onDeleteClick}
        />
        <Button type="button" mt="3" onClick={onNextClicked}>
          <span className="px-4">Next</span>
        </Button>
      </form>
    </div>
  );
};

export default LocationAndDemographic;
