import { CircleMinus } from "lucide-react";
import { useState } from "react";
<<<<<<< HEAD
<<<<<<< HEAD
import QuestionTypeSelect from "./SurveySelect";
=======
import QuestionTypeSelect from "./QuestionTupeSelect";
>>>>>>> d5fb3b4 (Implement survey navigation with questions area)
=======
import QuestionTypeSelect from "./SurveySelect";
>>>>>>> 4c7de56 (Create the survey settings area)

const SurveyQuestionsArea = () => {
  const [questionType, setQuestionType] = useState("");
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
<<<<<<< HEAD
<<<<<<< HEAD
    <form className="my-8 flex flex-col gap-4">
=======
    <form className="my-8 flex flex-col gap-4 max-w-xl">
>>>>>>> d5fb3b4 (Implement survey navigation with questions area)
=======
    <form className="my-8 flex flex-col gap-4">
>>>>>>> 4c7de56 (Create the survey settings area)
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
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 4c7de56 (Create the survey settings area)
            valuesList={[
              "Multiple Choice",
              "Rating Scale",
              "Text Input",
              "Image Upload",
            ]}
<<<<<<< HEAD
=======
>>>>>>> d5fb3b4 (Implement survey navigation with questions area)
=======
>>>>>>> 4c7de56 (Create the survey settings area)
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
  );
};

export default SurveyQuestionsArea;
