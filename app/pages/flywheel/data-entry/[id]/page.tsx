"use client";

import { useParams } from "next/navigation";
import ViewDataEntries from "../ViewDataEntries";
import { useState } from "react";
import DashboardLayout from "@/app/DashboardLayout";

const DataEntryPage = () => {
    const params = useParams();
    const id = params.id as string;
    const [viewDataEntries, setViewDataEntries] = useState(true);

    return (
        <DashboardLayout>
            <div className="w-full">
                <ViewDataEntries
                    viewDataEntries={viewDataEntries}
                    uniqueId={id}
                    setViewDataEntries={setViewDataEntries}
                />
            </div>
        </DashboardLayout>
    );
};

export default DataEntryPage;
