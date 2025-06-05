'use client';

import { useState, useRef, useEffect } from 'react';
import { UserRoundMinus, UserRoundX, Eye } from 'lucide-react';

export default function UserDropDownMenu() {
	const [open, setOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	// Close the menu if clicked outside
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
			{/* Three dots button */}
			<button
				onClick={() => setOpen(!open)}
				className="text-gray-500 hover:text-black rounded px-1 py-1 hover:cursor-pointer bg-gray-100 focus:outline-none"
			>
				&#8942; 
			</button>

			{/* Dropdown Menu */}
			{open && (
				<div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-md border border-gray-100 z-50">
					<ul className="py-1">
						<li className='px-1'>
							<button
								onClick={() => alert('View Profile')}
								className="w-full px-4 py-2 text-left text-sm rounded-md text-gray-700 hover:bg-gray-100 hover:cursor-pointer"
							>
								<div className="flex items-center gap-1">
									<Eye size={15} />
									View Profile
								</div>
							</button>
						</li>
						<li className='px-1'>
							<button
								onClick={() => alert('Suspend User')}
								className="w-full px-4 py-2 text-left text-sm rounded-md text-yellow-700 hover:bg-yellow-100 hover:cursor-pointer"
							>
								<div className="flex items-center gap-1">
									<UserRoundMinus size={15} />
									Suspend User
								</div>
							</button>
						</li>
						<li className='px-1'>
							<button
								onClick={() => alert('Delete User')}
								className="w-full px-4 py-2 text-left text-sm rounded-md text-red-700 hover:bg-red-100 hover:cursor-pointer"
							>
								<div className="flex items-center gap-1">
									<UserRoundX size={15} />
									Delete User
								</div>
							</button>
						</li>
					</ul>
				</div>
			)}
		</div>
	);
}
