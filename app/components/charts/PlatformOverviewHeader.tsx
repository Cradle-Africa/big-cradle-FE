'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useAdminUserBusinesses } from '../dashboard/_features/hook';
import { Spinner } from '@radix-ui/themes';
import { Me } from '@/app/lib/type';
import { useFetchBusinesses } from '@/app/pages/user/business/_features/hook';
import axios from '@/app/lib/axios';
import Select from 'react-select';

interface PlatformOverviewHeaderProps {
    user: Me;
    module: string;
    setModule: (value: string) => void;
    setBusiness?: (value: string) => void;
}

const PlatformOverviewHeader: React.FC<PlatformOverviewHeaderProps> = ({
    user,
    module,
    setModule,
    setBusiness,
}) => {
    const name =
        user?.contactPersonFirstName ??
        user?.firstName ??
        user?.fullName ??
        user?.businessFirstName ??
        '';

    const [page] = useState(1);
    const limit = 10;
    const adminUserId = user?.id;
    const isAdmin = user?.role === 'admin';
    const isSuperAdmin = user?.role === 'super admin';
    const shouldFetchAdmin = isAdmin && !!adminUserId;

    const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);

    const {
        data: adminUserBusiness,
        isLoading: isLoadingUseAdminBusiness,
        error: errorAdminUserBusiness,
    } = useAdminUserBusinesses({
        adminUserId,
        page,
        limit,
        enabled: shouldFetchAdmin,
    });

    const {
        isLoading: isLoadingBusiness,
        data: businessesData,
        error: errorBusiness,
    } = useFetchBusinesses({
        axios,
        queryParams: { page, limit },
    });

    const approvedAdminBusinesses = adminUserBusiness?.filter(
        (b) => b.kycStatus === 'approved'
    );
    const approvedSuperAdminBusinesses = businessesData?.data?.filter(
        (b) => b.kycStatus === 'approved'
    );

    const businessList = useMemo(() => {
        if (isAdmin) return approvedAdminBusinesses ?? [];
        if (isSuperAdmin) return approvedSuperAdminBusinesses ?? [];
        return [];
    }, [isAdmin, isSuperAdmin, approvedAdminBusinesses, approvedSuperAdminBusinesses]);

    const businessOptions = businessList.map((business) => ({
        value: business.id,
        label: business.businessName,
    }));

    const selectedOption = businessOptions.find(opt => opt.value === selectedBusinessId);

    // Select first approved business by default
    useEffect(() => {
        if (
            module === 'Survey' &&
            businessList.length > 0 &&
            !selectedBusinessId
        ) {
            const firstBusinessId = businessList[0].id;
            setSelectedBusinessId(firstBusinessId);
            setBusiness?.(firstBusinessId);
        }
    }, [module, businessList, setBusiness, selectedBusinessId]);

    // Handle loading and error states
    if (module === 'Survey') {
        if (isAdmin) {
            if (isLoadingUseAdminBusiness) return <p><Spinner /></p>;
            if (errorAdminUserBusiness) return <p>Error loading businesses</p>;
            if (!approvedAdminBusinesses?.length) return <p>No business attached</p>;
        }

        if (isSuperAdmin) {
            if (isLoadingBusiness) return <p><Spinner /></p>;
            if (errorBusiness) return <p>Error loading businesses</p>;
            if (!approvedSuperAdminBusinesses?.length) return <p>No business found</p>;
        }
    }

   
    return (
        <div className="w-full mt-2">
            <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-md">
                    Hi {name}, here’s your platform overview for today
                </p>

                <div className="flex items-center justify-end gap-2 mb-1">
                    <select
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                        value={module}
                        onChange={(e) => setModule(e.target.value)}
                    >
                        <option value="Data Flywheel">Data Flywheel</option>
                        <option value="Survey">Survey</option>
                    </select>

                    {(isAdmin || isSuperAdmin)  && (
                        <Select
                            className="w-[200px] text-sm"
                            styles={ customStyles }
                            options={businessOptions}
                            value={selectedOption}
                            onChange={(selected) => {
                                const newValue = selected?.value || '';
                                setSelectedBusinessId(newValue);
                                setBusiness?.(newValue);
                                setModule?.(module);
                            }}
                            placeholder="Select the business..."
                            isSearchable
                        />
                    )}
                </div>
            </div>

            <p className="text-sm text-gray-600">
                All systems operational. Last sync: 10 mins ago
            </p>
        </div>
    );
};

 export const customStyles = {
        control: (base: any) => ({
            ...base,
            minHeight: '28px',        // Reduce overall control height
            height: '28px',
            fontSize: '0.875rem',     // text-sm
        }),
        dropdownIndicator: (base: any) => ({
            ...base,
            padding: '4px',
        }),
        clearIndicator: (base: any) => ({
            ...base,
            padding: '4px',
        }),
        valueContainer: (base: any) => ({
            ...base,
            padding: '0px 6px',
        }),
        input: (base: any) => ({
            ...base,
            margin: 0,
            padding: 0,
        }),
        indicatorsContainer: (base: any) => ({
            ...base,
            height: '28px',
        }),
    };

export default PlatformOverviewHeader;
