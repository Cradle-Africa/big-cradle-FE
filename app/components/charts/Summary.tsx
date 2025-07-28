import React from 'react'
import { Banknote, Users2 } from "lucide-react";
import { MdChecklist } from "react-icons/md";
import BusinessCard from '@/app/pages/user/business/_components/BusinessCard';
// import { SurveySummary } from '@/app/lib/type';
import { getBusinessId, getUser } from "@/app/utils/user/userData";
import { Spinner } from '@radix-ui/themes';
import { useSurveySummary } from '../dashboard/_features/hook';

const Summary = ({module}: { module: string}) => {
	const user = getUser();
    let businessUserId = '';
	const role = user?.role ?? '';
	if(role === 'business'){
		businessUserId = getBusinessId() ?? '';
	}
	if(role === 'employee'){
		businessUserId = user?.businessUserId ?? ''
	}
	
	const {
		data,
		isLoading: loadingSummary,
		error: errorSummary,
	} = useSurveySummary(businessUserId, role);

	if (loadingSummary) 
		return <Spinner/> 

	if (errorSummary)
		return <p>Error fetching the survey summary</p>

    return (
        <>
            {module === 'Survey' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-5">
                    <BusinessCard
                        title={'Total Surveys'}
                        value={data?.totalSurveys}
                        icon={<Users2 size={14} color="blue" />}
                        iconClass="rounded-full bg-blue-100 p-1 lg:p-2"
                        isHighLighted={false}
                    />

                    <BusinessCard
                        title={'Completed Surveys'}
                        value={data?.completedSurveys}
                        icon={<Banknote size={14} color="green" />}
                        iconClass="rounded-full bg-green-100 p-1 lg:p-2"
                        isHighLighted={false}
                    />

                    <BusinessCard
                        title={'Ongoing Surveys'}
                        value={data?.ongoingSurveys}
                        icon={<MdChecklist size={14} color="blue" />}
                        iconClass="rounded-full bg-white p-1 lg:p-2"
                        isHighLighted={true}
                    />
                </div>
            )}

            {module === 'Data Flywheel' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-5">
                    <BusinessCard
                        title={'Total Surveys'}
                        value={'0'}
                        icon={<Users2 size={14} color="blue" />}
                        iconClass="rounded-full bg-blue-100 p-1 lg:p-2"
                        isHighLighted={false}
                    />

                    <BusinessCard
                        title={'Completed Surveys'}
                        value={'0'}
                        icon={<Banknote size={14} color="green" />}
                        iconClass="rounded-full bg-green-100 p-1 lg:p-2"
                        isHighLighted={false}
                    />

                    <BusinessCard
                        title={'Ongoing Surveys'}
                        value={'0'}
                        icon={<MdChecklist size={14} color="blue" />}
                        iconClass="rounded-full bg-white p-1 lg:p-2"
                        isHighLighted={true}
                    />
                </div>
            )}

        </>
    )
}

export default Summary
