"use client";
import { useState, useEffect } from "react";

const countries = [
  { code: "NG", name: "Nigeria" },          // NGN
  { code: "GB", name: "United Kingdom" },   // GBP
  { code: "EU", name: "European Union" },   // EUR
  { code: "GH", name: "Ghana" },            // GHS
  { code: "RW", name: "Rwanda" },           // RWF
  { code: "KE", name: "Kenya" },            // KES
  { code: "ZM", name: "Zambia" },           // ZMW
  { code: "TZ", name: "Tanzania" },         // TZS
  { code: "MW", name: "Malawi" },           // MWK
  { code: "XO", name: "West African CFA" }, // XOF
  { code: "UG", name: "Uganda" },           // UGX
  { code: "ET", name: "Ethiopia" }          // ETB
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
