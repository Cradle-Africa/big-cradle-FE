"use client";

import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend } from "recharts";
import { useEntryVolume } from "../dashboard/_features/hook";
import { getBusinessId, getUser } from "@/app/utils/user/userData";
import { PieChartSkeleton } from "../skeleton/PieChartSkeleton";

const COLORS = [
    "#004484", "#2B99FA", "#155DFC", "#004484", "#FFFF00", "#008000", "#FFA500"
];

// const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYS = ["Invalid", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface Props {
    startDate?: string;
    endDate?: string;
    business?: string;
}

export default function FlywheelEntryVolumeChart({
    startDate,
    endDate,
    business
}: Props) {

    let businessUserId = '';
    const user = getUser();
    const role = user?.role ?? '';
    if (role === 'business') {
        businessUserId = getBusinessId() ?? '';
    }
    if (role === 'employee') {
        businessUserId = user?.businessUserId ?? ''
    }
    if (role === 'super admin') {
        businessUserId = business ?? '';
    }
    if (user?.role === "admin") {
        businessUserId = business ?? '';
    }

    const { data, isPending, isError } = useEntryVolume({
        businessUserId,
        role,
        startDate,
        endDate,
    });

    if (isPending) return <PieChartSkeleton/>;
    if (isError || !data) return <p>Failed to load entry volume data.</p>;

    const groupedByDay = Array(8).fill(0); // 0 index unused

    data.forEach(item => {
        groupedByDay[item.dayOfWeek] += item.count;
    });

    const chartData = groupedByDay.slice(1).map((count, index) => ({
        name: DAYS[index + 1],
        value: count,
    }));


    return (
        <div className="relative h-full w-full bg-white rounded-xl px-4 py-4 border border-gray-200">
            <p className="font-medium mb-4">Data flywheel volume entries</p>
            <div className="w-full mb-4 rounded-md flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="35%"
                            cy="50%"
                            label
                            outerRadius={100}
                            innerRadius={75}
                            paddingAngle={1}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {chartData.map((_, index) => (
                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>

                        <Tooltip />
                        <Legend
                            layout="vertical"
                            verticalAlign="middle"
                            align="right"
                            content={({ payload }) => (
                                <ul className="list-none m-0 p-0">
                                    {payload?.map((entry: any, index: any) => (
                                        <li key={`item-${index}`} className="mb-1 flex items-center">
                                            <div
                                                style={{
                                                    width: 12,
                                                    height: 12,
                                                    backgroundColor: entry.color,
                                                    marginRight: 8,
                                                    borderRadius: 2,
                                                }}
                                            />
                                            <span className="text-sm">{entry.value} - {entry.payload.value}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        />

                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
