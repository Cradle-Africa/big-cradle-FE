import ErrorMessage from '@/app/components/form/ErrorMessage';
import axios from '@/app/lib/axios';
import { DepartmentSchema } from '@/app/lib/type';
import { departmentSchema } from '@/app/lib/validationSchemas';
import { getBusinessId } from '@/app/utils/user/userData';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { MonitorCog } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useCreateDepartment } from '../_features/hook';

interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewDepartment: React.FC<Props> = ({ setOpen }) => {
  const businessUserId = getBusinessId();
  const menuRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DepartmentSchema>({
    resolver: zodResolver(departmentSchema),
  });

  const {
    mutateAsync: createDepartment,
    isSuccess: isCreateSuccess,
  } = useCreateDepartment({ axios });

  const onSubmit = async (data: DepartmentSchema) => {
    try {
      await createDepartment({ ...data, businessUserId });
    } catch (error: any) {
      toast.error(error?.message || "Failed to create department");
    }
  };

  useEffect(() => {
    if (isCreateSuccess) {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success(`Department created successfully`);
      setOpen(false);
    }

    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isCreateSuccess, queryClient, setOpen]);

  return (
    <div>
      <div className="fixed inset-0 bg-[#0000004D] bg-opacity-30 z-40"></div>

      <div
        ref={menuRef}
        className="bg-white p-6 rounded-md shadow-md w-82 md:w-full max-w-md z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <div className="flex justify-center mt-5">
          <MonitorCog size={60} className="bg-gray-100 rounded-full px-3 py-3" />
        </div>
        <div className="items-center text-center mt-5">
          <h2 className="text-md font-semibold text-gray-700 mb-4">Create Department</h2>
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
            <input
              {...register("departmentDescription")}
              type="text"
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
              className="w-full py-2 rounded-md text-white bg-blue-600 hover:cursor-pointer"
            >
              {isSubmitting ? "Processing..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewDepartment;
