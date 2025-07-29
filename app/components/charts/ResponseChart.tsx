'use client';
import { useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const dayData = [
    { day: 'Sun', positive: 95, negative: 60 },
    { day: 'Mon', positive: 80, negative: 50 },
    { day: 'Tue', positive: 120, negative: 90 },
    { day: 'Wed', positive: 100, negative: 40 },
    { day: 'Thu', positive: 130, negative: 70 },
    { day: 'Fri', positive: 60, negative: 30 },
    { day: 'Sat', positive: 110, negative: 85 },
];

const weekData = [
    { week: 'Week 1', positive: 500, negative: 300 },
    { week: 'Week 2', positive: 450, negative: 320 },
    { week: 'Week 3', positive: 600, negative: 480 },
    { week: 'Week 4', positive: 550, negative: 400 },
];

const monthData = [
    { month: 'Jan', positive: 700, negative: 550 },
    { month: 'Feb', positive: 500, negative: 400 },
    { month: 'Mar', positive: 800, negative: 700 },
    { month: 'Apr', positive: 450, negative: 250 },
    { month: 'May', positive: 600, negative: 180 },
    { month: 'Jun', positive: 350, negative: 120 },
    { month: 'Jul', positive: 700, negative: 300 },
    { month: 'Aug', positive: 500, negative: 820 },
    { month: 'Sep', positive: 480, negative: 150 },
    { month: 'Oct', positive: 620, negative: 770 },
    { month: 'Nov', positive: 400, negative: 590 },
    { month: 'Dec', positive: 550, negative: 210 },
];

export default function ResponseChart() {
    const [filter, setFilter] = useState('month');

    const getData = () => {
        switch (filter) {
            case 'day':
                return { data: dayData, key: 'day' };
            case 'week':
                return { data: weekData, key: 'week' };
            case 'month':
            default:
                return { data: monthData, key: 'month' };
        }
    };

    const { data, key } = getData();

    return (
        <div className="w-3/5 bg-white rounded-xl px-4 py-4 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-md text-black font-semibold">Engagements</h2>
                <select
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="day">Daily</option>
                    <option value="week">Weekly</option>
                    <option value="month">Monthly</option>
                </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={data}
                    margin={{ top: 10, right: 20, left: -5, bottom: 0 }}
                    barCategoryGap="20%"
                >
                    <XAxis dataKey={key} stroke="#004484" fontSize={12} />
                    <YAxis stroke="#94A3B8" fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Bar
                        dataKey="positive"
                        fill="#004484"
                        radius={[3, 3, 0, 0]}
                        name="Positive"
                    />
                    <Bar
                        dataKey="negative"
                        fill="#0887FF"
                        radius={[3, 3, 0, 0]}
                        name="Negative"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
