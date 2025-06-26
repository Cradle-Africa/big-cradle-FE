import classNames from "classnames";

type SurveyStatusProps = {
  isSelected: boolean;
  status: string;
  onClick: () => void;
};

const SurveyStatus = ({ isSelected, status, onClick }: SurveyStatusProps) => {
  return (
    <div
      onClick={onClick}
      className={classNames({
        "bg-blue-50 hover:cursor-pointer border-blue-500 text-blue-600 px-4 rounded-full py-1":
          isSelected,
        "hover:cursor-pointer px-4 rounded-full py-1": true,
      })}
    >
      <span>{status}</span>
    </div>
  );
};

export const statuses = ["All", "Active", "Inactive"];

export default SurveyStatus;
