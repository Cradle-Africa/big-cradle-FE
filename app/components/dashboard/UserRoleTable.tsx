import React from 'react'

const UserRoleTable = () => {
    return (
        <div className="overflow-x-auto w-full mt-5 rounded-md border border-gray-100 px-5 py-5">
            <h2 className="text-md text-gray-700 font-semibold mb-4">User Breakdown Table</h2>
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="rounded-tl-lg border-r border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">
                            Role
                        </th>
                        <th className="border-r border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">
                            Active Today
                        </th>
                        <th className="border-r border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">
                            Total Users
                        </th>
                        <th className="border-r border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">
                            Last Login Avg
                        </th>
                        <th className="rounded-tr-lg border-l border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-600 tracking-wider">
                            Suspended
                        </th>
                    </tr>
                </thead>


                <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Super Admin</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">3</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">8</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">2d ago</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">0</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Echosystem Admin</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">12</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">56</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">2d ago</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">1</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Organisations</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">231</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">4300</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">2d ago</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">15</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">Researchers</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">3812</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">7976</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">2d ago</td>
                        <td className="border border-gray-100 px-6 py-3 whitespace-nowrap text-sm">34</td>
                    </tr>
                </tbody>
            </table>
        </div>

    )
}

export default UserRoleTable
