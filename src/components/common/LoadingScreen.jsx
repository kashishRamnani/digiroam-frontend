import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
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
        <p className="text-white text-lg">
          Please wait while we prepare your experience
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
