'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '../utils/user/userData'; 

export const useAuthGuard = () => {
    const router = useRouter();

    useEffect(() => {
        const user = getUser();
        if (!user) {
            router.replace('/user/signin');
        }
    }, [router]);
};

// If the user is not logged in or not a super admin, redirect to sign-in page  
export const useSuperAdminGuard = () => {
    const router = useRouter();

    useEffect(() => {
        const user = getUser();
        if (!user || user.role !== 'super admin') {
            router.replace('/user/signin');
        }
    }, [router]);
};

// If the user is not logged in or not an admin, redirect to sign-in page  
export const useAdminGuard = () => {
    const router = useRouter();

    useEffect(() => {
        const user = getUser();
        if (!user || user.role !== 'admin') {
            router.replace('/user/signin');
        }
    }, [router]);
};
