import React, { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  className?: HTMLAttributes<HTMLButtonElement>;
  children: React.ReactNode | string;
  variant?: "primary" | "dark" | "light";
};

export const Button = ({
  children,
  className,
  variant = "primary",
  ...rest
}: Props &
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >) => {
  const colors = {
    primary: "bg-primary text-dark active:bg-dark active:text-white",
    dark: "bg-dark text-white active:bg-primary active:text-dark",
    light: "bg-light text-dark active:bg-dark active:text-white",
  };

  return (
    <button
      className={twMerge(
        colors[variant],
        "p-2",
        "transition duration-150 ease-in-out",
        "active:ring-1",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};
