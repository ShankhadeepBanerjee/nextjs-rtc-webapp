import React from "react";
import { FaSpinner } from "react-icons/fa";
type Props = {
  loadingText?: string;
};

export const Loader = ({ loadingText }: Props) => {
  return (
    <div className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center">
        <FaSpinner className="mb-2 animate-spin text-3xl text-gray-500" />
        {loadingText ? (
          <h2 className="text-center text-lg font-bold text-gray-800">
            {loadingText}
          </h2>
        ) : null}
      </div>
    </div>
  );
};
