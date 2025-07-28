'use client';

import FeedbackChart from "./FeedbackChart";
import ResponseChart from "./ResponseChart";

export default function DashboardCharts() {
    return (
        <div className="flex justify-between gap-5 mt-5">
            <ResponseChart />
            <FeedbackChart />
        </div>
    );
}
