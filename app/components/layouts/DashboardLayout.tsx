// app/components/layouts/DashboardLayout.tsx
"use client";

import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import { ReactNode } from "react";
import { useAuthGuard } from "@/app/hooks/useAuthGuard";

export default function DashboardLayout({ children }: { children: ReactNode }) {
	useAuthGuard();

	return (
		<div className="flex w-full lg:px-10">
			<Sidebar />
			<div className="lg:ml-64 flex-1">
				<Topbar />
				<div className="px-5 py-5">{children}</div>
			</div>
		</div>
	);
}
