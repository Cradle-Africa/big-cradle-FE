"use client";
import classNames from "classnames";
import {
	Banknote,
	Building2,
	ChevronDown,
	ChevronUp,
	CircleArrowDown,
	CircleArrowUp,
	Coins,
	House,
	UsersRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { JSX, useState } from "react";
import SideBarWrapper from "./SideBarWrapper";
export default function SuperAdminSidebar() {
	const currentPath = usePathname();
	const transactionOpenInit = [
		"/pages/transactions/inflow",
		"/pages/transactions/payout",
		"/pages/transactions/binance",
	].includes(currentPath);

	const usersMenuOpenInit = [
		"/pages/user/business/",
		"/pages/user/admin/",
	].includes(currentPath);

	const kycMenuOpenInit = [
		"/pages/user/business/business-kyc/",
		"/pages/user/admin/admin-kyc/",
		"/pages/user/researcher-kyc/",
	].includes(currentPath);

	const [transactionOpen, setTransactionMenuOpen] = useState(transactionOpenInit);
	const [usersMenuOpen, setUsersMenuOpen] = useState(usersMenuOpenInit);
	const [kycMenuOpen, setKycMenuOpen] = useState(kycMenuOpenInit);


	return (
		<SideBarWrapper>
			<ul
				className="bg-[#004484] rounded-lg mt-4 text-[#C1C1C1] p-4 flex flex-col gap-4
          "
			>
				{sideBarLinks.map((link) => (
					<li key={link.label}>
						<Link
							href={link.href} //
							className={classNames({
								"block py-2 px-3 rounded hover:bg-gray-200 hover:text-[#002648] transition":
									true,
								"bg-gray-200 text-[#002648] ":
									currentPath === link.href.split("?")[0],
							})}
						>
							<div className="flex gap-1 items-center ">
								{link.icon}
								{link.label}
							</div>
						</Link>
					</li>
				))}

				{/* transactions */}
				<li>
					<div
						onClick={() => {
							setTransactionMenuOpen(!transactionOpen);
							setKycMenuOpen(false);
							setUsersMenuOpen(false);
							
						}}
						className={classNames({
							"block py-2 px-3 rounded hover:bg-gray-200 hover:text-[#002648] transition cursor-pointer": true,
							"bg-gray-200 text-[#002648]": transactionOpenInit,
						})}
					>
						<div className="flex gap-1 items-center justify-between">
							<div className="flex gap-1 items-center">
								<Banknote size={15} />
								Transactions
							</div>
							{transactionOpen ? (
								<ChevronUp size={15} />
							) : (
								<ChevronDown size={15} />
							)}
						</div>
					</div>
					{transactionOpen && (
						<div className="ml-6 mt-1 space-y-1">
							<Link
								href="/pages/transactions/inflow"
								className={classNames({
									"py-1 px-3 rounded hover:text-[#002648] hover:bg-gray-200 transition text-sm flex items-center gap-2":
										true,
									"bg-gray-200 text-[#002648] ":
										currentPath === "/pages/transactions/inflow",
								})}
							>
								<CircleArrowDown size={14} />
								In flow
							</Link>
							{/* <Link
								href="/pages/transactions/outflow"
								className="py-1 px-3 rounded hover:text-[#002648] hover:bg-gray-200 transition text-sm flex items-center gap-2"
							>
								<CircleArrowUp  size={14} />
								Out flow
							</Link> */}
							<Link
								href="/pages/transactions/payout"
								className={classNames({
									"py-1 px-3 rounded hover:text-[#002648] hover:bg-gray-200 transition text-sm flex items-center gap-2":
										true,
									"bg-gray-200 text-[#002648] ":
										currentPath === "/pages/transactions/payout",
								})}
							>
								<CircleArrowUp  size={14} />
								Payout
							</Link>
							<Link
								href="/pages/transactions/binance"
								className={classNames({
									"py-1 px-3 rounded hover:text-[#002648] hover:bg-gray-200 transition text-sm flex items-center gap-2":
										true,
									"bg-gray-200 text-[#002648] ":
										currentPath === "/pages/transactions/binance",
								})}
							>
								<Coins size={14} />
								Binance
							</Link>
						</div>
					)}
				</li>

				{/* users */}
				<li>
					<div
						onClick={() => {
							setUsersMenuOpen(!usersMenuOpen);
							setKycMenuOpen(false);
							setTransactionMenuOpen(false);
						}}
						className={classNames({
							"block py-2 px-3 rounded hover:bg-gray-200 hover:text-[#002648] transition cursor-pointer": true,
							"bg-gray-200 text-[#002648]": usersMenuOpenInit,
						})}
					>
						<div className="flex gap-1 items-center justify-between">
							<div className="flex gap-1 items-center">
								<UsersRound size={15} />
								Users & Access
							</div>
							{usersMenuOpen ? (
								<ChevronUp size={15} />
							) : (
								<ChevronDown size={15} />
							)}
						</div>
					</div>
					{usersMenuOpen && (
						<div className="ml-6 mt-1 space-y-1">
							<Link
								href="/pages/user/business/"
								className={classNames({
									"py-1 px-3 rounded hover:text-[#002648] hover:bg-gray-200 transition text-sm flex items-center gap-2":
										true,
									"bg-gray-200 text-[#002648] ":
										currentPath === "/pages/user/business/",
								})}
							>
								<Building2 size={14} />
								Organizations
							</Link>
							<Link
								href="/pages/user/admin/"
								className={classNames({
									"py-1 px-3 rounded hover:text-[#002648] hover:bg-gray-200 transition text-sm flex items-center gap-2":
										true,
									"bg-gray-200 text-[#002648] ":
										currentPath === "/pages/user/admin/",
								})}
							>
								<Building2 size={14} />
								Ecosystem enablers
							</Link>
						</div>
					)}
				</li>

				{/* kyc */}
				<li>
					<div
						onClick={() => {
							setKycMenuOpen(!kycMenuOpen);
							setUsersMenuOpen(false);
							setTransactionMenuOpen(false);
						}}
						className={classNames({
							"block py-2 px-3 rounded hover:bg-gray-200 hover:text-[#002648] transition cursor-pointer": true,
							"bg-gray-200 text-[#002648]": kycMenuOpenInit,
						})}
					>
						<div className="flex gap-1 items-center justify-between">
							<div className="flex gap-1 items-center">
								<UsersRound size={15} />
								Users Kyc
							</div>
							{kycMenuOpen ? (
								<ChevronUp size={15} />
							) : (
								<ChevronDown size={15} />
							)}
						</div>
					</div>
					{kycMenuOpen && (
						<div className="ml-6 mt-1 space-y-1">
							<Link
								href="/pages/user/business/business-kyc/"
								className={classNames({
									"py-1 px-3 rounded hover:text-[#002648] hover:bg-gray-200 transition text-sm flex items-center gap-2":
										true,
									"bg-gray-200 text-[#002648] ":
										currentPath === "/pages/user/business/business-kyc/",
								})}
							>
								<Building2 size={14} />
								Organizations KYC
							</Link>
							<Link
								href="/pages/user/admin/admin-kyc/"
								className={classNames({
									"py-1 px-3 rounded hover:text-[#002648] hover:bg-gray-200 transition text-sm flex items-center gap-2":
										true,
									"bg-gray-200 text-[#002648] ":
										currentPath === "/pages/user/admin/admin-kyc/",
								})}
							>
								<Building2 size={14} />
								Ecosystem KYC
							</Link>
							<Link
								href="/pages/user/researcher-kyc/"
								className={classNames({
									"py-1 px-3 rounded hover:text-[#002648] hover:bg-gray-200 transition text-sm flex items-center gap-2":
										true,
									"bg-gray-200 text-[#002648] ":
										currentPath === "/pages/user/researcher-kyc/",
								})}
							>
								<Building2 size={14} />
								Researchers KYC
							</Link>

						</div>
					)}
				</li>

			</ul>
		</SideBarWrapper>
	);
}

const sideBarLinks: {
	label: string;
	href: string;
	icon: JSX.Element;
}[] = [
		{ label: "Dashboard", href: "/", icon: <House size={15} /> },
		// {
		// 	label: "Transactions",
		// 	href: "/pages/transactions",
		// 	icon: <Banknote size={15} />,
		// },
	];
