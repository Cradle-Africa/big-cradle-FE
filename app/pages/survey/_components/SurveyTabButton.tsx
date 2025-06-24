import classNames from "classnames";
import { MouseEventHandler, ReactNode } from "react";

type Props = {
  children: ReactNode;
  isSelected: boolean;
  onClick: MouseEventHandler<HTMLDivElement>;
};

const SurveyTabButton = ({ children, isSelected, onClick }: Props) => {
  return (
    <div
      onClick={onClick}
      className={classNames({
        "hover:bg-gray-100 rounded-full cursor-pointer px-5 transition-all":
          true,
        "border border-blue-500 border-dotted rounded-full px-5": isSelected,
      })}
    >
      {children}
    </div>
  );
};

export default SurveyTabButton;
