"use client";

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
      className={classNames(
        "mt-5 lg:mt-0 rounded-full cursor-default px-2 lg:px-3 transition-all py-1",
        {
          "border border-blue-500 bg-blue-100": isSelected,
        }
      )}
    >
      {children}
    </div>
  );
};

export default SurveyTabButton;