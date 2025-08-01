'use client';

import React, { useEffect, useState } from 'react';
import { useAdminUserBusinesses } from '../dashboard/_features/hook';
import { Spinner } from '@radix-ui/themes';
import { Business } from '@/app/lib/type';

interface PlatformOverviewHeaderProps {
    user: any;
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
        user?.data?.contactPersonFirstName ??
        user?.data?.firstName ??
        user?.data?.fullName ??
        user?.data?.businessFirstName ??
        '';

    const [page] = useState(1);
    const limit = 10;
    const adminUserId = user?.data.id;
    // }
    const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);

    const {
        data: adminUserBusiness,
        isLoading: isLoadingUseAdminBusiness,
        error,
    } = useAdminUserBusinesses({ adminUserId, page, limit });

    // Select first business by default when data is available
    useEffect(() => {
            if (
                user?.data?.role === 'admin' &&
                module === 'Survey' &&
                adminUserBusiness?.length &&
                !selectedBusinessId
            ) {
                const firstBusinessId = adminUserBusiness[0].id;
                setSelectedBusinessId(firstBusinessId);
                setBusiness?.(firstBusinessId);
            }

    }, [user?.data?.role, module, adminUserBusiness, selectedBusinessId, setBusiness]);

    if (user?.data?.role === 'admin' && module === 'Survey') {
        if (isLoadingUseAdminBusiness) return <p><Spinner /></p>;
        if (error) return <p>Error loading businesses</p>;
        if (!adminUserBusiness || adminUserBusiness.length < 1) return <p>No business attached</p>;
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

                    {user?.data?.role === 'admin' && module === 'Survey' && (
                        <select
                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                            value={selectedBusinessId ?? ''}
                            onChange={(e) => {
                                const newValue = e.target.value;
                                setSelectedBusinessId(newValue);
                                setBusiness?.(newValue);
                            }}
                        >
                            <option value={''}>Select the business</option>
                            {adminUserBusiness?.map((business: Business, index: number) => (
                                <option key={index} value={business.id}>
                                    {business.businessName}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            <p className="text-sm text-gray-600">
                All systems operational. Last sync: 10 mins ago
            </p>
        </div>
    );
};

export default PlatformOverviewHeader;
