"use client";

import { useParams } from "next/navigation";
import DashboardLayout from "@/app/DashboardLayout";
import { useFetchSinglePipeline } from "../../../_features/hook";
import axios from "@/app/lib/axios";
import NewDataPoint from "../../NewDataPoint";

const NewDataPointPage = () => {
    const params = useParams();
    const pipelineId = params.pipelineId as string;

    const { data: singlePipeline } = useFetchSinglePipeline({
        axios,
        id: pipelineId|| '',
        enabled: true,
    });
    return (
        <DashboardLayout>
            <div className="w-full">
                <NewDataPoint
                    pipelineId={pipelineId}
                    pipelineName={singlePipeline?.dataPointName || ''}
                    pipelineDescription={singlePipeline?.dataPointDescription || ''}
                />
            </div>
        </DashboardLayout>
    );
};

export default NewDataPointPage;
