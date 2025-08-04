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
import isoWeek from "dayjs/plugin/isoWeek";
import weekOfYear from "dayjs/plugin/weekOfYear";
import advancedFormat from "dayjs/plugin/advancedFormat";

import { useFlywheelAverageEntries } from "../dashboard/_features/hook";
import { Spinner } from "@radix-ui/themes";
import { getBusinessId, getUser } from "@/app/utils/user/userData";

dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);

const PERIODS = ["daily", "weekly", "monthly", "yearly"] as const;
type Period = typeof PERIODS[number];

const getWeekRangeLabel = (weekStr: string) => {
  if (!weekStr || !weekStr.includes("-W")) return weekStr;

  const [yearStr, weekNumberStr] = weekStr.split("-W");
  const year = parseInt(yearStr);
  const week = parseInt(weekNumberStr);

  const startOfWeek = dayjs().year(year).isoWeek(week).startOf("isoWeek");
  const endOfWeek = dayjs().year(year).isoWeek(week).endOf("isoWeek");

  return `${startOfWeek.format("MMM D")} - ${endOfWeek.format("MMM D")}`;
};

const transformEngagementData = (data: any[], period: Period) => {
  if (!data || !Array.isArray(data)) return [];

  return data.map((item) => {
    const rawDate = item.date ?? item[period] ?? ""; // 👈 safer fallback

    let formattedDate = rawDate;
    switch (period) {
      case "daily":
        formattedDate = dayjs(rawDate).format("MMM D");
        break;
      case "weekly":
        formattedDate = getWeekRangeLabel(rawDate); // "2025-W30" → "Jul 21 - Jul 27"
        break;
      case "monthly":
        formattedDate = dayjs(rawDate).format("MMM YYYY");
        break;
      case "yearly":
        formattedDate = rawDate;
        break;
    }

    return {
      date: formattedDate,
      responses: item.count ?? item.responses ?? 0,
    };
  });
};

export default function FlywheelAverageEntriesChart({business} : ({business?: string})) {
  const user = getUser();
  let businessUserId = "";

  if (user?.role === "business") {
    businessUserId = getBusinessId() ?? "";
  }
  if (user?.role === "employee") {
    businessUserId = user?.businessUserId;
  }
  if (user?.role === "super admin") {
    businessUserId = business!;
  }

  const [period, setPeriod] = useState<Period>("monthly");

  const { data: rawData, isLoading } = useFlywheelAverageEntries(
    businessUserId,
    period
  );

  const chartData = useMemo(() => {
    return transformEngagementData(rawData?.[period] ?? [], period);
  }, [rawData, period]);

  if (isLoading) return <Spinner />;

  return (
    <div className="h-full w-full bg-white rounded-xl px-4 py-4 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-md text-black font-semibold">
          Data Flywheel Average Entries
        </h2>
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
