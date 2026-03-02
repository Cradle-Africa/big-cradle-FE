"use client";

import { CreditCard, Coins } from 'lucide-react';
import { PaymentProvider } from '@/app/lib/type';

interface Props {
    selected: PaymentProvider;
    onChange: (provider: PaymentProvider) => void;
}

const providers = [
    {
        id: 'flutterwave' as PaymentProvider,
        name: 'Card / Bank',
        description: 'Pay in local currency (Flutterwave)',
        icon: CreditCard,
    },
    {
        id: 'kuvarpay' as PaymentProvider,
        name: 'Crypto',
        description: 'Pay in USDT (KuvarPay)',
        icon: Coins,
    },
];

export default function PaymentProviderSelector({ selected, onChange }: Props) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Payment method</label>
            <div className="grid grid-cols-2 gap-4">
                {providers.map((provider) => {
                    const Icon = provider.icon;
                    const isSelected = selected === provider.id;
                    return (
                        <button
                            key={provider.id}
                            type="button"
                            onClick={() => onChange(provider.id)}
                            className={`
                                flex flex-col items-center p-4 rounded-lg border-2 transition-all cursor-pointer
                                ${isSelected
                                    ? 'border-blue-600 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300 bg-white'}
                            `}
                        >
                            <Icon
                                size={24}
                                className={isSelected ? 'text-blue-600' : 'text-gray-500'}
                            />
                            <span className={`mt-2 font-medium ${isSelected ? 'text-blue-600' : 'text-gray-900'}`}>
                                {provider.name}
                            </span>
                            <span className="text-xs text-gray-500 mt-1">
                                {provider.description}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
