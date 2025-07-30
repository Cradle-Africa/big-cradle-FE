'use client';

import React, { useState, useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import { useFlywheelAverageEntries } from "../dashboard/_features/hook";
import { Spinner } from "@radix-ui/themes";
import { getBusinessId } from "@/app/utils/user/userData";

const PERIODS = ["daily", "weekly", "monthly", "yearly"] as const;
type Period = typeof PERIODS[number];

const transformEngagementData = (data: any[], period: Period) => {
    if (!data || !Array.isArray(data)) return [];

    return data.map((item) => {
        let formattedDate = item.date;

        switch (period) {
            case "daily":
                formattedDate = dayjs(item.date).format("MMM D");
                break;
            case "weekly":
                formattedDate = `Week of ${dayjs(item.date).format("MMM D")}`;
                break;
            case "monthly":
                formattedDate = dayjs(item.date).format("MMM YYYY");
                break;
            case "yearly":
                formattedDate = dayjs(item.date).format("YYYY");
                break;
        }

        return {
            date: formattedDate,
            responses: item.count ?? item.responses ?? 0,
        };
    });
};

export default function FlywheelAverageEntriesChart() {
    const businessUserId = getBusinessId() ?? '';
    const [period, setPeriod] = useState<Period>("monthly");

    const { data: rawData, isLoading } = useFlywheelAverageEntries(businessUserId, period);

    console.log('data', rawData);
    const chartData = useMemo(() => {
        return transformEngagementData(rawData?.[period] ?? [], period);
    }, [rawData, period]);

    if (isLoading) return <Spinner />;

    return (
        <div className="w-3/5 bg-white rounded-xl px-4 py-4 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-md text-black font-semibold">Data flyweel Average Entries</h2>
                <select
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value as Period)}
                >
                    {PERIODS.map((p) => (
                        <option key={p} value={p}>
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 20, left: -5, bottom: 0 }}
                    barCategoryGap="20%"
                >
                    <XAxis dataKey="date" stroke="#004484" fontSize={12} />
                    <YAxis stroke="#94A3B8" fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Bar
                        dataKey="responses"
                        fill="#004484"
                        radius={[3, 3, 0, 0]}
                        name="Responses"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
