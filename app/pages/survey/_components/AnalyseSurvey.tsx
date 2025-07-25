"use client";

import { useRef, useState } from "react";
import axios from "@/app/lib/axios";
import toast from "react-hot-toast";
import { Check, Copy, Download, X } from "lucide-react";
import Spinner from "@/app/components/Spinner";
import { marked } from "marked";
import AnalyseDataChart from "@/app/components/charts/AnalyseDataChart";
import { useAnalyseSurveyData } from "../_features/hooks";

interface AnalyseSurveyDataProps {
  analyseData: boolean;
  uniqueId: string;
  onClose: () => void;
}

const AnalyseSurveyData: React.FC<AnalyseSurveyDataProps> = ({
  analyseData,
  onClose,
  uniqueId,
}) => {
  const [structuredData, setStructuredData] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const mutation = useAnalyseSurveyData({ axios });

  const handleSubmit = () => {
    mutation.mutate(
      { surveyId: uniqueId },
      {
        onSuccess: (res) => {
          toast.success("Data analysis completed successfully");
          try {
            const data = res?.insights ?? res?.data?.insights;
            setStructuredData(data);
          } catch (err) {
            console.error(err);
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

  const chartData =
    structuredData?.visualization?.data?.labels?.map((label: string, i: number) => ({
      name: label,
      value: structuredData.visualization.data.datasets[0].data[i],
    })) || [];

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
          margin: 0.5,
          filename: "data-analysis-report.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: "#fff",
            onclone: (doc: Document) => {
              doc.querySelectorAll<HTMLElement>("*").forEach((el) => {
                const style = window.getComputedStyle(el);
                if (style.color.includes("oklch")) el.style.color = "#333";
                if (style.backgroundColor.includes("oklch")) el.style.backgroundColor = "#fff";
                el.style.breakInside = "avoid";
                el.style.pageBreakInside = "avoid";
              });
            },
          },
          jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        })
        .from(analysisRef.current)
        .save();

      toast.success("Download complete", { id: loadingToast });
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF", { id: loadingToast });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopy = async () => {
    const content = document.getElementById("analysis-content")?.innerText || "";
    await navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  };

  if (!analyseData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/10">
      <div className="relative z-50 bg-gray-50 max-h-[98%] px-5 py-5 w-full h-screen max-w-full mx-4 md:mx-auto rounded-xl shadow-xl space-y-4">
        <div>
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold text-blue-600">Analyse Data</h2>
            <button onClick={onClose}>
              <X size={20} className="text-red-500 hover:cursor-pointer" />
            </button>
          </div>

          {mutation.isError && (
            <p className="text-sm text-red-600">{mutation.error?.message}</p>
          )}

          {mutation.isSuccess && structuredData && (
            <>
              <div className="bg-gray-100 rounded-lg p-8 text-left text-md mt-3">
                <strong>Response:</strong>
                <div className="mt-5 whitespace-pre-wrap max-h-[60vh] overflow-y-auto">
                  <div ref={analysisRef} className="space-y-10 text-md" id="analysis-content">
                    {/* 📌 Insights */}
                    <section>
                      <h3 className="text-lg font-semibold mb-4">📌 Insights</h3>
                      <div className="space-y-2">
                        {structuredData?.insights?.map((insight: string, i: number) => (
                          <p
                            key={i}
                            className="text-gray-800"
                            dangerouslySetInnerHTML={{
                              __html: marked.parse(insight, { async: false }) as string,
                            }}
                          />
                        ))}
                      </div>
                    </section>

                    {/* ✅ Recommendations */}
                    {structuredData?.recommendations?.length > 0 && (
                      <section>
                        <h3 className="text-lg font-semibold mb-4">✅ Recommendations</h3>
                        <div className="space-y-2">
                          {structuredData.recommendations.map((rec: string, i: number) => (
                            <p
                              key={i}
                              className="text-gray-800"
                              dangerouslySetInnerHTML={{
                                __html: marked.parse(rec, { async: false }) as string,
                              }}
                            />
                          ))}
                        </div>
                      </section>
                    )}

                    {/* 📊 Visualization */}
                    {structuredData?.visualization?.data && (
                      <section>
                        <h3 className="text-lg font-semibold mb-4">📊 Visualization</h3>
                        <div className="w-full h-80">
                          <AnalyseDataChart data={chartData} />
                        </div>
                      </section>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-3">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-1 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  <Copy size={12} className="inline mr-1" /> Copy
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="flex items-center px-3 py-1 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50"
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

          <div className="absolute bottom-3 left-0 w-full px-6">
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="flex items-center px-4 py-1 text-md font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                <X size={13} className="inline mr-1" /> Close
              </button>
              <button
                onClick={handleSubmit}
                className={`flex gap-2 items-center px-4 py-1 text-md font-medium text-white rounded-md hover:cursor-pointer ${
                  mutation.isPending
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {mutation.isPending ? <Spinner /> : <Check size={13} className="inline" />}
                {mutation.isPending ? " Analysing... " : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyseSurveyData;
