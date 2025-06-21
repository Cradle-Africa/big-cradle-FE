import React from 'react'
import FlywheelCard from './FlywheelCard'
import { Album } from 'lucide-react'

interface PipelineProps {
    pipelines: number
}

const Overview:React.FC<PipelineProps> = ({pipelines}) => {
    return (
        <div className="grid grid-cols-1 md:grid md:grid-cols-2 xl:grid xl-grid-cols-3 w-full gap-6 mt-8">
            <FlywheelCard
                isHighLighted={true}
                title="Data Pipelines"
                icon={Album}
                value={pipelines}
                percentage=""
                description="Built pipelines"
            />

            <FlywheelCard
                isHighLighted={false}
                title="Data entries"
                icon={Album}
                value={1000}
                description={`Data entries through ${pipelines} pipelines`}
            />
        </div>
    )
}

export default Overview
