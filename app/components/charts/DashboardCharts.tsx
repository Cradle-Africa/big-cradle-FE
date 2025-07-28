'use client';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const pieData = [
    { name: 'Org Campaigns', value: 40, color: '#1D4ED8' },   // blue
    { name: 'Partner Ecosystem', value: 30, color: '#D946EF' }, // pink
    { name: 'Offline Feedback Loop', value: 20, color: '#F59E0B' }, // yellow
    { name: 'Data API Subscriptions', value: 10, color: '#10B981' }, // green
];

export const barData = [
    { day: 'Sun', users: 950 },
    { day: 'Mon', users: 600 },
    { day: 'Tue', users: 700 },
    { day: 'Wed', users: 400 },
    { day: 'Thu', users: 800 },
    { day: 'Fri', users: 300 },
    { day: 'Sat', users: 750 },
];

export default function DashboardCharts() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <div className="bg-white rounded-xl px-2 py-4 border border-[#F7F7F7]">
                <h2 className="text-md text-gray-700 font-semibold ml-2 mb-4">Data Split</h2>
                <div className='flex items-center justify-between mb-4'>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                innerRadius={60}
                                paddingAngle={1}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <ul className="space-y-1 text-xs md:text-sm w-full px-3 md:px-0">
                        {pieData.map((item) => (
                            <li key={item.name} className="flex items-center mt-4 gap-1">
                                <span className="w-3 h-3" style={{ backgroundColor: item.color }}></span>
                                <span className='text-xs md:text-sm'>{item.value}%  {item.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* User Growth Bar Chart */}
            <div className="bg-white rounded-xl px-4 py-4 border border-[#F7F7F7]">
                <h2 className="text-md text-gray-700 font-semibold pb-8 mb-4">User Growth</h2>
                <ResponsiveContainer width="100%" height={210}>
                    <BarChart 
                            data={barData} 
                            barSize={20} 
                            barCategoryGap="40%"
                            margin={{ top: 0, right: 0, left:-20, bottom: 0 }}
                    >
                        <XAxis dataKey="day" stroke="#94A3B8" fontSize={'14px'} />
                        <YAxis stroke="#94A3B8" fontSize={'14px'} />
                        <Tooltip />
                        <Bar dataKey="users" fill="#F0F2FF" radius={[5, 5, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
