'use client';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
// import { suspendUserService } from '../../services/user/userService';
import { UserRoundX } from 'lucide-react';

interface DeleteUserProps {
    openDelete: boolean;
    setOpenDelete: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteUser: React.FC<DeleteUserProps> = ({ setOpenDelete }) => {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpenDelete(false);
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
            // await deleteUserService();
            toast.dismiss();
            toast.success('User Deleted Successfully!');
            setOpenDelete(false);
        } catch (error: unknown) {
            toast.dismiss();
            if (error instanceof Error) {
                toast.error(error.message || 'User Deleted failed');
            } else {
                toast.error('Failed to delete user');
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
                    <UserRoundX size={60} className="text-red-700 bg-gray-100 rounded-full px-3 py-2" />
                </div>
                <div className="items-center text-center mt-5">
                    <h2 className="text-md font-semibold text-gray-700 mb-4">Delete User</h2>
                    <p className="text-sm text-gray-500">Are your sure you would like to delete this user?</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 mt-12">

                    <div className="flex gap-5 justify-center mt-5">
                        <button
                            type="button"
                            className="w-full hover:cursor-pointer bg-gray-300 text-gray-500 py-2 rounded-md hover:bg-blue-800 hover:text-white"
                            onClick={() => setOpenDelete(false)}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={'w-full py-2 rounded-md hover:cursor-pointer text-white bg-red-700  shadow-md hover:text-white hover:bg-red-800'}

                        >
                            {isSubmitting ? 'Deleting...' : 'Delete User'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default DeleteUser;
