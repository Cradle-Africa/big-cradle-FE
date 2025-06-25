"use client";

import DashboardLayout from "@/app/DashboardLayout";
import axios from "@/app/lib/axios";
import { SurveyListItem } from "@/app/lib/type";
import { getUser } from "@/app/utils/user/userData";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import SettingsArea from "../_components/SettingsArea";
import SurveyNameAndDescription from "../_components/SurveyNameAndDescription";
import SurveysListArea from "../_components/SurveysListArea";
import SurveyTabButton from "../_components/SurveyTabButton";
import { useFetchSurvey } from "../_features/hooks";
import LoadingNewSurveyPage from "./loading";
import NewSurveyQuestionsForm from "../_components/NewSurveyQuestionsForm";
import SurveyPayementArea from "../_components/SurveyPayementArea";

const NewSurveyPage = () => {
  const searchParams = useSearchParams();
  const paramSurvey = searchParams.get("survey");
  const surveyId = searchParams.get("surveyId");
  const [isUpdatingSurvey, setIsUpdatingSurvey] = useState(false);
  const router = useRouter();
  const user = getUser();

  const {
    data: surveysListResponse,
    isLoading,
    error,
  } = useFetchSurvey({ axios, businessUserId: user?.id ?? "", page: 1 });

  // const { data : singleSurvey, isLoading: isLoadingSingleSurvey } = useFetchSingleSurvey({
  //   axios,
  //   surveyId: surveyId || "",
  //   enabled: !!surveyId,
  // });

  if (isLoading) return <LoadingNewSurveyPage />;

  if (error) return;

  return (
    <DashboardLayout>
      <div className="flex gap-4 items-center justify-center">
        {/* Survey buttons area */}
        {/* {surveyMenuList.map((survey: string) => (
          <SurveyTabButton
            onClick={() => router.push(`/pages/survey/new?survey=${survey}`)}
            key={survey}
            isSelected={paramSurvey === survey}
          >
            <p>{survey}</p>
          </SurveyTabButton>
        ))} */}
        <SurveyTabButton
          // onClick={() =>
          //   router.push(`/pages/survey/new?survey=survey-name-and-description`)
          // }
          isSelected={paramSurvey === "survey-name-and-description"}
        >
          <div className="flex gap-4 items-center">
            <div className="rounded-full border-2 border-green-600 h-[20px] w-[20px] flex items-center justify-center">
              <p>1</p>
            </div>
            <p>Survey name and description</p>
          </div>
        </SurveyTabButton>

        <SurveyTabButton
          // onClick={() =>
          //   router.push(`/pages/survey/new?survey=survey-questions`)
          // }
          isSelected={paramSurvey === "survey-questions"}
        >
          <div className="flex gap-4 items-center">
            <div className="rounded-full border-2 border-green-600 h-[20px] w-[20px] flex items-center justify-center">
              <p>2</p>
            </div>
            <p>Survey questions</p>
          </div>
        </SurveyTabButton>

        <SurveyTabButton
          // onClick={() =>
          //   router.push(`/pages/survey/new?survey=survey-questions`)
          // }
          isSelected={paramSurvey === "survey-payment"}
        >
          <div className="flex gap-4 items-center">
            <div className="rounded-full border-2 border-green-600 h-[20px] w-[20px] flex items-center justify-center">
              <p>3</p>
            </div>
            <p>Survey payment</p>
          </div>
        </SurveyTabButton>

        {/* <SurveyTabButton
          onClick={() => router.push(`/pages/survey/new?survey=Surveys list`)}
          isSelected={false}
        >
          <div>Surveys list</div>
        </SurveyTabButton> */}
      </div>

      {/* Forms area */}
      <FormArea
        survey={paramSurvey || ""}
        surveysList={surveysListResponse?.survey || []}
      />
    </DashboardLayout>
  );
};

// const surveyMenuList = [
//   "Survey name and description",
//   "Surveys list",
//   "Settings",
// ];

type FormAreaProps = {
  survey: string;
  surveysList: SurveyListItem[];
};

const FormArea = ({ survey, surveysList }: FormAreaProps) => {
  if (survey === "survey-name-and-description") {
    return <SurveyNameAndDescription />;
  } else if (survey === "survey-questions") {
    return <NewSurveyQuestionsForm />;
  } else if (survey === "survey-payment") {
    return <SurveyPayementArea />;
  }

  // else if (survey === "Surveys list") {
  //   return <SurveysListArea data={surveysList} />;
  // } else {
  //   return <SettingsArea />;
  // }
};

export default NewSurveyPage;
