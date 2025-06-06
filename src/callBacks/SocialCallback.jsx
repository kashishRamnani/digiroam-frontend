import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showErrorToast, showSuccessToast } from "../utils/toast";
import { setUserAndToken } from "../features/auth/authSlice";
import { LoadingScreen } from "../components";

const SocialCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (window.location.hash && window.location.hash === "#_=_") {
      window.history.replaceState(null, null, window.location.pathname + window.location.search);
    }

    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const error = urlParams.get("error");

      if (error) {
        showErrorToast(error);
        navigate("/login");
        return;
      }

      const token = urlParams.get("accessToken");
      const userParam = urlParams.get("user");
      let userObject = null;

      if (userParam) {
        try {
          userObject = JSON.parse(userParam);
        } catch (error) {
          console.error("Error parsing user object:", error);
        }
      }

      if (token && userObject) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userObject));

        await dispatch(setUserAndToken({ user: userObject, token }));

        const planRaw = localStorage.getItem("purchasePending");
        const plan = planRaw ? JSON.parse(planRaw) : null;

        if (plan?.name && userObject.userRole != 2) {
          window.location.href = `/eSim-plans`;
        } else {
         navigate("/dashboard");
        }
      } else {
        navigate("/login");
      }
    };

    handleCallback();
  }, [navigate, dispatch]);

  return <LoadingScreen />;
};

export default SocialCallback;
