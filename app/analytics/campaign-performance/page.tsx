import React from 'react'
import CampaignPerformance from '../../components/analytics/CampaignPerformance';
import DashboardLayout from '../../DashboardLayout';

const CampaignPerformancePage = () => {
    return (
        <DashboardLayout>
            <div>
                <div className='flex w-full text-sm'>
                    <span className='text-gray-400'>Analytics / </span> <span className='text-gray-700 ml-1'> Campaign Performance</span>
                </div>
                <CampaignPerformance />
            </div>
        </DashboardLayout>
    )
}

export default CampaignPerformancePage
