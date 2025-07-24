import ErrorMessage from '@/app/components/form/ErrorMessage';
import axios from '@/app/lib/axios';
import { DepartmentSchema } from '@/app/lib/type';
import { departmentSchema } from '@/app/lib/validationSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Check, MonitorCog, X } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useUpdateDepartment } from '../_features/hook';
import { getBusinessId } from '@/app/utils/user/userData';
import { Spinner } from '@radix-ui/themes';

interface Props {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    uniqueId: string;
    department: {
        departmentName: string;
        departmentDescription: string;
    };
}

const EditDepartment: React.FC<Props> = ({ setOpen, uniqueId, department }) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();
    const businessUserId = getBusinessId() ?? '';

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<DepartmentSchema>({
        resolver: zodResolver(departmentSchema),
        defaultValues: {
            departmentName: department.departmentName,
            departmentDescription: department.departmentDescription,
        },
    });

    const { mutateAsync: updateDepartment, isSuccess } = useUpdateDepartment({ axios });

    const onSubmit = async (formData: DepartmentSchema) => {
        try {
            const fullData = {
                ...formData,
                businessUserId,
            };
            await updateDepartment({ id: uniqueId, data: fullData });
            // toast.success('Department updated successully')
        } catch (error: any) {
            toast.error(error?.message || 'Failed to update department');
        }
    };


    useEffect(() => {
        if (isSuccess) {
            queryClient.invalidateQueries({ queryKey: ['departments'] });
            toast.success(`Department updated successfully`);
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
                className="bg-white p-6 rounded-md shadow-md w-82 md:w-full max-w-lg z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >

                <button
                    onClick={() => setOpen(false)}
                    className='flex w-full justify-end hover:cursor-pointer'
                >
                    <X size={22} className='text-red-500' />
                </button>

                <div className="flex justify-center mt-5">
                    <div className='bg-gray-100 rounded-full px-3 py-3'>
                        <MonitorCog size={15} className="" />
                    </div>
                </div>
                <div className="items-center text-center mt-5">
                    <h2 className="text-md font-semibold text-black mb-4">Edit Department</h2>
                    <p>Fill in the details below to edit the department</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-5 lg:mt-12">
                    <div>
                        <input
                            {...register("departmentName")}
                            type="text"
                            placeholder="Department name"
                            className="w-full border border-gray-200 rounded px-3 py-2 outline-none"
                        />
                        <ErrorMessage>{errors.departmentName?.message}</ErrorMessage>
                    </div>

                    <div>
                        <textarea
                            {...register("departmentDescription")}
                            placeholder="Department description"
                            className="w-full border border-gray-200 rounded px-3 py-2 outline-none"
                        />
                        <ErrorMessage>{errors.departmentDescription?.message}</ErrorMessage>
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
                            className="flex justify-center items-center w-full py-2 rounded-md text-white bg-blue-600 hover:cursor-pointer"
                        >
                            {isSubmitting ? (
                                <Spinner className='inline mr-1' />
                            ):(
                                <Check size={14} className='mr-1 inline'/>
                            )}
                            {isSubmitting ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditDepartment;
