import {
  Control,
  Controller,
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";
import AgeGroupSelect from "./AgeGroupSelect";
import { useState } from "react";
import { Country, DemographicSchema, SurveySchema } from "@/app/lib/type";
import { CountrySelect, StateSelect } from "react-country-state-city";
import ErrorMessage from "@/app/components/form/ErrorMessage";
import LocationAndDemographicTable from "./LocationAndDemographicTable";
import { Button } from "@radix-ui/themes";

type Props = {
  register: UseFormRegister<DemographicSchema>;
  control: Control<DemographicSchema>;
  errors: FieldErrors<DemographicSchema>;
  handleSubmit: UseFormHandleSubmit<DemographicSchema>;
  onSubmit: (data: DemographicSchema) => void;
};

const LocationAndDemographic = ({
  register,
  control,
  errors,
  handleSubmit,
  onSubmit,
}: Props) => {
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
                value={field.name}
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
              <h6 className="mb-2">State</h6>
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
        <Button mt="3">Add Country and City to the list</Button>
      </form>
      <LocationAndDemographicTable demographicData={[]} />
    </div>
  );
};

export default LocationAndDemographic;
