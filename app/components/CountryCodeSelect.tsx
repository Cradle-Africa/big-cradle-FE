import React, { useEffect, useState, ChangeEvent } from "react";
import countryCodes from "../utils/data/countryCodes.json";

type Country = {
    name: string;
    dial_code: string;
    code: string;
    flag: string;
};

interface CountryCodeSelectProps {
    value: string;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    name?: string;
    className?: string;
    showLabel?: boolean;
    defaultOption?: string;
}

const CountryCodeSelect: React.FC<CountryCodeSelectProps> = ({
    value,
    onChange,
    name = "countryCode",
    className = "",
    showLabel = false,
    // defaultOption = "+234 Nigerian"
}) => {
    const [countries, setCountries] = useState<Country[]>([]);

    useEffect(() => {
        setCountries(countryCodes as Country[]);
    }, []);

    return (
        <div className={className}>
            {showLabel && (
                <label htmlFor={name} className="block mb-1 font-medium">
                    Country Code
                </label>
            )}
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className='outline-none w-full hover:cursor-pointer'
            >
                <option value="">{countryCodes[124].flag} {countryCodes[124].dial_code} ({countryCodes[124].name}) </option>
                {countries.map((country) => (
                    <option key={country.code} value={country.dial_code}>
                        {country.flag} {country.dial_code} ({country.name}) 
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CountryCodeSelect;
