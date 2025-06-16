'use client';

import { useState, useRef, useEffect } from 'react';
import { UserRoundMinus, UserRoundX, Eye, Check } from 'lucide-react';
import PopUp from '../pop-up/PopUp';
import Link from 'next/link'

interface ActionDropdownMenuProps {
	Id: string | number;
	certificate?: string | number | boolean | null | undefined;
	businessUserId?: string | number | boolean | null | undefined;
	onViewProfile?: () => void;
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
		onViewProfile, 
		suspendAction, 
		deleteAction, 
		editAction, 
		viewAction, 
		reviewAction
	}: ActionDropdownMenuProps) => {
	const [open, setOpen] = useState(false);
	const [openSuspend, setOpenSuspend] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [openView, setOpenView] = useState(false);
	const [openReview, setOpenReview] = useState(false);

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
				className="text-gray-500 hover:text-black hover:cursor-pointer rounded px-2 py-1 bg-gray-100 focus:outline-none"
			>
				&#8942;
			</button>

			{openSuspend && suspendAction && (
				<PopUp
					setOpen={setOpenSuspend}
					title="Suspend"
					label="Suspend"
					subTitle="Are you sure you want to suspend?"
					message={suspendAction.message || 'Suspended successfully'}
					endPoint={suspendAction.endPoint}
					method={suspendAction.method}
					Id={Id}
					payload={suspendAction.payload}
				/>
			)}

			{openDelete && deleteAction && (
				<PopUp
					setOpen={setOpenDelete}
					title="Delete"
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
					label="Review"
					subTitle="KYC Review"
					message={reviewAction.message || ''}
					endPoint={reviewAction.endPoint}
					method={reviewAction.method}
					Id={Id}
					businessUserId={businessUserId}
					payload={reviewAction.payload}
				/>
			)}

			{open && (
				<div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-md border border-gray-100 z-50">
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
