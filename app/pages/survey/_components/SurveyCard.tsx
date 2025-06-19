import { Album } from "lucide-react";
import classNames from "classnames";

const SurveyCard = ({ isHighLighted }: { isHighLighted: boolean }) => {
  return (
    <div
      className={classNames({
        "rounded-[12px] w-full max-w-[400px] flex flex-col p-4 ": true,
        "bg-white border border-gray-200": !isHighLighted,
        "bg-[#3352FF] border border-gray-200 text-white": isHighLighted,
      })}
    >
      <div className="flex justify-between items-center">
        <p>Total Surveys</p>
        <div className="rounded-full border border-[#3352FF] bg-blue-100 p-2">
          <Album size={16} color="blue" />
        </div>
      </div>
      <span
        className={classNames({
          "text-[42px] font-bold mt-8 mb-2": true,
          "text-black": !isHighLighted,
          "text-white": !isHighLighted,
        })}
      >
        67
      </span>
      <div className="flex gap-2 items-center">
        <div className="border-1 border-green-500 bg-green-100 rounded-[4px] ">
          <span className="text-[12px] px-2 text-green-600">10.2%</span>
        </div>
        <span className="text-[13px]">Amount paid out to contributors</span>
      </div>
    </div>
  );
};

export default SurveyCard;
