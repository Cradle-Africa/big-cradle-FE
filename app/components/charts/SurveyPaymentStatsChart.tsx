"use client";

import {
    PieChart,
    Pie,
    Cell,
    Legend,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Spinner } from "@radix-ui/themes";
import { getUser, getBusinessId } from "@/app/utils/user/userData";
import { useSurveyPaymentStats } from "../dashboard/_features/hook";

const COLORS = ["#004484", "#FF0000"];

interface Props {
    startDate?: string;
    endDate?: string;
    business?: string;
}

export default function SurveyPaymentStatsChart({ startDate, endDate, business }: Props) {
    let businessUserId = "";
    const user = getUser();
    const role = user?.role ?? "";
    if (role === "business") {
        businessUserId = getBusinessId() ?? "";
    } else if (role === "employee") {
        businessUserId = user?.businessUserId ?? "";
    } else if (role === 'admin') {
        businessUserId = business ?? ''
    } else if (role === 'super admin') {
        businessUserId = business ?? ''
    }

    const { data, isPending } = useSurveyPaymentStats({
        businessUserId,
        role,
        startDate,
        endDate,
        // enabled: !!businessUserId
    });

    if (isPending) return <Spinner />;
    // if (isError || !data) return <p className="text-red-500">No data.</p>;

    const total = data?.reduce((sum: number, item: any) => sum + item.value, 0);

    const chartData = data?.map((item: any) => ({
        ...item,
        percentage: ((item.value / total) * 100).toFixed(1),
    }));

    return (
        <div className="bg-white p-4 border border-gray-200 rounded-md">
            <p className="font-semibold mb-4">Survey Payment Status</p>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="70%"
                        startAngle={180}
                        endAngle={0}
                        innerRadius={80}
                        outerRadius={100}
                        dataKey="value"
                        paddingAngle={1}
                        labelLine={false}
                        label={({ value }) => `${value}`}
                    >
                        {chartData?.map((entry: any, index: any) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${value} responses`} />
                    <Legend
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        content={({ payload }) => (
                            <ul className="list-none p-0 m-0">
                                {payload?.map((entry: any, i: number) => {
                                    const { status, value, percentage } = chartData[i];
                                    return (
                                        <li key={`legend-${i}`} className="mb-1 flex items-center">
                                            <div
                                                style={{
                                                    width: 12,
                                                    height: 12,
                                                    backgroundColor: entry.color,
                                                    marginRight: 8,
                                                    borderRadius: 2,
                                                }}
                                            />
                                            <span className="text-sm">
                                                {status}: {value} ({percentage}%)
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
