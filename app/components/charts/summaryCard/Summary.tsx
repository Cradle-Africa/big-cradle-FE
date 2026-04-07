import BusinessCard from '@/app/pages/user/business/_components/BusinessCard';
import { getBusinessId, getUser } from "@/app/utils/user/userData";
import { SummaryCardSkeleton } from './SummaryCardSkeleton';
import { ArrowDownCircle, ArrowUpCircle, Banknote, Database, File, Users2, Wallet } from "lucide-react";
import { useEffect, useMemo } from 'react';
import { MdChecklist } from "react-icons/md";
import { useDatFlywheelSummary, useSuperAdminSummary, useSurveySummary } from '../../dashboard/_features/hook';

const Summary = ({ module, business }: { module: string, business?: string }) => {
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

    const {
        data: superAdminSuammaryData,
        isLoading: loadingSuperAdmin,
        error: errorSuperAdmin,
        refetch: reftechSuperAdminSummary
    } = useSuperAdminSummary();

    useEffect(() => {
        if (user?.role != 'super admin') {

            if (business && module === 'Survey') {
                refetchSurvey();
            }
            if (module === 'Data Flywheel') {
                refetchFlywheel();
            }
        }

        if (user?.role === 'super admin') {
            reftechSuperAdminSummary();
        }
    }, [module, business, refetchSurvey, reftechSuperAdminSummary, refetchFlywheel, user?.role]);

    const isLoading = module === 'Survey' ? loadingSurvey : loadingFlywheel;
    const isError = module === 'Survey' ? errorSurvey : errorFlywheel;

    if (isLoading || loadingSuperAdmin) return <SummaryCardSkeleton count={3}  />;

    if (isError || errorSuperAdmin) return <p> {''}</p>;

    return (
        <>
            {module === 'Survey' && surveyData && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                    <BusinessCard
                        title={'Total Surveys'}
                        value={surveyData.totalSurveys}
                        icon={<Users2 size={14} color="blue" />}
                        iconClass="rounded-full bg-blue-100 p-1 lg:p-2"
                        isHighLighted={true}
                    />

                    <BusinessCard
                        title={'Completed Surveys'}
                        value={surveyData.completedSurveys}
                        icon={<Banknote size={14} color="green" />}
                        iconClass="rounded-full bg-green-100 p-1 lg:p-2"
                        isHighLighted={true}
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                    <BusinessCard
                        title={'Total data Pipelines'}
                        value={flyWheelData?.totalDataPoints}
                        icon={<Users2 size={14} color="blue" />}
                        iconClass="rounded-full bg-blue-100 p-1 lg:p-2"
                        isHighLighted={true}
                    />

                    <BusinessCard
                        title={'Total Data Points'}
                        value={flyWheelData?.totalFields}
                        icon={<MdChecklist size={14} color="blue" />}
                        iconClass="rounded-full bg-white p-1 lg:p-2"
                        isHighLighted={true}
                    />

                    <BusinessCard
                        title={'Total Data Entries'}
                        value={flyWheelData?.totalEntries}
                        icon={<Banknote size={14} color="blue" />}
                        iconClass="rounded-full bg-blue-100 p-1 lg:p-2"
                        isHighLighted={true}
                    />
                </div>
            )}

            {(role === 'super admin') && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5">
                    <BusinessCard
                        title={'Total Ecosystem enablers'}
                        value={String(superAdminSuammaryData?.totalAdminUsers)}
                        icon={<Users2 size={14} color="blue" />}
                        iconClass="rounded-full bg-blue-100 p-1 lg:p-2"
                        isHighLighted={true}
                    />

                    <BusinessCard
                        title={'Total Business'}
                        value={String(superAdminSuammaryData?.totalBusinessUsers)}
                        icon={<Users2 size={14} color="blue" />}
                        iconClass="rounded-full bg-blue-100 p-1 lg:p-2"
                        isHighLighted={true}
                    />

                    <BusinessCard
                        title={'Total Researchers'}
                        value={String(superAdminSuammaryData?.totalResearchers)}
                        icon={<Users2 size={14} color="blue" />}
                        iconClass="rounded-full bg-blue-100 p-1 lg:p-2"
                        isHighLighted={true}
                    />

                    <BusinessCard
                        title={'Total Pielines'}
                        value={String(superAdminSuammaryData?.totalDataPoints)}
                        icon={<Database size={14} color="blue" />}
                        iconClass="rounded-full bg-blue-100 p-1 lg:p-2"
                        isHighLighted={true}
                    />

                    <BusinessCard
                        title={'Total Surveys'}
                        value={String(superAdminSuammaryData?.totalSurveys)}
                        icon={<File size={14} color="blue" />}
                        iconClass="rounded-full bg-blue-100 p-1 lg:p-2"
                        isHighLighted={true}
                    />

                    <BusinessCard
                        title={'Total Transactions'}
                        value={String(superAdminSuammaryData?.totalTransactions)}
                        icon={<Wallet size={14} color="blue" />}
                        iconClass="rounded-full bg-blue-100 p-1 lg:p-2"
                        isHighLighted={true}
                    />

                    <BusinessCard
                        title={'Total Credit'}
                        value={String(superAdminSuammaryData?.totalCredit)}
                        icon={<ArrowUpCircle size={14} color="blue" />}
                        iconClass="rounded-full bg-blue-100 p-1 lg:p-2"
                        isHighLighted={true}
                    />

                    <BusinessCard
                        title={'Total Debit'}
                        value={String(superAdminSuammaryData?.totalDebit)}
                        icon={<ArrowDownCircle size={14} color="blue" />}
                        iconClass="rounded-full bg-blue-100 p-1 lg:p-2"
                        isHighLighted={true}
                    />

                </div>
            )}
        </>
    );
};

export default Summary;