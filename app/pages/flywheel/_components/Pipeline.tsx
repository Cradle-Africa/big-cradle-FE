"use client";

import { MoreVertical } from "lucide-react";
const Pipeline = () => {
    return (
        <div className="overflow-x-auto rounded-[8px] mt-10 border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 rounded-[8px] ">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold">
                            #
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">
                            Data point name
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">
                            Fields
                        </th>


                        <th className="px-6 py-3 text-left text-sm font-semibold">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-700">
                    {[...Array(3)].map((_, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4 align-top">
                                {index + 1}
                            </td>
                            <td className="px-6 py-4 align-top">
                                Impact of use of digital technologies in the ...
                            </td>

                            <td className="px-6 py-4 align-top">
                                <table className="w-full">
                                    <tbody>
                                        <tr>
                                            <td className="py-2 text-left text-sm min-w-[100px]">First name</td>
                                            <td className="px-6 py-2 text-left text-sm min-w-[100px]">Required</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 text-left text-sm min-w-[100px]">Gender</td>
                                            <td className="px-6 py-2 text-left text-sm min-w-[100px]">Required</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 text-left text-sm min-w-[100px]">Options</td>
                                            <td colSpan={2} className="px-3 py-2 mt-3 text-left text-sm">
                                                <ul className="list-disc pl-5">
                                                    <li>Male</li>
                                                    <li>Female</li>
                                                </ul>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>

                            <td className="px-6 py-4 align-top">
                                <MoreVertical
                                    size={30}
                                    className="cursor-pointer hover:bg-gray-100 hover:rounded-lg px-2 py-1"
                                />
                            </td>
                        </tr>

                    ))}
                </tbody>
            </table>
        </div>
    )
};

export default Pipeline;
