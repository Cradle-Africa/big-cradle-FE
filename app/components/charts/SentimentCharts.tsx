'use client';

import { getBusinessId, getUser } from '@/app/utils/user/userData';
import { Spinner } from '@radix-ui/themes';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from 'recharts';
import { useFetchSentiments } from '../dashboard/_features/hook';
import { useEffect } from 'react';

export default function SentimentChart({ module }: { module: string }) {
    const user = getUser();
    let businessUserId = '';
    const role = user?.role ?? '';

    if (role === 'business') {
        businessUserId = getBusinessId() ?? '';
    } else if (role === 'employee') {
        businessUserId = user?.businessUserId ?? '';
    }

    const { 
        data,
        isLoading, 
        error,  
        refetch: refetchSentiment,
    } = useFetchSentiments({
        businessUserId,
        role,
        startDate: '2025-01-01',
        endDate: '2025-12-01',
    });

    useEffect(() => {
        if ( module === 'Survey' ){
            refetchSentiment();
        }
    }, [module, refetchSentiment]);

    if (isLoading) return <Spinner />;
    if (error || !data?.data) return <p>Error fetching the survey sentiment</p>;

    // Define pie data separately
    const pieData = [
        {
            name: 'Positive',
            value: data.data.positive ?? 0,
            color: '#10B981',
        },
        {
            name: 'Neutral',
            value: data.data.neutral ?? 0,
            color: '#F59E0B',
        },
        {
            name: 'Negative',
            value: data.data.negative ?? 0,
            color: '#CB2A31',
        },
    ];

    return (
        <div className="w-2/5 bg-white rounded-xl px-2 py-4 border border-gray-100">
            <h2 className="text-md text-black font-semibold ml-2 mb-2">Sentiments</h2>
            <div className="flex items-center justify-between mb-4">
                <ResponsiveContainer width="60%" height={250}>
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

                <ul className="space-y-1 text-xs md:text-sm w-2/5 px-3">
                    {pieData.map((item) => (
                        <li key={item.name} className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                            <span>{item.value}% {item.name}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
