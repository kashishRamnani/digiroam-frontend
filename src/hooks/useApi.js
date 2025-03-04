import { useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading, setError, clearError } from "../features/ui/uiSlice";
import axiosInstance from "../utils/axiosConfig";
import { showSuccessToast, showErrorToast } from "../utils/toast";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

export const useApi = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const { t } = useTranslation();

  const handleRequest = async (method, endpoint, body = null) => {
    dispatch(setLoading(true));
    dispatch(clearError());
    const toastId = toast.loading(t("api.loading"), {
      position: "top-right",
    });
    try {
      const response = await axiosInstance({
        url: endpoint,
        method,
        data: body,
      });
      setData(response.data);
      toast.remove(toastId);
      showSuccessToast(t("api.success"));
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || t("api.error");
      dispatch(setError(errorMessage));
      toast.remove(toastId);
      showErrorToast(errorMessage);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const get = (endpoint) => handleRequest("GET", endpoint);
  const getById = (endpoint, id) => handleRequest("GET", `${endpoint}/${id}`);
  const post = (endpoint, data) => handleRequest("POST", endpoint, data);
  const put = (endpoint, data) => handleRequest("PUT", endpoint, data);
  const del = (endpoint) => handleRequest("DELETE", endpoint);

  return { data, get, getById, post, put, delete: del };
};
