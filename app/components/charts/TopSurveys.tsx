import { getBusinessId, getUser } from "@/app/utils/user/userData";
import { Spinner, Table, Text } from "@radix-ui/themes";
import React, { useEffect } from "react";
import { useFetchTopSurveys } from "../dashboard/_features/hook";

interface Props {
	business?: string;
	module?: string;
}

const TopSurveys = ({ business, module }: Props) => {
	const user = getUser();
	let businessUserId = "";
	const role = user?.role ?? "";
	if (role === "business") {
		businessUserId = getBusinessId() ?? "";
	}
	if (role === "employee") {
		businessUserId = user?.businessUserId ?? "";
	}
	if (role === 'admin') {
		businessUserId = business ?? ''
	}

	const {
		data: surveys,
		isLoading,
		error,
		refetch: refetchSurvey
	} = useFetchTopSurveys({
		businessUserId,
		role,
	});

	useEffect(() => {
		if (module === 'Survey') {
			refetchSurvey();
		}
	}, [module, refetchSurvey]);


	if (isLoading) return <Spinner />;

	if (error) return <p>Error fetching the survey summary</p>;

	return (
		<div className="bg-white p-4 border border-gray-100 rounded-md h-full">
			<>
				{(surveys ?? []).length < 1 ? (
					<Text></Text>
				) : (
					<div>
						<p className="font-medium mb-4">Top surveys</p>
						<Table.Root>
							<Table.Header>
								<Table.Row>
									{topSurveysColumns.map((column) => (
										<Table.ColumnHeaderCell key={column.label}>
											{column.label}
										</Table.ColumnHeaderCell>
									))}
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{surveys?.map((survey) => (
									<Table.Row key={survey.surveyId}>
										<Table.Cell>{survey?.surveyName}</Table.Cell>
										<Table.Cell>{survey?.responseCount}</Table.Cell>
									</Table.Row>
								))}
							</Table.Body>
						</Table.Root>
					</div>
				)}
			</>
		</div>
	);
};

export const topSurveysColumns: {
	label: string;
}[] = [{ label: "Survey name" }, { label: "Responses" }];

export default TopSurveys;
