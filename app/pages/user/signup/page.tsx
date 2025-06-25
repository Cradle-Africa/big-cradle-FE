"use client";

import Link from "next/link";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { FcGoogle } from "react-icons/fc";
import AccountVerification from "@/app/components/user/AccountVerification";
import SuperAdminSignUp from "@/app/components/user/SuperadminSignUp";
import BusinessSignUp from "../../../components/user/BusinessSignUp";
import EmployeeSignUp from "../../../components/user/EmployeeSignUp";
import AdminSignUp from "../../../components/user/AdminSignUp";
import { DecodedPayload } from "../types/User";
import BusinessSignUpLink from "@/app/components/user/BusinessSignUpLink";
import LoginImage from "@/app/components/LoginImage";
import LogoWithText from "@/public/images/logo-with-text.png";

function BuildSignUpPage() {
	const searchParams = useSearchParams();
	const [showVerification, setShowVerification] = useState(false);
	const [superAdminSignUp, setSuperAdminSignUp] = useState(false);
	const [businessSignUp, setBusinessSignUp] = useState(true);
	const [businessSignUpLink, setBusinessSignUpLink] = useState(false);
	const [employeeSignUp, setEmployeeSignUp] = useState(false);
	const [adminSignUp, setAdminSignUp] = useState(false);
	const [departmentId, setDepartmentId] = useState<string | null>(null);
	const [adminBusinessUserId, setAdminBusinessUserId] = useState<string | null>(
		null
	);
	const [employeeEmail, setEmployeeEmail] = useState<string | null>(null);
	const [businessEmail, setBusinessEmail] = useState<string | null>(null);
	const [businessUserId, setBusinessUserId] = useState<string | null>(null);
	const [token, setToken] = useState<string | null>(null);

	const [formData] = useState({ email: "" });

	useEffect(() => {
		const encrypted = searchParams.get("token");
		setToken(encrypted);

		if (encrypted) {
			try {
				const decodedData = jwtDecode<DecodedPayload>(encrypted);
				setDepartmentId(decodedData.departmentId);
				setEmployeeEmail(decodedData.email);
				setBusinessEmail(decodedData.email);
				setBusinessUserId(decodedData.businessUserId);
				setAdminBusinessUserId(decodedData.adminBusinessUserId);
				if (decodedData.departmentId) {
					setEmployeeSignUp(true);
				}
				if (decodedData.adminBusinessUserId) {
					setBusinessSignUpLink(true);
				}
				setBusinessSignUp(false);
				setSuperAdminSignUp(false);
				setAdminSignUp(false);
			} catch (error) {
				console.error("Invalid token:", error);
			}
		}
	}, [searchParams]);

	return (
		<div className="min-h-screen flex gap-16 md:py-0 bg-white">
			{showVerification && (
				<AccountVerification
					showAccountVerification={showVerification}
					setShowAccountVerification={setShowVerification}
					email={formData.email}
				/>
			)}
			<div className="flex items-center justify-center w-full max-w-[400px] md:px-12 py-4 bg-white">
				<div className="w-full md:w-[500px] space-y-3 py-10">
					<Image
						src={LogoWithText}
						width={200}
						height={200}
						alt="Big Cradle Logo"
						className="mb-4"
					/>

					{/* {superAdminSignUp && (
						<h3 className="text-lg font-semibold text-gray-700">
							Sign up as a Super admin
						</h3>
					)} */}
					{adminSignUp && (
						<h3 className="text-lg font-semibold text-gray-700">
							Sign up as an Investor
						</h3>
					)}
					{businessSignUp && (
						<h3 className="text-lg font-semibold text-gray-700">
							Sign up as a Business
						</h3>
					)}
					{employeeSignUp && (
						<h3 className="text-lg font-semibold text-gray-700">
							Sign up as an Employee
						</h3>
					)}
					{businessSignUpLink && (
						<h3 className="text-lg font-semibold text-gray-700">
							Sign up as a Business{" "}
						</h3>
					)}

					<p className="text-gray-700 text-sm">
						Already have an account?
						<Link href="/pages/user/signin" className="underline ml-1">
							Sign in
						</Link>
					</p>
					{/* <button className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 text-gray-700">
						<FcGoogle className="text-md" /> Continue with Google
					</button>

					<div className="flex items-center gap-2">
						<hr className="flex-grow border-gray-300" />
						<span className="text-sm text-gray-500">OR</span>
						<hr className="flex-grow border-gray-300" />
					</div> */}

					{
					// superAdminSignUp ||
						adminSignUp ||
						(businessSignUp && (
							<div className="overflow-x-auto whitespace-nowrap flex w-full justify-between border border-gray-200 px-1 py-1 rounded-md text-xs text-gray-700">
								{/* <button
									onClick={() => {
										setSuperAdminSignUp(true);
										setBusinessSignUp(false);
										setEmployeeSignUp(false);
										setAdminSignUp(false);
									}}
									className={`py-2 px-2 rounded-md hover:cursor-pointer ${superAdminSignUp
											? "bg-gradient-to-br from-[#578CFF] to-[#0546D2] text-white"
											: " text-gray-700"
										}`}
								>
									Super admin
								</button> */}
								<button
									onClick={() => {
										setAdminSignUp(true);
										setBusinessSignUp(false);
										setEmployeeSignUp(false);
										setSuperAdminSignUp(false);
									}}
									className={`py-2 px-2 rounded-md hover:cursor-pointer ${adminSignUp
											? "bg-gradient-to-br from-[#578CFF] to-[#0546D2] text-white"
											: " text-gray-700"
										}`}
								>
									Investor
								</button>
								<button
									onClick={() => {
										setBusinessSignUp(true);
										setSuperAdminSignUp(false);
										setEmployeeSignUp(false);
										setAdminSignUp(false);
									}}
									className={`py-2 px-2 rounded-md hover:cursor-pointer ${businessSignUp
											? "bg-gradient-to-br from-[#578CFF] to-[#0546D2] text-white"
											: " text-gray-700"
										}`}
								>
									Business
								</button>
							</div>
						))}

					<div>
						{superAdminSignUp && <SuperAdminSignUp />}
						{businessSignUp && <BusinessSignUp />}
						{adminSignUp && <AdminSignUp />}
						{employeeSignUp && departmentId && (
							<EmployeeSignUp
								signUpToken={token}
								employeeEmail={employeeEmail}
								businessUserId={businessUserId}
							/>
						)}

						{businessSignUpLink && adminBusinessUserId && (
							<BusinessSignUpLink
								signUpToken={token}
								businessEmail={businessEmail}
								adminBusinessUserId={adminBusinessUserId}
							/>
						)}
					</div>
				</div>
			</div>
			<LoginImage />
		</div>
	);
}

const SignUpPage = () => {
	return (
		<Suspense>
			<BuildSignUpPage/>
		</Suspense>
  )
}

export default SignUpPage
