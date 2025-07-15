import ErrorMessage from '@/app/components/form/ErrorMessage';
import axios from '@/app/lib/axios';
import { PipeLineSchema } from '@/app/lib/type';
import { pipeLineSchema } from '@/app/lib/validationSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Pencil } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useUpdatePipeline } from '../../_features/hook';
import { getBusinessId } from '@/app/utils/user/userData';
import { useFetchDepartments } from '../../../user/department/_features/hook';

interface Props {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    uniqueId: string;
    pipeline: {
        dataPointName: string;
        dataPointDescription: string;
        departmentId: string;
    };
}

const EditPipeline: React.FC<Props> = ({ setOpen, uniqueId, pipeline }) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();
    const businessUserId = getBusinessId() ?? '';

    const { data: departments } = useFetchDepartments({
        axios,
        queryParams: {
            businessUserId: businessUserId || undefined,
        },
    });
    const departmentData = departments?.data ?? [];

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<PipeLineSchema>({
        resolver: zodResolver(pipeLineSchema),
        defaultValues: {
            dataPointName: pipeline.dataPointName,
            dataPointDescription: pipeline.dataPointDescription,
            departmentId: pipeline.departmentId,
        },
    });

    const { mutateAsync: updatePipeline, isSuccess } = useUpdatePipeline({ axios });

    const onSubmit = async (formData: PipeLineSchema) => {
        try {
            const fullData = {
                ...formData,
                businessUserId,
            };
            await updatePipeline({ id: uniqueId, data: fullData });
        } catch (error: any) {
            toast.error(error?.message || 'Failed to update the pipeline');
        }
    };

    useEffect(() => {
        if (isSuccess) {
            queryClient.invalidateQueries({ queryKey: ['pipelines'] });
            toast.success(`Pipeline updated successfully`);
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
                    <div className='bg-gray-100 rounded-full px-3 py-3'>
                        <Pencil size={15} className="" />
                    </div>
                </div>
                <div className="items-center text-center mt-5">
                    <h2 className="text-md font-semibold text-gray-700 mb-4">Edit Data Point</h2>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-5 lg:mt-12">
                    <div>
                        <select
                            {...register("departmentId")}
                            className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 outline-none"
                        >
                            <option value="">Select the department</option>
                            {departmentData.map((department: any) => (
                                <option key={department.id} value={department.id}>
                                    {department.departmentName}
                                </option>
                            ))}
                        </select>
                        <ErrorMessage>{errors.departmentId?.message}</ErrorMessage>
                    </div>

                    <div>
                        <input
                            {...register("dataPointName")}
                            type="text"
                            placeholder="Data Point name"
                            className="w-full border border-gray-200 rounded px-3 py-2 outline-none"
                        />
                        <ErrorMessage>{errors.dataPointName?.message}</ErrorMessage>
                    </div>

                    <div>
                        <textarea
                            {...register("dataPointDescription")}
                            placeholder="Data Point description"
                            className="w-full border border-gray-200 rounded px-3 py-2 outline-none"
                        />
                        <ErrorMessage>{errors.dataPointDescription?.message}</ErrorMessage>
                    </div>

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
                            disabled={isSubmitting}
                            className="w-full py-2 rounded-md text-white bg-blue-600 hover:cursor-pointer"
                        >
                            {isSubmitting ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPipeline;
