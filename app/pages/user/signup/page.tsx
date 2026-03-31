"use client";

import LoginImage from "@/app/components/LoginImage";
import AccountVerification from "@/app/components/user/AccountVerification";
import BusinessSignUpLink from "@/app/components/user/BusinessSignUpLink";
import SuperAdminSignUp from "@/app/components/user/SuperadminSignUp";
import LogoWithText from "@/public/images/logo-with-text.png";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import AdminSignUp from "../../../components/user/AdminSignUp";
import BusinessSignUp from "../../../components/user/BusinessSignUp";
import EmployeeSignUp from "../../../components/user/EmployeeSignUp";
import { DecodedPayload } from "../types/User";

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
				} else {
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
		<div className="flex flex-col lg:flex-row w-full min-h-screen">
			{showVerification && (
				<AccountVerification
					showAccountVerification={showVerification}
					setShowAccountVerification={setShowVerification}
					email={formData.email}
				/>
			)}
			<div className="w-full lg:w-1/2 flex items-center justify-center px-6 md:px-12 py-10 bg-white">
				<div className="w-full md:w-[500px] px-8 lg:px-10 space-y-3 py-10 text-center">
					<Image
						src={LogoWithText}
						width={200}
						height={200}
						alt="Big Cradle Logo"
						className="mb-8 m-auto"
					/>
					<div className="w-[90%] h-[90%] rounded-2xl overflow-hidden shadow-lg">
					
				</div>

					{/* {superAdminSignUp && (
						<h3 className="text-lg font-semibold text-gray-700">
							Sign up as a Super admin
						</h3>
					)} */}
					{/* {adminSignUp && (
						<h3 className="text-lg font-semibold text-gray-700">
							Sign up as an ecosystem enabler
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
					)} */}
					<h3 className="text-lg font-semibold text-black">
						Welcome to Big cradle
					</h3>
					<p className="text-black text-sm">
						Already have an account?
						<Link href="/pages/user/signin" className="underline ml-1 hover:text-blue-500 hover:no-underline">
							Sign in
						</Link>
					</p>


					{adminSignUp && (
						<>
							<button
								onClick={() => {
									setBusinessSignUp(true);
									setSuperAdminSignUp(false);
									setEmployeeSignUp(false);
									setAdminSignUp(false);
								}}
								className={'font-bold hover:cursor-pointer flex w-full justify-center px-5 py-2 border border-gray-200 rounded-lg'}
							>
								Continue as a business
							</button>

							<div className="flex w-full items-center gap-2 text-sm text-slate-600">
								<div className="h-px w-full bg-slate-200"></div>
								OR
								<div className="h-px w-full bg-slate-200"></div>
							</div>
						</>
					)}

					{businessSignUp && (
						<>
						<button
							onClick={() => {
								setAdminSignUp(true);
								setBusinessSignUp(false);
								setEmployeeSignUp(false);
								setSuperAdminSignUp(false);
							}}
							className={'font-bold hover:cursor-pointer flex w-full justify-center px-5 py-2 border border-gray-200 rounded-lg   mt-12 mb-4 hover:bg-blue-700 hover:text-white'}
						>
							Continue as an ecosystem enabler
						</button>
						<div className="flex w-full items-center gap-2 text-sm text-slate-600">
								<div className="h-px w-full bg-slate-200"></div>
								OR
								<div className="h-px w-full bg-slate-200"></div>
							</div>
						</>
						
					)}


					<div className="">
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

						{businessSignUpLink && (
							<BusinessSignUpLink
								signUpToken={token}
								businessEmail={businessEmail}
								adminBusinessUserId={adminBusinessUserId}
							/>
						)}
					</div>
				</div>
			</div>
			<div  className="w-full lg:w-1/2 hidden lg:block">
				<LoginImage />
			</div>
			
		</div>
	);
}

const SignUpPage = () => {
	return (
		<Suspense>
			<BuildSignUpPage />
		</Suspense>
	)
}

export default SignUpPage
