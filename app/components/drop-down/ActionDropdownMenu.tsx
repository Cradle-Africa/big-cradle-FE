'use client';

import { useState, useRef, useEffect } from 'react';
import { UserRoundMinus, UserRoundX, Eye } from 'lucide-react';
import PopUp from '../pop-up/PopUp';
import Link from 'next/link'

interface ActionDropdownMenuProps {
	Id: string | number;
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
}

const ActionDropdownMenu: React.FC< ActionDropdownMenuProps> =({Id, onViewProfile, suspendAction, deleteAction}: ActionDropdownMenuProps) => {
	const [open, setOpen] = useState(false);
	const [openSuspend, setOpenSuspend] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);
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
					title="Suspend User"
					label="Suspend"
					subTitle="Are you sure you want to suspend this user?"
					message={suspendAction.message || 'User suspended successfully'}
					endPoint={suspendAction.endPoint}
					method={suspendAction.method}
					Id={Id}
					payload={suspendAction.payload}
				/>
			)}

			{openDelete && deleteAction && (
				<PopUp
					setOpen={setOpenDelete}
					title="Delete User"
					label="Delete"
					subTitle="Are you sure you want to delete this user?"
					message={deleteAction.message || 'User deleted successfully'}
					endPoint={deleteAction.endPoint}
					method={deleteAction.method}
					Id={Id}
					payload={deleteAction.payload}
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
										<UserRoundMinus size={15} />
										Suspend User
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
										<UserRoundX size={15} />
										Delete User
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
