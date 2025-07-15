import axios from '@/app/lib/axios';
import { useQueryClient } from '@tanstack/react-query';
import { Trash } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useDeletePipeline } from '../_features/hook';

interface Props {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    uniqueId: string;
    pipeline: {
        dataPointName: string;
    };
}

const EditPipeline: React.FC<Props> = ({ setOpen, uniqueId, pipeline }) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();

    const { mutateAsync: updatePipeline, isSuccess, isPending } = useDeletePipeline({ axios });

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updatePipeline({ id: uniqueId });
        } catch (error: any) {
            toast.error(error?.message || 'Failed to delete the data point');
        }
    };

    useEffect(() => {
        if (isSuccess) {
            queryClient.invalidateQueries({ queryKey: ['pipelines'] });
            toast.success(`Pipeline deleted successfully`);
            setOpen(false);
        }

        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isSuccess, queryClient, setOpen]);

    return (
        <div>
            <div className="fixed inset-0 bg-[#0000004D] bg-opacity-30 z-40"></div>

            <div
                ref={menuRef}
                className="bg-white p-6 rounded-md shadow-md w-82 md:w-full max-w-md z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
                <div className="flex justify-center mt-5">
                    <div className='bg-red-100 rounded-full px-3 py-3'>
                        <Trash size={15} className="text-red-500" />
                    </div>
                </div>
                <div className="items-center text-center mt-5">
                    <h2 className="text-md font-semibold text-gray-700 mb-4">Delete Data Pipeline { pipeline.dataPointName }</h2>
                     <p className="text-sm text-red-500">This action cannot be undone.</p>
                        <p className="text-sm text-gray-500">Are you sure you want to delete this data pipeline?</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-4 mt-5 lg:mt-12">
                    
                    <div className="flex justify-between mt-8 gap-5">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="w-full hover:cursor-pointer py-2 rounded-md hover:text-white hover:bg-blue-600"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full py-2 rounded-md text-white bg-red-600 hover:cursor-pointer"
                        >
                            {isPending ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPipeline;
