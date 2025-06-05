'use client'
import React from 'react'
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const CampaignPerformance = () => {
    const pathname = usePathname();
    return (
        <div className="overflow-x-auto w-full mt-5 rounded-md border border-gray-100 px-5 py-5">
            <div className='flex justify-between items-center mb-4'>
                <h2 className="text-md text-gray-700 font-semibold mb-4">Campaign Performance</h2>
                { pathname !== '/analytics/campaign-performance' && (
                    <div className="flex items-center gap-1 text-sm underline text-[#0023E8]">
                        <Link href='/analytics/campaign-performance'> View all</Link>
                        <ArrowRight size={15}/>
                    </div>
                )}
            </div>

            <table className="min-w-full divide-y divide-gray-200">
                <thead className="">
                    <tr className='bg-gray-100'>
                        <th className="rounded-tl-lg border-r border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Campaign Name</th>
                        <th className="border-r border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Org</th>
                        <th className="border-r border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Completion Rate</th>
                        <th className="border-r border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Responses</th>
                        <th className="rounded-tr-lg border-l border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Avg Sentiment</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Youth Trends 25</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">DevSpark NG</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">89%</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">1,220</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">4.6</td>

                    </tr>
                    <tr>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Retail POS Trial</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">ShopAssist</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">92%</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">980</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">3.9</td>

                    </tr>
                    <tr>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Delivery Feedback</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">GoBuy Rwanda</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">65%</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">878</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">3.2</td>

                    </tr>
                </tbody>
            </table>
        </div>

    )
}

export default CampaignPerformance
