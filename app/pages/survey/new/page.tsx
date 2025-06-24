"use client";

import DashboardLayout from "@/app/DashboardLayout";
import SurveyTabButton from "../_components/SurveyTabButton";
import QuestionTypeSelect from "../_components/QuestionTupeSelect";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CircleMinus, Delete } from "lucide-react";

const NewSurveyPage = () => {
  const [questionType, setQuestionType] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramSurvey = searchParams.get("survey");

  const [answers, setAnswers] = useState([""]);

  const handleAddAnswer = () => {
    setAnswers([...answers, ""]);
  };

  const handleRemoveAnswer = (index: number) => {
    const newAnswers = [...answers];
    newAnswers.splice(index, 1);
    setAnswers(newAnswers);
  };

  const handleChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  return (
    <DashboardLayout>
      <div className="flex gap-4">
        {/* Survey buttons area */}
        {surveyMenuList.map((survey: string, index) => (
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
      <form className="my-8 flex flex-col gap-4 max-w-xl">
        <div className="bg-gray-50 p-4 rounded-md flex flex-col gap-4">
          <input
            placeholder="Title"
            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none bg-white"
            required
          />
          <input
            placeholder="Description"
            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none bg-white"
            required
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-md flex flex-col gap-4 mt-4">
          <div className="flex gap-4">
            <input
              placeholder="Question 1"
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none bg-white"
              required
            />
            <QuestionTypeSelect
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
            />
          </div>
          {answers.map((answer, index) => (
            <div key={index} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleRemoveAnswer(index)}
                className="text-red-500 text-lg font-bold px-2"
                aria-label={`Remove answer ${index + 1}`}
              >
                <CircleMinus />
              </button>
              <input
                placeholder={`Answer ${index + 1}`}
                value={answer}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none bg-white"
                required
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddAnswer}
            className="bg-[#F0F2FF] text-blue-600 border border-blue-600 py-2 px-4 rounded-md"
          >
            Add Answer {answers.length + 1}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
};

const surveyMenuList = ["Survey questions", "Responses", "Settings"];

export default NewSurveyPage;
