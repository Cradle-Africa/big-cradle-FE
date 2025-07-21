"use client";

import { useRef, useState } from "react";
import { getBusinessId } from "@/app/utils/user/userData";
import axios from "@/app/lib/axios";
import toast from "react-hot-toast";
import { Check, Copy, Download, X } from "lucide-react";
import Spinner from "@/app/components/Spinner";
import { marked } from "marked";
import AnalyseDataChart from "@/app/components/charts/AnalyseDataChart";
import { useAnalyseData } from "../_features/hooks";

interface AnalyseDataProps {
    analyseData: boolean;
    uniqueId: string;
    onClose: () => void;
}

const AnalyseData: React.FC<AnalyseDataProps> = ({ analyseData, onClose, uniqueId }) => {
    const [prompt, setPrompt] = useState("");
    const [structuredData, setStructuredData] = useState<any>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const businessUserId = getBusinessId() || "";
    const endpoint = "pipeline-fields-entry-attached-to-data-point";

    const mutation = useAnalyseData({ axios });

    const handleSubmit = () => {
        mutation.mutate(
            {
                endpoint,
                businessUserId,
                dataPoint: uniqueId,
                prompt,
            },
            {
                onSuccess: (data) => {
                    toast.success("Data analysis completed successfully");
                    try {
                        setStructuredData(data);
                    } catch (err) {
                        console.log(err);
                        toast.error("Failed to parse response");
                        setStructuredData(null);
                    }
                },
                onError: (error: any) => {
                    toast.error(error?.message || "Data analysis failed");
                },
            }
        );
    };

    const chartData = structuredData?.visualization?.data?.labels?.map(
        (label: string, index: number) => ({
            name: label,
            value: structuredData.visualization.data.datasets[0].data[index],
        })
    ) || [];


    const analysisRef = useRef<HTMLDivElement>(null);
    const handleDownload = async () => {
        if (!analysisRef.current) {
            toast.error("No content available for download");
            return;
        }

        setIsDownloading(true);
        const loadingToast = toast.loading("Preparing download...");

        try {
            const html2pdf = (await import("html2pdf.js")).default;

            await html2pdf()
                .set({
                    margin: [0.5, 0.5, 0.5, 0.5],
                    filename: "data-analysis-report.pdf",
                    image: { type: "jpeg", quality: 0.98 },
                    html2canvas: {
                        scale: 2,
                        useCORS: true,
                        backgroundColor: "#ffffff",
                        onclone: (clonedDoc: Document) => {
                            const allElements = clonedDoc.querySelectorAll<HTMLElement>("*");
                            allElements.forEach((el) => {
                                const style = window.getComputedStyle(el);
                                if (style.color.includes("oklch")) el.style.color = "#333333";
                                if (style.backgroundColor.includes("oklch")) el.style.backgroundColor = "#ffffff";
                                if (style.borderColor?.includes("oklch")) el.style.borderColor = "#cccccc";
                                if (style.fill?.includes("oklch")) el.style.fill = "#578CFF";
                                if (style.stroke?.includes("oklch")) el.style.stroke = "#578CFF";

                                // 💡 Prevent content from being cut mid-element
                                el.style.breakInside = "avoid";
                                el.style.pageBreakInside = "avoid";
                                el.style.overflowWrap = "break-word";
                            });
                        },
                    },
                    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }, // Ensure page breaks are handled correctly
                    jsPDF: {
                        unit: "in",
                        format: "a4",
                        orientation: "portrait",
                    },
                })
                .from(analysisRef.current)
                .save();

            toast.success("Download complete!", { id: loadingToast });
        } catch (error) {
            console.error("PDF generation failed:", error);
            toast.error("Failed to generate PDF", { id: loadingToast });
        } finally {
            setIsDownloading(false);
        }
    };



    const handleCopy = async () => {
        const content = document.getElementById('analysis-content')?.innerText || '';
        await navigator.clipboard.writeText(content);
        toast.success("Response copied to clipboard");
    };


    if (!analyseData) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="relative z-50 bg-gray-50 max-h-[98%] px-5 lg:px-20 py-5 w-full h-screen ma-w-[500px] m:max-w-[700px] x:max-w-[1000px] mx-4 md:mx-auto rounded-xl shadow-xl p-6 space-y-4"
            >
                <div>
                    <div className="flex justify-between">
                        <h2 className="text-xl font-semibold text-blue-600">Analyse Data</h2>
                        <button onClick={() => onClose()} >
                            <X size={20} className="text-red-500 mr-1 hover:cursor-pointer" />
                        </button>
                    </div>

                    {mutation.isError && (
                        <p className="text-sm text-red-600">{mutation.error?.message}</p>
                    )}

                    {mutation.isSuccess && (
                        <>
                            <div className="bg-gray-100 rounded-lg p-8 text-left text-md mt-3">
                                <strong>Response:</strong>
                                <div className="mt-5 whitespace-pre-wrap max-h-80 overflow-auto">
                                    <div ref={analysisRef} className="space-y-6 text-md" id="analysis-content">
                                        {/* Insights */}
                                        {/* <div className="avoid-break"> */}
                                        <div>

                                            <h3 className="text-base font-semibold mb-5">📌 Insights</h3>
                                            <ul className="list-disc list-inside pl-4 space-y-1">
                                                {structuredData?.insights?.map((insight: string, index: number) => (
                                                    <p
                                                        key={index}
                                                        className="text-gray-800"
                                                        dangerouslySetInnerHTML={{ __html: marked.parse(insight, { async: false }) as string }}
                                                    />
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Recommendations */}
                                        <div style={{ pageBreakBefore: 'always' }}>
                                            <h3 className="text-base font-semibold mb-1">✅ Recommendations</h3>
                                            <ul className="list-disc list-inside pl-4 space-y-1">
                                                {structuredData?.recommendations?.map((rec: string, index: number) => (
                                                    <p
                                                        key={index}
                                                        className="text-gray-800"
                                                        dangerouslySetInnerHTML={{ __html: marked.parse(rec, { async: false }) as string }}
                                                    />
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Visualization */}
                                        <div className="page-break" style={{ pageBreakBefore: 'always' }}>
                                            <h3 className="text-base font-semibold mb-5">📊 Visualization</h3>
                                            <div className="w-full h-80">
                                                <AnalyseDataChart data={chartData} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex space-x-3 mt-3">
                                <button
                                    type="button"
                                    onClick={handleCopy}
                                    className="px-3 py-1 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 cursor-pointer"
                                >
                                    <Copy size={12} className="inline mr-1" /> Copy
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDownload}
                                    disabled={isDownloading}
                                    className="flex items-center px-3 py-1 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 cursor-pointer disabled:opacity-50"
                                >
                                    {isDownloading ? (
                                        <>
                                            <Spinner />
                                            Downloading...
                                        </>
                                    ) : (
                                        <>
                                            <Download size={12} className="inline mr-1" /> Download
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    )}

                    <div className="absolute w-[87.7%] bottom-3">
                        <textarea
                            className="w-full h-24 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg p-3 text-md outline-none resize-none"
                            rows={6}
                            placeholder="Enter your prompt here ..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />

                        <div className="flex justify-end space-x-3 mt-3">
                            <button
                                onClick={onClose}
                                className="flex items-center px-4 py-1 text-md font-medium text-gray-700 cursor-pointer border border-gray-300 rounded-md hover:bg-gray-100"
                            >
                                <X size={13} className='inline mr-1' /> Close
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={mutation.isPending || !prompt.trim()}
                                className={`flex gap-2 items-center px-4 py-1 text-md font-medium cursor-pointer text-white rounded-md ${mutation.isPending || !prompt.trim()
                                    ? "bg-blue-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                            >
                                {mutation.isPending && (<Spinner />)}
                                {!mutation.isPending && (<Check size={13} className="inline ml-2 mr-1" />)}
                                {mutation.isPending ? " Analysing... " : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyseData;