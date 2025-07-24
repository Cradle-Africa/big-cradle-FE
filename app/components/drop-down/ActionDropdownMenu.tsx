'use client';

import { useState, useRef, useEffect } from 'react';
import { UserRoundMinus, UserRoundX, Eye, Check, LockKeyhole, Trash2Icon, Pencil, PenLine, MoreVertical } from 'lucide-react';
import PopUp from '../pop-up/PopUp';
import Link from 'next/link'

interface ActionDropdownMenuProps {
	Id: string | number;
	certificate?: string | number | boolean | null | undefined;
	businessUserId?: string | number | boolean | null | undefined;
	adminUserId?: string | number | boolean | null | undefined;
	onViewProfile?: () => void;
	resetPasswordAction?: {
		endPoint: string;
		method: string;
		payload?: Record<string, unknown>;
		message?: string;
	};
	suspendAction?: {
		endPoint: string;
		method: string;
		payload: Record<string, unknown>;
		message?: string;
	};
	deleteAction?: {
		endPoint: string;
		method: string;
		payload: Record<string, unknown>;
		message?: string;
	};
	editAction?: {
		endPoint: string;
		method: string;
		payload: Record<string, unknown>;
		message?: string;
	};
	viewAction?: {
		endPoint: string;
		method: string;
		payload: Record<string, unknown>;
		message?: string;
	};
	reviewAction?: {
		endPoint: string;
		method: string;
		payload: Record<string, unknown>;
		message?: string;
	};
}

const ActionDropdownMenu: React.FC< ActionDropdownMenuProps> =(
	{	Id, 
		certificate, 
		businessUserId,
		adminUserId,
		onViewProfile, 
		suspendAction, 
		deleteAction, 
		editAction, 
		viewAction, 
		reviewAction,
		resetPasswordAction,
	}: ActionDropdownMenuProps) => {
	const [open, setOpen] = useState(false);
	const [openSuspend, setOpenSuspend] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [openView, setOpenView] = useState(false);
	const [openReview, setOpenReview] = useState(false);
	const [openResetPassword, setOpenResetPassword] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener('mousedown', handler);
		return () => document.removeEventListener('mousedown', handler);
	}, []);

	return (
		<div className="relative inline-block text-left" ref={menuRef}>
			<button
				onClick={() => setOpen(!open)}
				className="text-gray-500 hover:cursor-pointer rounded-lg px-2 py-2 bg-gray-100 hover:bg-blue-600 hover:text-white focus:outline-none"
			>
				<MoreVertical size={15} />
			</button>

			{openSuspend && suspendAction && (
				<PopUp
					setOpen={setOpenSuspend}
					title="Suspend"
					Icon={ UserRoundX }
					label="Suspend"
					subTitle="Are you sure you want to suspend?"
					message={suspendAction.message || 'Suspended successfully'}
					endPoint={suspendAction.endPoint}
					method={suspendAction.method}
					Id={Id}
					payload={suspendAction.payload}
				/>
			)}

			{openResetPassword && resetPasswordAction && (
				<PopUp
					setOpen={setOpenResetPassword}
					title="Reset Password"
					Icon={ LockKeyhole }
					label="Reset Password"
					subTitle="Are you sure you want to reset the password?"
					message={resetPasswordAction.message || 'Paaword Reset successfully'}
					endPoint={resetPasswordAction.endPoint}
					method={resetPasswordAction.method}
					Id={Id}
					// payload={resetPasswordAction.payload}
				/>
			)}

			{openDelete && deleteAction && (
				<PopUp
					setOpen={setOpenDelete}
					title="Delete"
					Icon={ Trash2Icon }
					label="Delete"
					subTitle="Are you sure you want to delete?"
					message={deleteAction.message || 'Deleted successfully'}
					endPoint={deleteAction.endPoint}
					method={deleteAction.method}
					Id={Id}
					payload={deleteAction.payload}
				/>
			)}

			{openEdit && editAction && (
				<PopUp
					setOpen={setOpenEdit}
					title="Edit"
					Icon={ Pencil }
					label="Edit"
					subTitle="Are you sure you want to edit?"
					message={editAction.message || 'Edited successfully'}
					endPoint={editAction.endPoint}
					method={editAction.method}
					Id={Id}
					payload={editAction.payload}
				/>
			)}

			{openView && viewAction && (
				<PopUp
					setOpen={setOpenView}
					title="View"
					Icon={Eye}
					label="View"
					subTitle="View information"
					message={viewAction.message || 'View'}
					method={viewAction.method}
					Id={Id}
					certificate={certificate}
					payload={viewAction.payload}
				/>
			)}

			{openReview && reviewAction && (
				<PopUp
					setOpen={setOpenReview}
					title="KYC Review"
					Icon={ PenLine }
					label="Review"
					subTitle="KYC Review"
					message={reviewAction.message || ''}
					endPoint={reviewAction.endPoint}
					method={reviewAction.method}
					Id={Id}
					businessUserId={businessUserId}
					adminUserId={adminUserId}
					payload={reviewAction.payload}
				/>
			)}

			{open && (
				<div className="absolute right-0  w-40 bg-white rounded-md shadow-md border border-gray-100 z-50">
					<ul className="py-1">
						{onViewProfile && (
							<li className="px-1">
								<Link
									href='/user/user-management/user-directory/user-detail'
									className="flex w-full px-4 py-2 text-left text-sm rounded-md text-gray-700 hover:bg-gray-100 hover:cursor-pointer"
								>
									<div className="flex items-center gap-1">
										<Eye size={15} />
										View Profile
									</div>
								</Link>
							</li>
						)}

						{resetPasswordAction && (
							<li className="px-1">
								<button
									onClick={() => {
										setOpenResetPassword(true);
										setOpen(false);
									}}
									className="w-full px-4 py-2 text-left text-sm rounded-md text-red-700 hover:bg-red-100 hover:cursor-pointer"
								>
									<div className="flex items-center gap-1">
										<LockKeyhole size={13} />
										Reset Password
									</div>
								</button>
							</li>
						)}

						{suspendAction && (
							<li className="px-1">
								<button
									onClick={() => {
										setOpenSuspend(true);
										setOpen(false);
									}}
									className="w-full px-4 py-2 text-left text-sm rounded-md text-yellow-700 hover:bg-yellow-100 hover:cursor-pointer"
								>
									<div className="flex items-center gap-1">
										<UserRoundMinus size={13} />
										Suspend 
									</div>
								</button>
							</li>
						)}

						{deleteAction && (
							<li className="px-1">
								<button
									onClick={() => {
										setOpenDelete(true);
										setOpen(false);
									}}
									className="w-full px-4 py-2 text-left text-sm rounded-md text-red-700 hover:bg-red-100 hover:cursor-pointer"
								>
									<div className="flex items-center gap-1">
										<UserRoundX size={13} />
										Delete 
									</div>
								</button>
							</li>
						)}

						{editAction && (
							<li className="px-1">
								<button
									onClick={() => {
										setOpenEdit(true);
										setOpen(false);
									}}
									className="w-full px-4 py-2 text-left text-sm rounded-md text-blue-600 hover:bg-blue-100 hover:cursor-pointer"
								>
									<div className="flex items-center gap-1">
										<UserRoundX size={13} />
										Edit
									</div>
								</button>
							</li>
						)}

						{viewAction && certificate && (
							<li className="px-1">
								<button
									onClick={() => {
										setOpenView(true);
										setOpen(false);
									}}
									className="w-full px-4 py-2 text-left text-sm rounded-md text-blue-600 hover:bg-blue-100 hover:cursor-pointer"
								>
									<div className="flex items-center gap-1">
										<Eye size={13} />
										View
									</div>
								</button>
							</li>
						)}

						{reviewAction && (
							<li className="px-1">
								<button
									onClick={() => {
										setOpenReview(true);
										setOpen(false);
									}}
									className="w-full px-4 py-2 text-left text-sm rounded-md text-blue-600 hover:bg-blue-100 hover:cursor-pointer"
								>
									<div className="flex items-center gap-1">
										<Check size={13} />
										Review
									</div>
								</button>
							</li>
						)}
					</ul>
				</div>
			)}
		</div>
	);
}

export default ActionDropdownMenu
