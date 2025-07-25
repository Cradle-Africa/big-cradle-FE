import axios from '@/app/lib/axios';
import { useQueryClient } from '@tanstack/react-query';
import { Check, X } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { Spinner } from '@radix-ui/themes';
import { useActivateDataPipeline, useSuspendDataPipeline } from '../_features/hook';


interface Props {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    uniqueId: string;
    activate: boolean;
    suspend: boolean;
    pipeline: {
        dataPointName: string;
    };
}

const DataPipelineStatus: React.FC<Props> = ({ setOpen, uniqueId, pipeline, activate, suspend }) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();

    const {
        mutateAsync: activateDataPoint,
        isSuccess: isSucessActivate,
        isPending: isPendingActivate
    } = useActivateDataPipeline({ axios });

    const onSubmitActivate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await activateDataPoint({ id: uniqueId });
        } catch (error: any) {
            toast.error(error?.message || 'Failed to activate a data point');
        }
    };


    const {
        mutateAsync: suspendDataPoint,
        isSuccess: isSucessSuspend,
        isPending: isPendingSuspend
    } = useSuspendDataPipeline({ axios });

    const onSubmitSuspend = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await suspendDataPoint({ id: uniqueId });
        } catch (error: any) {
            toast.error(error?.message || 'Failed to suspend a data pipeline');
        }
    };

    useEffect(() => {
        if (isSucessActivate) {
            queryClient.invalidateQueries({ queryKey: ['pipelines'] });
            toast.success(`Data pipeline Activated successfully`);
            setOpen(false);
        }

        if (isSucessSuspend) {
            queryClient.invalidateQueries({ queryKey: ['pipelines'] });
            toast.success(`Data pipeline Suspended successfully`);
            setOpen(false);
        }

        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isSucessActivate, isSucessSuspend, queryClient, setOpen]);


    return (

        <div>
            <div className="fixed inset-0 bg-[#0000004D] bg-opacity-30 z-40"></div>

            <div
                ref={menuRef}
                className="bg-white p-6 rounded-md shadow-md w-82 md:w-full max-w-md z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
                <div className="flex justify-center mt-5">
                    <div className={` ${activate ? 'bg-blue-100' : 'bg-red-100'}  rounded-full px-3 py-3`}>
                        {
                            activate ? (
                                <Check size={15} className="text-blue-600" />
                            ) :
                            (
                                <X size={15} className="text-red-500" />
                            )
                        }
                    </div>
                </div>
                {activate && (
                    <div className="items-center text-center mt-5">
                        <h2 className="text-md font-semibold text-gray-700 mb-4">Activate: {pipeline.dataPointName}</h2>
                        <p className="text-sm text-gray-600">Are you sure you want to activate this data pipeline?</p>
                    </div>
                )}

                {suspend && (
                    <div className="items-center text-center mt-5">
                        <h2 className="text-md font-semibold text-gray-700 mb-4">Suspend: {pipeline.dataPointName}</h2>
                        <p className="text-sm text-gray-600">Are you sure you want to suspend this data pipeline?</p>
                    </div>
                )}


                <form onSubmit={activate ? onSubmitActivate : onSubmitSuspend} className="space-y-4 mt-5 lg:mt-12">
                    <div className="flex justify-between mt-8 gap-2">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="w-1/2 hover:cursor-pointer py-2 bg-gray-100 rounded-md hover:text-white hover:bg-blue-600"
                        >
                            Cancel
                        </button>

                        {activate && (
                            <button
                                type="submit"
                                disabled={isPendingActivate}
                                className="flex justify-center items-center w-1/2 py-2 rounded-md text-white bg-blue-600 hover:cursor-pointer"
                            >
                                {isPendingActivate ? (
                                    <Spinner className='mr-1 inline' />
                                ) : (
                                    <> <Check size={14} className='mr-1 inline' /> </>
                                )}
                                {(isPendingActivate) ? 'Activating...' : 'Activate'}
                            </button>
                        )}

                        {suspend && (
                            <button
                                type="submit"
                                disabled={isPendingSuspend}
                                className="flex justify-center items-center w-1/2 py-2 rounded-md text-white bg-red-600 hover:cursor-pointer"
                            >
                                {isPendingSuspend ? (
                                    <Spinner className='mr-1 inline' />
                                ) : (
                                    <> <Check size={14} className='mr-1 inline' /> </>
                                )}
                                {isPendingSuspend ? 'Suspending...' : 'Suspend'}
                            </button>
                        )}

                    </div>
                </form>
            </div>
        </div>
    );
};

export default DataPipelineStatus;

