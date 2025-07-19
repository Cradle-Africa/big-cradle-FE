"use client";

import classNames from "classnames";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  isSelected: boolean;
};

const SurveyTabButton = ({
  children,
  isSelected,
}: 

  Props) => {
  return (
    <div
      className={classNames(
        "lg:mt-0 rounded-full cursor-default px-2 lg:px-3 transition-all py-1",
        {
          "": isSelected,
        }
      )}
    >
      {children}
    </div>
  );
};

export default SurveyTabButton;