"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Copy, Download, X } from "lucide-react";
import Spinner from "@/app/components/Spinner";
import { marked } from "marked";
import AnalyseDataChart from "@/app/components/charts/AnalyseDataChart";

interface AnalyseSurveyDataProps {
	analyseData: boolean;
	onClose: () => void;
	structuredData: any;
	mutation: any;
}

const AnalyseSurveyData: React.FC<AnalyseSurveyDataProps> = ({
	analyseData,
	onClose,
	structuredData,
	mutation
}) => {
	

	const chartData =
		structuredData?.visualization?.data?.labels?.map((label: string, i: number) => ({
			name: label,
			value: structuredData.visualization.data.datasets[0].data[i],
		})) || [];

	const analysisRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);

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
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AnalyseSurveyData;
