import classNames from "classnames";

type SurveyStatusProps = {
  isSelected: boolean;
  status: string;
};

const SurveyStatus = ({ isSelected, status }: SurveyStatusProps) => {
  return (
    <div
      className={classNames({
        "bg-blue-50 border-blue-500 text-blue-600 px-4 rounded-full py-1":
          isSelected,
      })}
    >
      <span>{status}</span>
    </div>
  );
};

export const statuses = ["All", "Active", "Draft", "Completed"];

export default SurveyStatus;