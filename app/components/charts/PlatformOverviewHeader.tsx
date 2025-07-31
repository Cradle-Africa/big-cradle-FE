'use client';
import React from 'react';

interface PlatformOverviewHeaderProps {
    user: any;
    module: string;
    setModule: (value: string) => void;
}

const PlatformOverviewHeader: React.FC<PlatformOverviewHeaderProps> = ({ user, module, setModule }) => {
    const name =
        user?.data?.contactPersonFirstName ??
        user?.data?.firstName ??
        user?.data?.fullName ??
        user?.data?.businessFirstName ??
        '';

    return (
        <div className="w-full mt-2">
            <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-md">
                    Hi {name}, here’s your platform overview for today
                </p>
                <select
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                    value={module}
                    onChange={(e) => setModule(e.target.value)}
                >
                    <option value="Data Flywheel">Data Flywheel</option>
                    <option value="Survey">Survey</option>
                </select>
            </div>

            <p className="text-sm text-gray-600">
                All systems operational. Last sync: 10 mins ago
            </p>
        </div>
    );
};

export default PlatformOverviewHeader;
