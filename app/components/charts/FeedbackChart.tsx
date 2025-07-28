'use client';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from 'recharts';

const pieData = [
    { name: 'Positive', value: 70, color: '#10B981' },
    { name: 'Neutral', value: 20, color: '#F59E0B' },
    { name: 'Negative', value: 10, color: '#CB2A31' },
];

export default function FeedbackChart() {
    return (
        <div className="w-2/5 bg-white rounded-xl px-2 py-4 border border-gray-100">
            <h2 className="text-md text-black font-semibold ml-2 mb-2">Feedback Quality Insights</h2>
            <h2 className="text-md text-black font-semibold ml-2 mb-4">453 insights</h2>
            <div className="flex items-center justify-between mb-4">
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
                        <li key={item.name} className="flex items-center ml-5 gap-1">
                            <span className="w-3 h-3" style={{ backgroundColor: item.color }}></span>
                            <span className="text-xs md:text-sm">{item.value}% {item.name}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
