"use client";
import { useState, useEffect } from "react";

const countries = [
    { code: "NG", name: "Nigeria" },
    { code: "GH", name: "Ghana" },
    { code: "RW", name: "Rwanda" },
    { code: "KE", name: "Kenya" },
    { code: "ZM", name: "Zambia" },
    { code: "TZ", name: "Tanzania" },
    { code: "MW", name: "Malawi" },
    { code: "FR", name: "France" },
    { code: "GB", name: "United Kingdom" },
    { code: "EU", name: "European Union" }
];

interface Props {
    value?: string;
    onChange: (value: string) => void;
}

export default function FlutterwaveCountrySelect({ value = "", onChange }: Props) {
    const [selected, setSelected] = useState(value);

    // Sync local state when parent changes `value`
    useEffect(() => {
        setSelected(value);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value;
        setSelected(newValue);
        onChange(newValue);
    };

    return (
        <div>
            <select
                id="country"
                value={selected}
                onChange={handleChange}
                className="border border-gray-300 rounded px-3 mt-3 py-2 w-full"
            >
                <option value="">Select country</option>
                <option>Select the country</option>
                {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                        {country.code} - {country.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
