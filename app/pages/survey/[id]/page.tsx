"use client";

import axios from "@/app/lib/axios";
import DashboardLayout from "@/app/DashboardLayout";
import { useParams } from "next/navigation";
import { useFetchSingleSurvey } from "../_features/hooks";
import SurveyDetailsLoadingPage from "./loading";
import SurveyEntriesTable from "./SurveyEntriesTable";
import { useState } from "react";

const SurveyDetailsPage = () => {
	const params = useParams<{ id: string }>();
	const [viewDataEntries, setViewDataEntries] = useState(true);
	const surveyId = params.id;
	const { isLoading } = useFetchSingleSurvey({
		axios,
		surveyId: surveyId,
	});

	if (isLoading) return <SurveyDetailsLoadingPage />;

	return (
		<DashboardLayout>
			<div className="w-full">
				<SurveyEntriesTable
					viewDataEntries={viewDataEntries}
					surveyId={surveyId}
					setViewDataEntries={setViewDataEntries}
				/>
			</div>
		</DashboardLayout>
	);
};

export default SurveyDetailsPage;
