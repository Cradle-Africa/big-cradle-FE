"use client";

import { UseFormRegisterReturn } from 'react-hook-form';

interface Props {
    currency: string;
    register?: UseFormRegisterReturn;
    value?: number | string;
    onChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

export default function AmountInput({
    currency,
    register,
    value,
    onChange,
    placeholder = "Amount",
    disabled = false
}: Props) {
    return (
        <div className="relative">
            <input
                {...register}
                type="text"
                value={value !== undefined ? value : undefined}
                onChange={onChange ? (e) => onChange(e.target.value) : undefined}
                placeholder={placeholder}
                disabled={disabled}
                className="w-full border border-gray-300 rounded px-3 py-2 pr-16 outline-none"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                {currency}
            </span>
        </div>
    );
}
