import { Suspense } from 'react';
import SignUpContent from './SignUpContent';
import SignUpSkeleton from '@/app/components/skeleton/SignUpSkeleton';
export default function SignUpPage() {
    return (
        <Suspense fallback={
            <SignUpSkeleton/>
        }>
            <SignUpContent />
        </Suspense>
    );
}
