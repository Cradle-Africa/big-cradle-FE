import React from 'react'
import FlywheelCard from './FlywheelCard'
import { Album, ArrowUpDown, Database } from 'lucide-react'

interface PipelineProps {
    pipelines: string,
    dataPoint: string,
    dataEntries: string
}

const Overview:React.FC<PipelineProps> = ({pipelines, dataPoint, dataEntries}) => {
    return (
        <div className="grid grid-cols-1 md:grid md:grid-cols-3 xl:grid xl-grid-cols-4 w-full gap-6 mt-8">
            <FlywheelCard
                isHighLighted={true}
                title="Data Pipelines"
                icon={ArrowUpDown}
                value={pipelines}
                percentage=""
                description="Built pipelines"
            />

            <FlywheelCard
                isHighLighted={false}
                title="Data Points"
                icon={Album}
                value={dataPoint}
                description={`Total data points created`}
            />

            <FlywheelCard
                isHighLighted={false}
                title="Data entries"
                icon={Database}
                value={dataEntries}
                description={`Data entries through ${pipelines} pipelines`}
            />
        </div>
    )
}

export default Overview
