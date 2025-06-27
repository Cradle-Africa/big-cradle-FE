"use client";

import { useParams } from "next/navigation";
import ViewDataEntries from "../ViewDataEntries";
import { useState } from "react";
import DashboardLayout from "@/app/DashboardLayout";
import { List } from "lucide-react";

const DataEntryPage = () => {
    const params = useParams();
    const id = params.id as string;
    const [viewDataEntries, setViewDataEntries] = useState(false);

    return (
        <DashboardLayout>
            <div className="w-full">
                <div className="flex justify-between">
                    <h2 className="text-md text-black">Data entries</h2>
                </div>
                <ViewDataEntries
                    viewDataEntries={true}
                    uniqueId={id}
                    setViewDataEntries={setViewDataEntries}
                />
            </div>
        </DashboardLayout>
    );
};

export default DataEntryPage;
