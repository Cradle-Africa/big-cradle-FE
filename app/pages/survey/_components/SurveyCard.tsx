import { DashboardMenu } from "@/app/lib/type";
import classNames from "classnames";

type Props = {
  data: DashboardMenu;
  isHighLighted: boolean;
};

const SurveyCard = ({ isHighLighted, data }: Props) => {
  return (
    <div
      className={classNames({
        "rounded-[12px] w-full lg:max-w-[400px] flex flex-col p-3 lg:p-4 ": true,
        "bg-white border border-gray-200": !isHighLighted,
        "bg-[#3352FF] border border-gray-200 text-white": isHighLighted,
      })}
    >
      <div className="flex justify-between items-center">
        <p>{data.title}</p>
        <div className="rounded-full border border-[#3352FF] bg-blue-100 p-1 lg:p-2">
          {data.icon}
        </div>
      </div>
      <span
        className={classNames({
          "text-xl lg:text-[42px] font-bold mt-8 mb-2": true,
          "text-black": !isHighLighted,
          "text-white": isHighLighted,
        })}
      >
        {data.value}
      </span>
      <div className="flex gap-2 items-center">
        {/* <div className="border-1 border-green-500 bg-green-100 rounded-[4px] ">
          <span className="text-[12px] px-2 text-green-600">10.2%</span>
        </div> */}
        <span className="text-sm lg:text-[13px]">{data.subTitle}</span>
      </div>
    </div>
  );
};

export default SurveyCard;
