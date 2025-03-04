import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Loader = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-500 z-50 opacity-50 min-w-screen min-h-[400px]">
      <div className="text-center">
        <div className="mb-4">
          <FontAwesomeIcon
            icon={faSpinner}
            className="text-white text-6xl animate-spin"
          />
        </div>
        <h2 className="text-white text-2xl font-bold mb-2 animate-pulse">
          Loading...
        </h2>
      </div>
    </div>
  );
};

export default Loader;
