'use client';

import DashboardLayout from '@/app/DashboardLayout';
import { ArrowLeft, Copy, Download, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { analyseSocialMediaSchema } from '@/app/lib/validationSchemas';
import { AnalyseSocialMedia } from '@/app/lib/type';
import { useAnalyseSocialMedia } from './_features/hook';
import axios from '@/app/lib/axios';
import SocialMediaChart from '@/app/components/charts/SocialMediaChart';
import { marked } from 'marked';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import Spinner from '@/app/components/Spinner';

const SocialMediaPage = () => {
    const backParams: string = 'pipelines';
    const socialMedias = ['Instagram', 'Facebook', 'TikTok', 'Snapchat', 'Linkedin', 'x', 'Youtube'];
    const [isDownloading, setIsDownloading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AnalyseSocialMedia>({
        resolver: zodResolver(analyseSocialMediaSchema),
    });

    const { mutate, isPending, isError, error, data } = useAnalyseSocialMedia({ axios });

    const onSubmit = (data: AnalyseSocialMedia) => {
        mutate(data);
    };

    const barChartData = data?.data?.visualization?.data?.labels?.map((label: string, i: number) => ({
        name: label,
        value: data.data.visualization.data.datasets[0].data[i],
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

    return (
        <DashboardLayout>
            <div className='flex justify-center md:px-5'>
                <div className="w-full md:w-3/4 bg-gray-50 rounded-lg pt-5">
                    <div className='flex flex-nowrap justify-between px-5'>
                        <h2 className='text-xl'>Connect your social media Account to get insights</h2>
                        <Link
                            className='flex px-3 py-2 h-[35px] items-center rounded-md text-white bg-blue-600'
                            href={`/pages/flywheel?tab=${backParams}`}
                        >
                            <ArrowLeft size={14} className='mr-1 inline' /> Back
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className='relative mt-10'>
                        <div className='md:flex justify-between gap-4 px-5 pb-5'>
                            <div className="w-full md:w-1/2">
                                <label> Select the plaform </label>
                                <select
                                    {...register('platform')}
                                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 outline-none"
                                >
                                    <option value="">Select the platform</option>
                                    {socialMedias.map((platform, index) => (
                                        <option key={index} value={platform.toLowerCase()}>
                                            {platform}
                                        </option>
                                    ))}
                                </select>
                                {errors.platform && (
                                    <p className="text-red-600 text-sm mt-1">{errors.platform.message}</p>
                                )}
                            </div>

                            <div className="md:w-1/2 md:mt-0 mt-5">
                                <label> Enter your social media link </label>
                                <input
                                    {...register('link')}
                                    type="text"
                                    placeholder="https://instagram.com/username"
                                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-[6.1px] outline-none"
                                />
                                {errors.link && (
                                    <p className="text-red-600 text-sm mt-1">{errors.link.message}</p>
                                )}
                            </div>
                        </div>

                        <div className='w-full max-h-96 lg:max-h-53 xl:max-h-55 2xl:max-h-90 rounded-lg overflow-y-auto scroll-smooth'>
                            {isError && (
                                <div className="bg-gray-50 rounded-lg px-6 py-6 text-red-600 text-sm">{(error as any)?.message}</div>
                            )}

                            {data && (
                                <div className='px-5'>
                                    <div className="relative bg-gray-50 rounded-lg py-6 space-y-6">
                                        <div ref={analysisRef} className="px-6 py-6 space-y-6" id="analysis-content">
                                            <div className='avoid-break'>
                                                <h3 className="text-lg font-bold mb-2">📌 Insights</h3>

                                                <ul className='list-disc list-inside space-y-1'>
                                                    {data.data.insights.map((insight: string, index: number) => (
                                                        <p
                                                            key={index}
                                                            dangerouslySetInnerHTML={{ __html: marked.parse(insight, { async: false }) as string }}
                                                        />
                                                    ))}
                                                </ul>
                                            </div>

                                            <div style={{ pageBreakBefore: 'always' }}>
                                                <h3 className="text-lg font-bold mb-2">✅ Recommendations</h3>
                                                <ul className='list-disc list-inside space-y-1'>
                                                    {data.data.recommendations.map((rec: string, index: number) => (
                                                        <p key={index} dangerouslySetInnerHTML={{ __html: marked.parse(rec, { async: false }) as string }}></p>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                                                <h3 className="text-lg font-semibold mb-2">📊 Visualization</h3>
                                                <SocialMediaChart data={barChartData} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Cpy and download. button  */}
                        {data && (
                            <div className="flex space-x-3 pt-5 px-5">
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
                                    className="border border-gray-400 text-gray-700 px-3 py-1 rounded-md hover:cursor-pointer"
                                >
                                    {isDownloading ? (
                                        <div className='text-gray-400'>
                                            <Spinner />
                                            Downloading...
                                        </div>
                                    ) : (
                                        <>
                                            <Download size={12} className="inline mr-1" /> Download
                                        </>
                                    )}
                                </button>
                            </div>
                        )}


                        {data && (
                            <div className="relative mt-5">
                                <div className="fixed w-[90%] md:w-[54%] lg:w-[56%] xl:w-[54.5%] 2xl:w-[58.5%]  bottom-5 bg-white z-50">
                                    <div className='w-full relative'>
                                        <textarea
                                            {...register('prompt')}
                                            placeholder="Enter the analysis prompt"
                                            className="w-full h-24 bg-white border border-gray-300 rounded-lg px-3 py-2 outline-none resize-none"
                                        ></textarea>
                                        {errors.prompt && (
                                            <p className="text-red-600 text-sm mt-1">{errors.prompt.message}</p>
                                        )}

                                        <button
                                            type="submit"
                                            className="absolute top-1/2 right-5 bottom-5 z-20 flex items-center bg-blue-600 text-white px-4 py-4 rounded-md hover:bg-blue-700 hover:cursor-pointer disabled:opacity-50"
                                            disabled={isPending}
                                        >
                                            {isPending && <Spinner />}
                                            <Sparkles size={16} className="ml-2 mr-1 animate-pulse" />
                                            {isPending ? 'Analysing...' : 'Analyse'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Default textarea if no data */}
                        {!data && (
                            <div className='w-full px-5'>
                                <textarea
                                    {...register('prompt')}
                                    placeholder="Enter the analysis prompt"
                                    className="w-full h-28 bg-white border border-gray-300 rounded-md px-3 py-2 outline-none"
                                ></textarea>
                                {errors.prompt && (
                                    <p className="text-red-600 text-sm mt-1">{errors.prompt.message}</p>
                                )}

                                <button
                                    type="submit"
                                    className="mt-5 flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:cursor-pointer hover:bg-blue-700 disabled:opacity-50"
                                    disabled={isPending}
                                >
                                    {isPending && <Spinner />}
                                    <Sparkles size={16} className="ml-2 mr-1 animate-pulse" />
                                    {isPending ? 'Analysing ' : 'Analyse'}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SocialMediaPage;