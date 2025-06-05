'use client';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const pieData = [
    { name: 'Positive', value: 70, color: '#10B981' }, // green
    { name: 'Neutral', value: 20, color: '#D8A603' }, // yellow
    { name: 'Negative', value: 10, color: '#DC3333' }, // red

];

const barData = [
    { city: 'Kigali', activity: 450 },
    { city: 'Accra', activity: 300 },
    { city: 'Lagos', activity: 70 },
    { city: 'Nairobi', activity: 40 },
];

export default function DashboardCharts() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            {/* Revenue Split Pie Chart */}
            <div className="bg-white rounded-xl px-2 py-4 border border-[#F7F7F7]">
                <h2 className="text-md text-gray-700 font-semibold ml-2 mb-4">Feedback Quality Insights</h2>
                <div className='md:flex items-center justify-between mb-4'>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                cx="40%"
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
                    <ul className="space-y-1 text-sm w-full">
                        {pieData.map((item) => (
                            <li key={item.name} className="flex items-center mt-4 gap-1">
                                <span className="w-3 h-3" style={{ backgroundColor: item.color }}></span>
                                <span className='text-sm'>{item.value}% – {item.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* User Growth Bar Chart */}
            <div className="bg-white rounded-xl px-4 py-4 border border-[#F7F7F7]">
                <h2 className="text-md text-gray-700 font-semibold pb-8 mb-4">Regional Activity</h2>
                <ResponsiveContainer width="100%" height={210}>
                    <BarChart 
                            data={barData} 
                            barSize={20} 
                            barCategoryGap="40%"
                            margin={{ top: 0, right: 0, left:-20, bottom: 0 }}
                    >
                        <XAxis dataKey="city" stroke="#94A3B8" fontSize={'14px'} />
                        <YAxis stroke="#94A3B8" fontSize={'14px'} />
                        <Tooltip />
                        <Bar dataKey="activity" fill="#F0F2FF" radius={[5, 5, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
