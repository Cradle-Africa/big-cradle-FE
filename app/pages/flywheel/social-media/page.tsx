'use client';

import DashboardLayout from '@/app/DashboardLayout';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { analyseSocialMediaSchema } from '@/app/lib/validationSchemas';
import { AnalyseSocialMedia } from '@/app/lib/type';
import { useAnalyseSocialMedia } from './_features/hook';
import axios from "@/app/lib/axios";

const SocialMediaPage = () => {
    const backParams: string = 'pipelines';
    const socialMedias = ['Instagram', 'Facebook', 'TikTok', 'Snapchat', 'Linkedin'];

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AnalyseSocialMedia>({
        resolver: zodResolver(analyseSocialMediaSchema),
    });

    const { mutate, isPending, isError, error, data } = useAnalyseSocialMedia({ axios: axios });

    const onSubmit = (data: AnalyseSocialMedia) => {
        mutate(data);
    };

    const getResponseContent = () => {
        try {
            const message = data?.data?.choices?.[0]?.message?.content;
            console.log('RESPONSE: ', message);
            return typeof message === "string" ? message : "No valid content returned.";
        } catch (err) {
            console.error('Error extracting message:', err);
            return "Failed to extract response content.";
        }
    };

    return (
        <div>
            <DashboardLayout>
                <div className='flex justify-center '>
                    <div className="w-full md:w-3/4">
                        <div className='flex flex-nowrap mt-5 justify-between'>
                            <h2 className='text-xl'>Connect your social media Account to get insights</h2>
                            <Link
                                className='flex px-3 py-2 h-[35px] items-center rounded-md text-white bg-blue-600'
                                href={`/pages/flywheel?tab=${backParams}`}
                            >
                                <ArrowLeft size={14} className='mr-1 inline' /> Back
                            </Link>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className='relative mt-14' >
                            <div className='md:flex justify-between gap-2'>
                                <div className="w-full md:w-1/2">
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
                                    <input
                                        {...register('link')}
                                        type="text"
                                        placeholder="Enter the link"
                                        className="w-full bg-white border border-gray-300 rounded-md px-3 py-[6.5px] outline-none"
                                    />
                                    {errors.link && (
                                        <p className="text-red-600 text-sm mt-1">{errors.link.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className='mt-5 w-full'>
                                {isError && (
                                    <div className="bg-gray-50 rounded-lg px-6 py-6 text-red-600 text-sm">{(error as any)?.message}</div>
                                )}

                                {data && (
                                    <div className=" bg-gray-50 rounded-lg px-6 py-6">
                                        {getResponseContent()}
                                    </div>
                                )}
                            </div>

                            <div className='w-full mt-5'>
                                <textarea
                                    {...register('prompt')}
                                    placeholder="Enter the analysis prompt"
                                    className="w-full h-28 bg-white border border-gray-300 rounded-md px-3 p-2 outline-none"
                                >
                                </textarea>
                                {errors.prompt && (
                                    <p className="text-red-600 text-sm mt-1">{errors.prompt.message}</p>
                                )}

                                <button
                                    type="submit"
                                    className="mt-5 flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 hover:cursor-pointer"
                                    disabled={isPending}
                                >
                                    <Sparkles size={16} className="mr-1 animate-pulse" />
                                    {isPending ? 'Analysing...' : 'Analyse'}
                                </button>

                            </div>
                        </form>
                    </div>

                </div>
            </DashboardLayout >
        </div >
    );
};

export default SocialMediaPage;
