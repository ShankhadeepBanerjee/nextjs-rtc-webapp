import classNames from "classnames";
import React, { HTMLAttributes } from "react";

type Props = {
  className?: HTMLAttributes<HTMLButtonElement>;
  children: React.ReactNode | string;
};

export const Button = ({
  children,
  className,
  ...rest
}: Props &
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >) => {
  return (
    <button
      className={classNames(
        "bg-primary",
        "text-dark",
        "p-2",
        "transition duration-150 ease-in-out",
        "active:bg-dark active:text-white active:ring-1",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};
