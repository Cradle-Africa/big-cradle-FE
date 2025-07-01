import ErrorMessage from "@/app/components/form/ErrorMessage";
import { Country, CountryAndCity, DemographicSchema } from "@/app/lib/type";
import { Button } from "@radix-ui/themes";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CountrySelect, StateSelect } from "react-country-state-city";
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
  onNextClicked : () => void;
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
  const [country, setCountry] = useState<Country | null>(null);

  return (
    <div className="my-8 flex flex-col gap-4 max-w-3xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <AgeGroupSelect registration={register("ageDemographics")} />
        <ErrorMessage>{errors.ageDemographics?.message}</ErrorMessage>
        <Controller
          control={control}
          name="country"
          render={({ field }) => (
            <div>
              <h6 className="mb-2">Country</h6>
              <CountrySelect
                className="mb-1"
                inputClassName=""
                onChange={(_country: any) => {
                  console.log(_country);
                  field.onChange(_country.name);
                  setCountry(_country);
                }}
                onTextChange={(_txt) => console.log(_txt)}
                value={"field.name"}
                placeHolder="Select Country"
              />
              <ErrorMessage>{errors.country?.message}</ErrorMessage>
            </div>
          )}
        />

        <Controller
          control={control}
          name="city"
          render={({ field }) => (
            <div>
              <h6 className="mb-2 mt-4">State</h6>
              <StateSelect
                className="mb-1"
                countryid={country?.id!}
                containerClassName="form-group"
                inputClassName=""
                onChange={(_city: any) => {
                  console.log(JSON.stringify(_city));
                  field.onChange(_city.name);
                  setCountry(_city);
                }}
                onTextChange={(_txt) => console.log(_txt)}
                // defaultValue={currentState}
                placeHolder="Select State"
                value={field.name}
              />
              <ErrorMessage>{errors.city?.message}</ErrorMessage>
            </div>
          )}
        />
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
