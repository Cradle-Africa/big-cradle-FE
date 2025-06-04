import React from 'react'
import DataUploadMetrics from '../../components/analytics/DataUploadMetrics';
import DashboardLayout from '../../components/layouts/DashboardLayout';

const DataUploadsPage = () => {
    return (
        <DashboardLayout>

            <div>
                <div className='flex w-full text-sm'>
                    <span className='text-gray-400'>Analytics / </span> <span className='text-gray-700 ml-1'> Data Upload Metrics</span>
                </div>
                <DataUploadMetrics />
            </div>
        </DashboardLayout>
    )
}

export default DataUploadsPage
