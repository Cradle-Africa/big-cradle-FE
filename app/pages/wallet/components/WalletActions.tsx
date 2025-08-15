"use client";

import { Check, MoreVertical } from "lucide-react";
import { useRef } from "react";

type WalletProps = {
    index: number;
    openIndex: number | null;
    setOpenIndex: (value: number | null) => void;
    setSelectedTransaction?: () => void;
    paymentStatus?: string;
};

export default function WalletActions({
    index,
    openIndex,
    setOpenIndex,
    setSelectedTransaction,
    paymentStatus,
}: WalletProps) {
    const menuRefs = useRef<(HTMLUListElement | null)[]>([]);

    return (
        <div className="flex flex-nowrap items-center justify-between">

            {/* Right side: Menu */}
            <div
                className="whitespace-nowrap relative"
                onClick={(e) => e.stopPropagation()}
            >
                {paymentStatus !== 'paid' && (
                    <button
                        className="bg-inherit flex justify-center items-center rounded-lg cursor-pointer hover:text-white hover:rounded-full w-8 h-8 hover:bg-blue-600"
                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    >
                        <MoreVertical size={18} />
                    </button>
                )}

                {/* Dropdown */}
                {openIndex === index && (
                    <ul
                        ref={(el) => {
                            menuRefs.current[index] = el;
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onMouseLeave={() => setOpenIndex(null)}
                        className="absolute z-60 right-10 py-1 w-auto bg-white rounded-md shadow-md border border-gray-100"
                    >

                        {/* Complete payment */}
                        <li className={` ${paymentStatus === 'paid' ? 'hidden' : ''} px-2`}>

                            <button
                                onClick={setSelectedTransaction}
                                className="flex w-full px-4 py-2 text-left text-sm rounded-md text-green-700 hover:bg-green-200 hover:cursor-pointer"
                            >
                                <div className="flex items-center gap-1">
                                    <Check size={13} />
                                    Complete transaction
                                </div>
                            </button>

                        </li>
                    </ul>
                )}
            </div>
        </div>
    );
}
