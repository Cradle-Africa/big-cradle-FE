"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import DashboardLayout from "@/app/DashboardLayout";
import ViewDataEntries from "../../ViewDataEntries";

const DataEntryPage = () => {
    const params = useParams();
    const { pipelineId, fieldId } = params as { pipelineId: string; fieldId: string };

    const [viewDataEntries, setViewDataEntries] = useState(true);

    return (
        <DashboardLayout>
            <div className="w-full">
                <ViewDataEntries
                    viewDataEntries={viewDataEntries}
                    pipelineId={pipelineId}
                    fieldId={fieldId}
                    setViewDataEntries={setViewDataEntries}
                />
            </div>
        </DashboardLayout>
    );
};

export default DataEntryPage;
