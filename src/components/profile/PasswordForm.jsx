import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { passwordSchema } from "../../schemas/allSchema";
import { changeCurrentPassword } from "../../features/user/userSlice";
import { useDispatch } from "react-redux";

const PasswordForm = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmitPassword = async (data) => {
    const result = await dispatch(changeCurrentPassword(data));
    if (changeCurrentPassword.fulfilled.match(result)) {
      reset();
    }
    setShowCurrentPassword(false);
    setShowNewPassword(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h2>
      <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Current Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faLock} className="text-gray-400" />
            </div>
            <input
              type={showCurrentPassword ? "text" : "password"}
              {...register("oldPassword")}
              className="pl-10 pr-10 w-full rounded-md border border-gray-300 bg-white py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <FontAwesomeIcon
                icon={showCurrentPassword ? faEyeSlash : faEye}
                className="text-gray-400 cursor-pointer"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              />
            </div>
          </div>
          {errors.oldPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.oldPassword.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faLock} className="text-gray-400" />
            </div>
            <input
              type={showNewPassword ? "text" : "password"}
              {...register("newPassword")}
              className="pl-10 pr-10 w-full rounded-md border border-gray-300 bg-white py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <FontAwesomeIcon
                icon={showNewPassword ? faEyeSlash : faEye}
                className="text-gray-400 cursor-pointer"
                onClick={() => setShowNewPassword(!showNewPassword)}
              />
            </div>
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition-colors flex items-center justify-center space-x-2"
        >
          <FontAwesomeIcon icon={faLock} />
          <span>Update Password</span>
        </button>
      </form>
    </div>
  );
};

export default PasswordForm;
