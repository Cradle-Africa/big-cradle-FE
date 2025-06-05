'use client'
import React from 'react'
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const DataUploadMetrics = () => {
    const pathname = usePathname();
    return (
        <div className="overflow-x-auto w-full mt-5 rounded-md border border-gray-100 px-5 py-5">
            <div className='flex justify-between items-center mb-4'>
                <h2 className="text-md text-gray-700 font-semibold mb-4">Data Upload Metrics</h2>
                { pathname !== '/analytics/data-upload-metrics' && (
                    <div className="flex items-center gap-1 text-sm underline text-[#0023E8]">
                        <Link href='/analytics/data-upload-metrics'> View all</Link>
                        <ArrowRight size={15}/>
                    </div>
                )}
            </div>

            <table className="min-w-full divide-y divide-gray-200">
                <thead className="">
                    <tr className='bg-gray-100'>
                        <th className="rounded-tl-lg border-r border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Organisation</th>
                        <th className="border-r border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Uploads</th>
                        <th className="border-r border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Validation Rate</th>
                        <th className="rounded-tr-lg border-l border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">Linked Tasks</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">AgriBase Africa</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">12</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">89%</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">4</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">EduServe Hub</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">9</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">92</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">3</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">KudaTech NG</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">7</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">65</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">2</td>
                    </tr>
                </tbody>
            </table>
        </div>

    )
}

export default DataUploadMetrics
