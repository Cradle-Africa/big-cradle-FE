import ErrorMessage from '@/app/components/form/ErrorMessage';
import axios from '@/app/lib/axios';
import { ReviewBusinessKycSchema } from '@/app/lib/type';
import { reviewBusinessKycSchema } from '@/app/lib/validationSchemas';
import { getAdminUserId } from '@/app/utils/user/userData';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Pencil } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useReviewBusinessKyc } from '../_features/hook';

interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  businessUserId: string;
}
const ReviewBusinessKyc: React.FC<Props> = ({ setOpen, businessUserId }) => {
  const adminUserId = getAdminUserId() ?? '';
  const menuRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReviewBusinessKycSchema>({
    resolver: zodResolver(reviewBusinessKycSchema),
  });

  const {
    mutateAsync: reviewBusiness,
    isSuccess: isReviewSuccess,
  } = useReviewBusinessKyc({ axios });

const onSubmit = async (data: ReviewBusinessKycSchema) => {
    try {
      await reviewBusiness({ ...data, businessUserId, adminUserId });
    } catch (error: any) {
      toast.error(error?.message || "Failed to review the kyc");
    }
  };

  useEffect(() => {
    if (isReviewSuccess) {
      queryClient.invalidateQueries({ queryKey: ["businesses-kyc"] });
      toast.success(`Business kyc reviewed successfully`);
      setOpen(false);
    }

    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isReviewSuccess, queryClient, setOpen]);

  return (
    <div>
      <div className="fixed inset-0 bg-[#0000004D] bg-opacity-30 z-40"></div>

      <div
        ref={menuRef}
        className="bg-white p-6 rounded-md shadow-md w-82 md:w-full max-w-md z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <div className="flex justify-center mt-5">
          <div className='bg-gray-100 rounded-full px-2 py-2'>
            <Pencil size={24} className="" />
          </div>
        </div>
        <div className="items-center text-center mt-5">
          <h2 className="text-md font-semibold text-gray-700 mb-4">Review Business Kyc</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-5 lg:mt-12">
          <div className='relative'>

            <select
              {...register("action")}
              className="w-full border border-gray-200 rounded px-3 py-2 outline-none"
            >
              <option value="">Select action</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <ErrorMessage>{errors.action?.message}</ErrorMessage>

            <textarea
              {...register("reason")}
              placeholder="Enter reason"
              className="mt-5 w-full border border-gray-200 rounded px-3 py-2 outline-none"
            />
            <ErrorMessage>{errors.reason?.message}</ErrorMessage>

          </div>

          <div className="flex justify-between mt-8 gap-5">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full border border-gray-400 hover:cursor-pointer py-2 rounded-md hover:text-white hover:bg-blue-600"
            >
              Close
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

export default ReviewBusinessKyc;
