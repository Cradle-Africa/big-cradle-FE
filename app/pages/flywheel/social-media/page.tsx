
import DashboardLayout from '@/app/DashboardLayout'
import React from 'react'
import { ArrowLeft, Link2, Sparkles } from 'lucide-react'
import Link from 'next/link'

const SocialMediaPage = () => {
    const backParams: string = 'pipelines';
    const socialMedias = [
        { name: 'Instagram' },
        { name: 'Facebook' },
        { name: 'TikTok' },
        { name: 'Snapchat' },
    ]
    return (
        <div>
            <DashboardLayout>
                <div className='w-full'>
                    <div className='flex flex-nowrap mt-8 justify-between'>
                        <h2 className='text-xl'>Connect your social media Account to get insights</h2>
                        <Link
                            className='flex px-3 py-2 items-center rounded-md text-white bg-blue-600'
                            href={`/pages/flywheel?tab=${backParams}`}
                        > <ArrowLeft size={14} className='mr-1 inline' /> Back
                        </Link>
                    </div>
                    <form className="lg:w-2/4 2xl:w-3/4">
                        <select
                            className="mt-5 w-full bg-white border border-gray-300 rounded-md px-3 py-2 outline-none"
                        >
                            <option value="">Select the social media type</option>
                            {socialMedias.map((socialMedia, index) => (
                                <option key={index}>{socialMedia?.name}</option>
                            ))}
                        </select>
                        {/* <ErrorMessage>{errors.socialMediaType?.message}</ErrorMessage> */}

                        <div className='relative mt-5'>
                            {/* <label className='' >Enter the link </label> */}
                            <input
                                // {...register("socialMediaLink")}
                                type="text"
                                placeholder="Enter the link"
                                className="pl-30 w-full bg-white border border-gray-300 rounded-md px-3 py-2 outline-none"
                            />
                            <div className='absolute  lg:top-[8px] pl-4 flex gap-2 items-center justify-between'>
                                <Link2 className='' size={17} />
                                <label className=''>https://</label>
                            </div>
                        </div>

                        {/* <ErrorMessage>{errors.socialMediaLink?.message}</ErrorMessage> */}
                        <div className='flex justify-between gap-2 mt-5'>
                            <div className='w-full'>
                                <label>Start date</label>
                                <input
                                    // {...register("startDate")}
                                    type='date'
                                    placeholder="Enter Start date"
                                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 outline-none"
                                />
                                {/* <ErrorMessage>{errors.startDate?.message}</ErrorMessage> */}
                            </div>

                            <div className='w-full'>
                                <label>Start date</label>
                                <input
                                    // {...register("endDate")}
                                    type='date'
                                    placeholder="Enter end date"
                                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 outline-none"
                                />
                                {/* <ErrorMessage>{errors.endDate?.message}</ErrorMessage> */}
                            </div>

                        </div>

                        <button
                            // disabled={isPending}
                            type="submit"
                            className="mt-5 flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer disabled:opacity-50"
                        >
                            <Sparkles size={16} className="mr-1" />
                            {"Analyse"}
                        </button>
                    </form>

                </div>
            </DashboardLayout>
        </div>
    )
}

export default SocialMediaPage
