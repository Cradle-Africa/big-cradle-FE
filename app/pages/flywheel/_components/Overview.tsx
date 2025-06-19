import React from 'react'
import FlywheelCard from './FlywheelCard'
import { Album } from 'lucide-react'

const Overview = () => {
    return (
        <div className="flex w-full gap-6 mt-8">
            <FlywheelCard
                isHighLighted={true}
                title="Data points"
                icon={Album}
                value={67}
                percentage="10"
                description="Activated"
            />

            <FlywheelCard
                isHighLighted={false}
                title="Data entries"
                icon={Album}
                value={1000}
                description="Amount paid out to contributors"
            />
        </div>
    )
}

export default Overview
