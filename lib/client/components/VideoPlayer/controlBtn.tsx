import React from "react";
import { Button } from "../Button";
import classNames from "classnames";

type Props = {
  on: boolean;
  children: JSX.Element;
  onClick: () => void;
};

export const ControlBtn = ({ on, children, onClick }: Props) => {
  return (
    <Button
      className={classNames(
        !on ? "border-primary bg-transparent text-primary" : "",
        "rounded-full border  hover:bg-primary-700 hover:text-dark"
      )}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};
