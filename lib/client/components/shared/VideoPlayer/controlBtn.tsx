import React from "react";
import { Button } from "../Button";
import classNames from "classnames";

type Props = {
  on: boolean;
  children: JSX.Element;
  onClick: () => void;
  className?: (React.HTMLAttributes<HTMLButtonElement> & string) | undefined;
};

export const ControlBtn = ({ on, children, onClick, className }: Props) => {
  return (
    <Button
      className={classNames(
        !on ? "border-primary bg-dark text-primary" : "",
        "rounded-full border  hover:bg-primary-700 hover:text-dark",
        className
      )}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};
