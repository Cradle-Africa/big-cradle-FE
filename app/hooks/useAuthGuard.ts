'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '../utils/userData'; 

export const useAuthGuard = () => {
    const router = useRouter();

    useEffect(() => {
        const user = getUser();
        if (!user) {
            router.replace('/user/signin');
        }
    }, [router]);
};
