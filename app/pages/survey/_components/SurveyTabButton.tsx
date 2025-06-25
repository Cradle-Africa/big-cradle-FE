import classNames from "classnames";
import { MouseEventHandler, ReactNode } from "react";

type Props = {
  children: ReactNode;
  isSelected: boolean;
  // onClick: MouseEventHandler<HTMLDivElement>;
};

const SurveyTabButton = ({
  children,
  isSelected,
}: //  onClick

Props) => {
  return (
    <div
      // onClick={onClick}
      className={classNames({
        "rounded-full cursor-pointer px-5 transition-all py-1 ":
          true,
        "border border-blue-500  rounded-full px-5 bg-blue-100": isSelected,
      })}
    >
      {children}
    </div>
  );
};

export default SurveyTabButton;
