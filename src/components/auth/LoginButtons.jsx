import React from "react";
import { API_URL } from "../../utils/env";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faGoogle,
  faFacebook,
  faApple,
} from "@fortawesome/free-brands-svg-icons";

const LoginButtons = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}auth/google`;
  };

  const handleFacebookLogin = () => {
    window.location.href = `${API_URL}auth/facebook`;
  };


  const handleAppleLogin = () => {
    window.location.href = `${API_URL}auth/apple`;
  };
 
  
  return (
    <>
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div>
          <button
            onClick={handleFacebookLogin}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <FontAwesomeIcon
              icon={faFacebook}
              className="h-5 w-5 text-[#4267B2]"
            />
          </button>
        </div>
        <div>
          <button
            onClick={handleGoogleLogin}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <FontAwesomeIcon
              icon={faGoogle}
              className="h-5 w-5 text-[#DB4437]"
            />
          </button>
        </div>
        <div>
          <button
            onClick={handleAppleLogin}
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <FontAwesomeIcon
              icon={faApple}
              className="h-5 w-5 text-[#000000]"
            />
          </button>
        </div>
      </div>
    </>
  );
};

export default LoginButtons;
