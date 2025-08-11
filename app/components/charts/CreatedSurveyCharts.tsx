"use client";

import React, { useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { Spinner } from "@radix-ui/themes";
import { useCreatedSurveyStats } from "../dashboard/_features/hook";
import { formatISOWeekToRange } from "@/app/utils/formatDate";



const CreatedSurvey: React.FC = () => {
    const [period, setPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const { data, isLoading, error } = useCreatedSurveyStats({
        period,
        startDate,
        endDate,
    });

    if (isLoading) return <Spinner />;
    if (error) return <p className="text-red-500">Failed to load data.</p>;

    const labelKey = {
        daily: "date",
        weekly: "weekly",
        monthly: "monthly",
        yearly: "yearly",
    }[period];

    const chartData = data?.map((entry) => {
        const rawLabel = (entry as any)[labelKey];

        return {
            name: period === "weekly" ? formatISOWeekToRange(rawLabel) : rawLabel,
            value: entry.count,
        };
    });

    return (
        <div className="w-full bg-white px-5 py-5">
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-md text-black font-semibold">Created surveys</h2>
                <div className="md:flex flex flex-col md:flex-row justify-end gap-2">
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value as any)}
                        className="border px-2 py-1 text-sm rounded"
                    >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>

                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border px-2 py-1 text-sm rounded"
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border px-2 py-1 text-sm rounded"
                    />
                </div>
            </div>

            <div className="w-full h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#004484"
                            strokeWidth={2}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default CreatedSurvey;
