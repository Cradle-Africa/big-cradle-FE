"use client";

import axios from "@/app/lib/axios";
import { useFetchSinglePipeline } from "../_features/hook";
import { X, ArrowDownUp, Share2 } from "lucide-react";
import Link from 'next/link'

interface PopUpProps {
    shareDataPoint: boolean;
    onClose: () => void;
    uniqueId: string;
}

const ShareDataPoint: React.FC<PopUpProps> = ({
    shareDataPoint,
    onClose,
    uniqueId,
}) => {
    const { isLoading } = useFetchSinglePipeline({
        axios,
        id: uniqueId,
        enabled: shareDataPoint,
    });

    if (!shareDataPoint ) return ( null )
    return (
            <>
                <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />

                <div className="fixed z-50 inset-0 flex items-center justify-center px-4">
                    <div className="relative w-full bg-white rounded-xl shadow-xl max-w-2xl p-5">
                        <button
                            onClick={onClose}
                            className="absolute top-8 right-7 text-gray-400 hover:text-blue-600 cursor-pointer text-xl"
                        >
                            <X />
                        </button>

                        <h2 className="text-blue-600 text-xl font-semibold mb-6 flex items-center gap-2">
                            <ArrowDownUp size={20} /> Share Data Point
                        </h2>
                        {isLoading ? (
                            <p className="text-gray-500">Loading...</p>
                        ) : (
                            <>
                                <div className="w-full border border-gray-200 rounded-lg px-8 py-8">
                                    <Link 
                                        href=" http://localhost:3000/pages/flywheel/data-entry"
                                    >
                                        http://localhost:3000/pages/flywheel/data-entry
                                    </Link>
                                </div>

                                <div className="pt-2 border-t border-gray-200 mt-6">
                                    <button
                                        type="button"
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium cursor-pointer"
                                        onClick={() => {
                                            console.log("Edit clicked for ID:", uniqueId);
                                        }}
                                    >
                                       <Share2 className="inline" size={14}/> <span className="pt-2">Share Data Point</span>
                                    </button>
                                </div>
                            </>

                        )}

                    </div>
                </div>
            </>
        
    );
};

export default ShareDataPoint;
