import React, { useEffect, useMemo } from 'react';
import { Banknote, Users2 } from "lucide-react";
import { MdChecklist } from "react-icons/md";
import BusinessCard from '@/app/pages/user/business/_components/BusinessCard';
import { getBusinessId, getUser } from "@/app/utils/user/userData";
import { Spinner } from '@radix-ui/themes';
import { useDatFlywheelSummary, useSurveySummary } from '../dashboard/_features/hook';

const Summary = ({ module, business }: { module: string, business?: string}) => {
    const user = getUser();

    // Memorize role and businessUserId
    const { role, businessUserId } = useMemo(() => {
        const role = user?.role ?? '';
        let businessUserId = '';

        if (role === 'business') {
            businessUserId = getBusinessId() ?? '';
        } else if (role === 'employee') {
            businessUserId = user?.businessUserId ?? '';
        } else if (role === 'admin') {
            businessUserId = business ?? ''
        } else if (role === 'super admin') {
            businessUserId = business ?? ''
        }

        return { role, businessUserId };
    }, [user, business]);

    // Call only the relevant hook based on the module
    const {
        data: surveyData,
        isLoading: loadingSurvey,
        error: errorSurvey,
        refetch: refetchSurvey,
    } = useSurveySummary(businessUserId, role);

    const {
        data: flyWheelData,
        isLoading: loadingFlywheel,
        error: errorFlywheel,
        refetch: refetchFlywheel,
    } = useDatFlywheelSummary(businessUserId, role);

    useEffect(() => {
        if (business && module === 'Survey') {
            refetchSurvey();
        } else if (module === 'Data Flywheel') {
            refetchFlywheel();
        }
    }, [module, business, refetchSurvey, refetchFlywheel]);

    const isLoading = module === 'Survey' ? loadingSurvey : loadingFlywheel;
    const isError = module === 'Survey' ? errorSurvey : errorFlywheel;

    if (isLoading) return <Spinner />;
    if (isError) return <p>Error fetching the {module} summary</p>;

    return (
        <>
            {module === 'Survey' && surveyData && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-5">
                    <BusinessCard
                        title={'Total Surveys'}
                        value={surveyData.totalSurveys}
                        icon={<Users2 size={14} color="blue" />}
                        iconClass="rounded-full bg-blue-100 p-1 lg:p-2"
                        isHighLighted={false}
                    />

                    <BusinessCard
                        title={'Completed Surveys'}
                        value={surveyData.completedSurveys}
                        icon={<Banknote size={14} color="green" />}
                        iconClass="rounded-full bg-green-100 p-1 lg:p-2"
                        isHighLighted={false}
                    />

                    <BusinessCard
                        title={'Ongoing Surveys'}
                        value={surveyData.ongoingSurveys}
                        icon={<MdChecklist size={14} color="blue" />}
                        iconClass="rounded-full bg-white p-1 lg:p-2"
                        isHighLighted={true}
                    />
                </div>
            )}

            {module === 'Data Flywheel' && flyWheelData && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-5">
                    <BusinessCard
                        title={'Total data points'}
                        value={flyWheelData?.totalDataPoint}
                        icon={<Users2 size={14} color="blue" />}
                        iconClass="rounded-full bg-blue-100 p-1 lg:p-2"
                        isHighLighted={false}
                    />

                    <BusinessCard
                        title={'Completed Data points'}
                        value={flyWheelData?.completedDataPoint}
                        icon={<MdChecklist size={14} color="blue" />}
                        iconClass="rounded-full bg-white p-1 lg:p-2"
                        isHighLighted={true}
                    />

                    <BusinessCard
                        title={'Ongoing Data points'}
                        value={flyWheelData?.ongoingDataPoint}
                        icon={<Banknote size={14} color="green" />}
                        iconClass="rounded-full bg-green-100 p-1 lg:p-2"
                        isHighLighted={false}
                    />
                </div>
            )}
        </>
    );
};

export default Summary;