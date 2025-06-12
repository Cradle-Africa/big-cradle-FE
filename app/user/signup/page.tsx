import { Suspense } from 'react';
import SignUpContent from './SignUpContent';

export default function SignUpPage() {
    return (
        <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
            <SignUpContent />
        </Suspense>
    );
}
