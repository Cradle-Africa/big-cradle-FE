"use client";

import { useEffect, useRef, useState } from "react";
import { useAnalyseData, useFetchDataPointOfDataEntries } from "../_features/hook";
import { getBusinessId } from "@/app/utils/user/userData";
import axios from "@/app/lib/axios";
import toast from "react-hot-toast";
import { Check, Copy, Download, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { handleDownloadAnalysis } from "@/app/utils/handleDownload";

interface AnalyseDataProps {
    analyseData: boolean;
    uniqueId: string;
    onClose: () => void;
}

const AnalyseData: React.FC<AnalyseDataProps> = ({ analyseData, onClose, uniqueId }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [prompt, setPrompt] = useState("");

    const businessUserId = getBusinessId() || "";
    const endpoint = "pipeline-fields-entry-attached-to-data-point";


    const mutation = useAnalyseData({ axios });

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        if (analyseData) {
            document.addEventListener("mousedown", handleOutsideClick);
        }
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [analyseData, onClose]);

    const handleSubmit = () => {
        mutation.mutate(
            {
                endpoint,
                businessUserId,
                dataPoint: uniqueId,
                prompt,
            },
            {
                onSuccess: () => {
                    toast.success("Data analysis completed successfully");
                },
                onError: (error: any) => {
                    toast.error(error?.message || "Data analysis failed");
                },
            }
        );
    };



    const getResponseContent = () => {
        try {
            const message = mutation.data?.choices?.[0]?.message?.content;
            return typeof message === "string" ? message : "No valid content returned.";
        } catch {
            return "Failed to extract response content.";
        }
    };

    const handleCopy = async () => {
        const content = getResponseContent();
        await navigator.clipboard.writeText(content);
        toast.success("Response copied to clipboard");
    };

    const handleDownload = () => {
        const content = getResponseContent();
        handleDownloadAnalysis(content);
    };

    if (!analyseData) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/40" />
            <div
                ref={modalRef}
                className="relative z-50 bg-gray-50 max-h-[90%] w-full max-w-[400px] md:max-w-[600px] xl:max-w-[900px] mx-4 md:mx-auto rounded-xl shadow-xl p-6 space-y-4"
            >
                <h2 className="text-xl font-semibold text-blue-600">Analyse Data</h2>

                {mutation.isError && (
                    <p className="text-sm text-red-600">{mutation.error?.message}</p>
                )}

                {mutation.isSuccess && (
                    <>
                        <div className=" bg-gray-100 border border-gray-300 rounded-lg p-4 max-h-60 overflow-auto text-left text-sm">
                            <strong>Response:</strong>
                            <div className="mt-2 whitespace-pre-wrap"><ReactMarkdown>{getResponseContent()}</ReactMarkdown></div>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={handleCopy}
                                className="px-3 py-1 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 cursor-pointer"
                            >
                                <Copy size={12} className="inline mr-1" /> Copy
                            </button>
                            <button
                                onClick={handleDownload}
                                className="flex items-center px-3 py-1 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 cursor-pointer"
                            >
                                <Download size={12} className="inline mr-1" /> Download
                            </button>
                        </div>
                    </>

                )}

                <textarea
                    className="w-full text-gray-700 bg-gray-100 border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                    rows={6}
                    placeholder="Enter your prompt here ..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="flex items-center px-4 py-1 text-md font-medium text-gray-700 cursor-pointer border border-gray-300 rounded-md hover:bg-gray-100"
                    >
                        <X size={13} className='inline mr-1' /> Close
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={mutation.isPending || !prompt.trim()}
                        className={`flex items-center px-4 py-1 text-md font-medium cursor-pointer text-white rounded-md ${mutation.isPending || !prompt.trim()
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        <Check size={13} className="inline mr-1" />
                        {mutation.isPending ? "Analysing..." : "Submit"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AnalyseData;
