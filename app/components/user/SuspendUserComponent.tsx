'use client';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
// import { suspendUserService } from '../../services/user/userService';
import { UserRoundMinus } from 'lucide-react';

interface SuspendUserProps {
    openSuspend: boolean;
    setOpenSuspend: React.Dispatch<React.SetStateAction<boolean>>;
}

const SuspendUser: React.FC<SuspendUserProps> = ({ setOpenSuspend }) => {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpenSuspend(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsSubmitting(true);

        try {
            toast.loading('Verifying OTP...');
            // await suspendUserService();
            toast.dismiss();
            toast.success('User Suspended Successfully!');
            setOpenSuspend(false);
        } catch (error: unknown) {
            toast.dismiss();
            if (error instanceof Error) {
                toast.error(error.message || 'User Suspension failed');
            } else {
                toast.error('User Suspension     failed');
            }
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <>
            <div className="fixed inset-0 bg-[#0000004D] bg-opacity-30 z-40"></div>
            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" ref={menuRef}>
                <div className='flex justify-center'>
                    <UserRoundMinus size={60} className="text-blue-700 bg-gray-100 rounded-full px-3 py-2" />
                </div>
                <div className="items-center text-center mt-5">
                    <h2 className="text-md font-semibold text-gray-700 mb-4">Suspend User</h2>
                    <p className="text-sm text-gray-500">Are you sure you would like to suspend this user?</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 mt-12">

                    <div className="flex gap-5 justify-center mt-5">
                        <button
                            type="button"
                            className="w-full hover:cursor-pointer bg-gray-300 text-gray-500 py-2 rounded-md hover:bg-blue-800 hover:text-white"
                            onClick={() => setOpenSuspend(false)}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={'w-full py-2 rounded-md hover:cursor-pointer text-white bg-red-700  shadow-md hover:text-white hover:bg-red-800'}

                        >
                            {isSubmitting ? 'Suspending...' : 'Suspend'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default SuspendUser;
