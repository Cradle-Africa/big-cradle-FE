import React, { useEffect, useState, ChangeEvent, useRef } from "react";
import countryCodes from "../../utils/data/countryCodes.json";

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
    defaultOption = "+234", 
}) => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [defaultCountry, setDefaultCountry] = useState<Country | null>(null);

    const didSetDefault = useRef(false); 

    useEffect(() => {
        const allCountries = countryCodes as Country[];
        setCountries(allCountries);

        const matchDefault = allCountries.find((c) => c.dial_code === defaultOption);
        if (matchDefault) {
            setDefaultCountry(matchDefault);
        }
    }, [defaultOption]);

    useEffect(() => {
        if (!value && defaultCountry && !didSetDefault.current) {
            const syntheticEvent = {
                target: {
                    name,
                    value: defaultCountry.dial_code,
                },
            } as unknown as ChangeEvent<HTMLSelectElement>;
            onChange(syntheticEvent);
            didSetDefault.current = true;
        }
    }, [value, defaultCountry, onChange, name]);

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
                value={value || defaultOption}
                onChange={onChange}
                className="outline-none w-full hover:cursor-pointer"
            >
                {defaultCountry && (
                    <option value={defaultCountry.dial_code}>
                        {defaultCountry.flag} {defaultCountry.dial_code} ({defaultCountry.name})
                    </option>
                )}

                {countries
                    .filter((c) => c.dial_code !== defaultOption)
                    .map((country) => (
                        <option key={country.code} value={country.dial_code}>
                            {country.flag} {country.dial_code} ({country.name})
                        </option>
                    ))}
            </select>
        </div>
    );
};

export default CountryCodeSelect;
