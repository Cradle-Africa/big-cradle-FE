"use client";

import { Check, MoreVertical, X } from "lucide-react";
import { useRef } from "react";

type SurveyHeaderProps = {
    index: number;
    status: boolean;
    openIndex: number | null;
    setOpenIndex: (value: number | null) => void;
    onActivate?: () => void;
    onSuspend?: () => void;
    onCompletePayment?: () => void;
    paymentStatus?: 'paid' | 'not-paid';
    surveyType?: string;
};

export default function SurveyActions({
    index,
    status,
    openIndex,
    setOpenIndex,
    onSuspend,
    onActivate,
    onCompletePayment,
    paymentStatus,
    surveyType
}: SurveyHeaderProps) {
    const menuRefs = useRef<(HTMLUListElement | null)[]>([]);

    return (
        <div className="flex flex-nowrap items-center justify-between">

            {/* Right side: Menu */}
            <div
                className="whitespace-nowrap relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="bg-inherit flex justify-center items-center rounded-lg py-1 cursor-pointer hover:text-white hover:rounded-full w-8 h-8 hover:bg-blue-600"
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                    <MoreVertical size={18} />
                </button>

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
                        {/* Activate Action */}
                        <li className={` ${status === true ? 'hidden' : ''} px-2 py-1`}>
                            <button
                                onClick={onActivate}
                                className="flex w-full px-4 py-2 text-left text-sm rounded-md text-blue-700 hover:bg-blue-200 hover:cursor-pointer"
                            >
                                <div className="flex items-center gap-1">
                                    <Check size={13} />
                                    Activate survey
                                </div>
                            </button>
                        </li>

                        {/* Survey Suspend */}
                        <li className={` ${status === false ? 'hidden' : ''} px-2`}>
                            <button
                                onClick={onSuspend}
                                className="flex w-full px-4 py-2 text-left text-sm rounded-md text-red-700 hover:bg-red-200 hover:cursor-pointer"
                            >
                                <div className="flex items-center gap-1">
                                    <X size={13} />
                                    Suspend Survey
                                </div>
                            </button>
                        </li>

                        {status}

                        {/* Complete payment */}
                        <li className={` ${paymentStatus === 'paid' ? 'hidden' : ''} px-2`}>
                            {surveyType === 'internal' && (

                                <button
                                    onClick={onCompletePayment}
                                    className="flex w-full px-4 py-2 text-left text-sm rounded-md text-green-700 hover:bg-green-200 hover:cursor-pointer"
                                >
                                    <div className="flex items-center gap-1">
                                        <Check size={13} />
                                        Complete payment
                                    </div>
                                </button>
                            )}
                        </li>
                    </ul>
                )}
            </div>
        </div>
    );
}
