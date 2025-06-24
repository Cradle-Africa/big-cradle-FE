"use client";

import DashboardLayout from "@/app/DashboardLayout";
import { useRouter, useSearchParams } from "next/navigation";
import ResponsesArea from "../_components/ResponsesArea";
import SettingsArea from "../_components/SettingsArea";
import SurveyQuestionsArea from "../_components/SurveyQuestionsArea";
import SurveyTabButton from "../_components/SurveyTabButton";

const NewSurveyPage = () => {
  const searchParams = useSearchParams();
  const paramSurvey = searchParams.get("survey");
  const router = useRouter();

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
      {<FormArea survey={paramSurvey || ""} />}
    </DashboardLayout>
  );
};

const surveyMenuList = ["Survey questions", "Responses", "Settings"];

const FormArea = ({ survey }: { survey: string }) => {
  if (survey === "Survey questions") {
    return <SurveyQuestionsArea />;
  } else if (survey === "Responses") {
    return <ResponsesArea />;
  } else {
    return <SettingsArea />;
  }
};

export default NewSurveyPage;
