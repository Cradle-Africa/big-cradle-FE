"ude client";

import { User } from "@/app/pages/user/types/User";
import { getUser } from "@/app/utils/user/userData";
import React, { useEffect, useState } from "react";
import BusinessDashboard from "./BusinessDashboard";
import SuperAdminDashboard from "./SuperAdminDashboard";
import LoadingDashboard from "./LoadingDashboard";
import AdminDashboard from "./AdminDashboard";
import EmployeeDashboard from "./EmployeeDashboard";

const Dashboard = () => {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const fetchUser = () => {
			const currentUser = getUser(); // make sure this returns a promise if async
			setUser(currentUser);
		};

		fetchUser();
	}, []);

	if (user?.role === "business") {
		return <BusinessDashboard />;
	} else if (user?.role === "super admin") {
		return <SuperAdminDashboard />;
	} else if (user?.role === "admin") {
		return <AdminDashboard />
	} else if (user?.role === "employee") {
		return <EmployeeDashboard />
	}

	return <LoadingDashboard />;
};

export default Dashboard;
