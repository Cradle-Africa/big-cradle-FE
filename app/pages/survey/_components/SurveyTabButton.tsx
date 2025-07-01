import classNames from "classnames";
import { ReactNode } from "react";

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
        "mt-5 lg:mt-0 rounded-full cursor-pointer px-2 lg:px-5 transition-all py-1 ":
          true,
        "border border-blue-500  rounded-full px-2 lg:px-5 bg-blue-100": isSelected,
      })}
    >
      {children}
    </div>
  );
};

export default SurveyTabButton;