"use client";

import axios from "@/app/lib/axios";
import DashboardLayout from "@/app/DashboardLayout";
import { useRouter, useSearchParams } from "next/navigation";
import SettingsArea from "../_components/SettingsArea";
import SurveyTabButton from "../_components/SurveyTabButton";
import SurveyQuestionsArea from "../_components/SurveyQuestionsArea";
import SurveysListArea from "../_components/SurveysListArea";
import { useFetchSurvey } from "../_features/hooks";
import LoadingNewSurveyPage from "./loading";
import { SurveyListItem } from "@/app/lib/type";
import { getUser } from "@/app/utils/user/userData";

const NewSurveyPage = () => {
  const searchParams = useSearchParams();
  const paramSurvey = searchParams.get("survey");
  const router = useRouter();
  const user = getUser();

  const {
    data: surveysListResponse,
    isLoading,
    error,
  } = useFetchSurvey({ axios, businessUserId: user?.id ?? "", page: 1 });

  if (isLoading) return <LoadingNewSurveyPage />;

  if (error) return;

  return (
    <DashboardLayout>
      <div className="flex gap-4">
        {/* Survey buttons area */}
        {surveyMenuList.map((survey: string) => (
          <SurveyTabButton
            onClick={() => router.push(`/pages/survey/new?survey=${survey}`)}
            key={survey}
            isSelected={paramSurvey === survey}
          >
            <p>{survey}</p>
          </SurveyTabButton>
        ))}
      </div>

      {/* Forms area */}
      {
        <FormArea
          survey={paramSurvey || ""}
          surveysList={surveysListResponse?.survey || []}
        />
      }
    </DashboardLayout>
  );
};

const surveyMenuList = ["Survey questions", "Surveys list", "Settings"];

type FormAreaProps = {
  survey: string;
  surveysList: SurveyListItem[];
};

const FormArea = ({ survey, surveysList }: FormAreaProps) => {
  if (survey === "Survey questions") {
    return <SurveyQuestionsArea />;
  } else if (survey === "Surveys list") {
    return <SurveysListArea data={surveysList} />;
  } else {
    return <SettingsArea />;
  }
};

export default NewSurveyPage;
