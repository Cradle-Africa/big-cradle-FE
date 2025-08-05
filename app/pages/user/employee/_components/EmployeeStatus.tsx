import axios from '@/app/lib/axios';
import { useQueryClient } from '@tanstack/react-query';
import { Check, X } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { Spinner } from '@radix-ui/themes';
import { useActivateEmployee, useSuspendEmployee } from '../_features/hook';
import { Employee } from '@/app/lib/type';

interface Props {
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	uniqueId: string;
	suspend: boolean;
	activate: boolean;
	employee: Employee;
}

const EmployeeStatus: React.FC<Props> = ({ setOpen, uniqueId, suspend, activate }) => {
	const menuRef = useRef<HTMLDivElement>(null);
	const queryClient = useQueryClient();

	const {
		mutateAsync: suspendEmployee,
		isSuccess: isSuccessSuspend,
		isPending: isPendingSuspend,
	} = useSuspendEmployee({ axios });

	const onSubmitSuspend = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await suspendEmployee({ id: uniqueId });
		} catch (error: any) {
			toast.error(error?.message || 'Failed to suspend employee');
		}
	};


	const {
		mutateAsync: activateEmployee,
		isSuccess: isSuccessActivate,
		isPending: isPendingActivate,
	} = useActivateEmployee({ axios });

	const onSubmitActivate = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await activateEmployee({ id: uniqueId });
		} catch (error: any) {
			toast.error(error?.message || 'Failed to suspend employee');
		}
	};

	useEffect(() => {
		if (isSuccessSuspend) {
			queryClient.invalidateQueries({ queryKey: ['employees'] });
			toast.success('Employee suspended successfully');
			setOpen(false);
		}

		if (isSuccessActivate) {
			queryClient.invalidateQueries({ queryKey: ['employees'] });
			toast.success('Employee activated successfully');
			setOpen(false);
		}

		const handler = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};

		document.addEventListener('mousedown', handler);
		return () => document.removeEventListener('mousedown', handler);
	}, [isSuccessSuspend, isSuccessActivate, queryClient, setOpen]);

	return (
		<div>
			<div className="fixed inset-0 bg-[#0000004D] bg-opacity-30 z-40"></div>

			<div
				ref={menuRef}
				className="bg-white p-6 rounded-md shadow-md w-82 md:w-full max-w-2xl z-50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
			>
				{suspend && (
					<div className="text-center mt-5">
						<div className="flex justify-center mt-5 mb-10">
							<div className='bg-red-100 rounded-full px-3 py-3'>
								<X size={15} className="text-red-600" />
							</div>
						</div>
						<h2 className="text-md font-semibold text-gray-700 mb-4">
							Suspend employee
						</h2>
						<p className="text-sm text-gray-600">
							Are you sure you want to suspend this employee?
						</p>
					</div>
				)}

				{activate && (
					<div className="text-center mt-5">
						<div className="flex justify-center mt-5 mb-10">
							<div className='bg-blue-100 rounded-full px-3 py-3'>
								<Check size={15} className="text-blue-600" />
							</div>
						</div>
						<h2 className="text-md font-semibold text-gray-700 mb-4">
							Activate employee
						</h2>
						<p className="text-sm text-gray-600">
							Are you sure you want to activate this employee?
						</p>
					</div>
				)}

				<form onSubmit={suspend ? onSubmitSuspend : onSubmitActivate} className="space-y-4 mt-5 lg:mt-12">
					<div className="flex justify-between mt-8 gap-2">
						<button
							type="button"
							onClick={() => setOpen(false)}
							className="w-1/2 py-2 bg-gray-100 rounded-md hover:text-white hover:bg-blue-600"
						>
							Cancel
						</button>

						{suspend && (
							<button
								type="submit"
								disabled={isPendingSuspend}
								className="w-1/2 flex justify-center items-center py-2 rounded-md text-white bg-red-600 hover:cursor-pointer"
							>
								{isPendingSuspend ? (
									<Spinner className="mr-1 inline" />
								) : (
									<Check size={14} className="mr-1 inline" />
								)}
								{isPendingSuspend ? 'Suspending...' : 'Suspend'}
							</button>
						)}

						{activate && (
							<button
								type="submit"
								disabled={isPendingActivate}
								className="w-1/2 flex justify-center items-center py-2 rounded-md text-white bg-blue-600 hover:cursor-pointer"
							>
								{isPendingActivate ? (
									<Spinner className="mr-1 inline" />
								) : (
									<Check size={14} className="mr-1 inline" />
								)}
								{isPendingActivate ? 'Activating...' : 'Activate'}
							</button>
						)}
					</div>
				</form>
			</div>
		</div>
	);
};

export default EmployeeStatus;
