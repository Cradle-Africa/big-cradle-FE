import React, { useEffect, useState, ChangeEvent } from "react";
import countryData from "../../utils/data/countries.json";

type Country = {
    name: string;
    country_code: string;
};

interface CountrySelectProps {
    value: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    name?: string;
    className?: string;
    showLabel?: boolean;
    defaultOption?: string;
}

const CountrySelect: React.FC<CountrySelectProps> = ({
    value,
    onChange,
    name = "",
    className = "",
    showLabel = false,
    defaultOption = "Select country",
}) => {
    const [countries, setCountries] = useState<Country[]>([]);

    useEffect(() => {
        setCountries(countryData as Country[]);
    }, []);

    return (
        <div className={className}>
            {showLabel && (
                <label htmlFor={name} className="block mb-1 font-medium">
                    Country
                </label>
            )}
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className="outline-none w-full hover:cursor-pointer"
            >
                {/* Render default option */}
                {defaultOption && (
                    <option value="" disabled>
                        {defaultOption}
                    </option>
                )}

                {/* Render countries */}
                {countries.map((country) => (
                    <option key={country.country_code} value={country.name}>
                        {country.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CountrySelect;
