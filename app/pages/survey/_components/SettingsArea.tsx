<<<<<<< HEAD
import { useState } from "react";
import QuestionTypeSelect from "./SurveySelect";

const SettingsArea = () => {
  const [questionType, setQuestionType] = useState("");
  // const [answers, setAnswers] = useState([""]);

  return (
    <div className="my-8">
      <p className="text-xl font-bold">Target audience</p>
      <form className="w-full py-4 flex flex-col gap-4">
        <QuestionTypeSelect
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value)}
          valuesList={["Age range"]}
        />
        <QuestionTypeSelect
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value)}
          valuesList={["Gender"]}
        />
        <QuestionTypeSelect
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value)}
          valuesList={["Region"]}
        />
        <QuestionTypeSelect
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value)}
          valuesList={["Languages"]}
        />
      </form>

      <p className="text-xl font-bold mt-4">Incentive and budget</p>
      <form className="py-4 flex flex-col gap-4">
        <QuestionTypeSelect
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value)}
          valuesList={["Reward per response"]}
        />
        <QuestionTypeSelect
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value)}
          valuesList={["Target Responses"]}
        />
        <QuestionTypeSelect
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value)}
          valuesList={["Estimated Budget"]}
        />
        <button
          type="button"
          className="bg-[#F0F2FF] text-blue-600 border border-blue-600 py-2 px-4 rounded-md"
        >
          Your wallet balance is: ₦200,000
        </button>
      </form>
=======
const SettingsArea = () => {
  return (
    <div className="my-8">
      <p className="text-4xl font-bold">Settings</p>
>>>>>>> d5fb3b4 (Implement survey navigation with questions area)
    </div>
  );
};

export default SettingsArea;
