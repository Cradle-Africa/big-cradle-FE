'use client';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { apiPostService } from '../../services/apiService';
import { Check, LucideIcon } from 'lucide-react';
import IconComponent from './IconComponent';
import FormPopup from '../../components/pop-up/PopUpForm';
import { Spinner } from '@radix-ui/themes';

interface PopUpProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    title: string;
    Icon: LucideIcon,
    label: string;
    subTitle: string;
    message: string;
    endPoint?: string;
    method: string;
    Id: string | number;
    certificate?: string | number | boolean | null | undefined;
    businessUserId?: string | number | boolean | null | undefined;
    adminUserId?: string | number | boolean | null | undefined;
    payload?: Record<string, unknown> | undefined;
}

const PopUp: React.FC<PopUpProps> = ({ setOpen, title, Icon, label, subTitle, message, endPoint, method, Id, certificate, businessUserId, adminUserId, payload }) => {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [setOpen]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const endPoint_ = endPoint + '/' + Id;
        try {
            toast.loading('Loading...');
            await apiPostService(endPoint_, method, payload || {});
            toast.dismiss();
            toast.success(message);
            setOpen(false);
        } catch (error: unknown) {
            toast.dismiss();
            if (error instanceof Error) {
                toast.error(error.message || 'success');
            } else {
                console.log('Request Failed');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <div className="fixed inset-0 bg-[#0000004D] bg-opacity-30 z-40"></div>
            {!certificate && endPoint && (
                <div className="bg-white p-6 rounded-md shadow-md w-82 md:w-full max-w-md z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" ref={menuRef}>
                    <div className='flex justify-center'>
                        <IconComponent
                            Icon={Icon}
                            label={label}
                        />
                    </div>
                    <div className="items-center text-center mt-5">
                        <h2 className="text-md font-semibold text-gray-700 mb-4">{title}</h2>
                        <p className="text-sm text-gray-500">{subTitle}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-5 lg:mt-12">
                        <div className="flex gap-5 justify-center mt-5">
                            <button
                                type="button"
                                className="w-1/2 hover:cursor-pointer bg-gray-100 text-black py-2 rounded-md hover:bg-blue-600 hover:text-white cursor-pointer"
                                onClick={() => { setOpen(false); }}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={'w-1/2 flex justify-center px-4 items-center py-2 rounded-md bg-blue-600 hover:text-white cursor-pointer'}
                            >
                                {isSubmitting ? (
                                    <Spinner className='inline mr-1' />
                                ) : (
                                    <Check size={14} className="inline mr-1" />
                                )
                                }
                                {isSubmitting ? 'Processing...' : title}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {setOpen && businessUserId && endPoint && (
                <>
                    {!adminUserId && (
                        <div className="bg-white p-6 rounded-md shadow-md w-82 md:w-full max-w-md z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" ref={menuRef}>
                            <FormPopup
                                setOpen={setOpen}
                                title={title}
                                method={method || 'POST'}
                                endPoint={endPoint}
                                fields={[
                                    { name: 'businessUserId', label: '', type: 'hidden', required: true },
                                    {
                                        name: 'action', label: 'Action', type: 'select', required: true,
                                        options: [
                                            { label: 'Approved', value: 'approved' },
                                            { label: 'Rejected', value: 'rejected' },
                                        ]
                                    },
                                    { name: 'reason', label: 'Reason', type: 'text', required: true },


                                ]}
                                defaultValues={{ businessUserId: businessUserId || '' }}
                            />
                        </div>
                    )}

                    {adminUserId && (
                        <div className="bg-white p-6 rounded-md shadow-md w-82 md:w-full max-w-md z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" ref={menuRef}>
                            <FormPopup
                                setOpen={setOpen}
                                title={title}
                                method={method || 'POST'}
                                endPoint={endPoint}
                                fields={[
                                    { name: 'businessUserId', label: '', type: 'hidden', required: true },
                                    { name: 'adminUserId', label: '', type: 'hidden', required: true },
                                    {
                                        name: 'action', label: 'Action', type: 'select', required: true,
                                        options: [
                                            { label: 'Approved', value: 'approved' },
                                            { label: 'Rejected', value: 'rejected' },
                                        ]
                                    },
                                    { name: 'reason', label: 'Reason', type: 'text', required: true },


                                ]}
                                defaultValues={{
                                    businessUserId: businessUserId || '',
                                    adminUserId: adminUserId || '',
                                }}
                            />
                        </div>
                    )}
                </>
            )}

            {certificate && (
                <div className="bg-white p-6 rounded-md  shadow-md w-82 h-[300px] md:h-[500px] md:w-3/4 z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" ref={menuRef}>
                    <div className='flex w-full h-full border border-gray-100 rounded-md'>
                        <iframe
                            src={typeof certificate === 'string' ? certificate : ''}
                            className="flex w-full h-full"
                            width={100}
                            title="Certificate of corporation Preview"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PopUp;
