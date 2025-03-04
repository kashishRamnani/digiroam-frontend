import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector, useDispatch } from "react-redux";
import { otpSchema } from "../../schemas/auth";
import {
  verifyOTP,
  requestOTP,
  verifyPasswordResetOTP,
} from "../../features/auth/authSlice";
import MainLayout from "../../layouts/MainLayout";

const OTPVerification = () => {
  const dispatch = useDispatch();
  const { isLoading, emailForOTP, forgotPasswordStep } = useSelector(
    (state) => state.auth
  );
  const [verificationError, setVerificationError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(otpSchema),
  });

  const onSubmit = async (data) => {
    if (forgotPasswordStep === "verify") {
      dispatch(verifyPasswordResetOTP({ email: emailForOTP, otp: data.otp }));
    } else {
      dispatch(verifyOTP({ email: emailForOTP, otp: data.otp }));
    }
  };

  const handleResendOtp = async () => {
    const response = await dispatch(requestOTP(emailForOTP));
  };

  return (
    <MainLayout
      title={"OTP Verification"}
      description={"Verify OTP for Successfull Registeration"}
    >
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="w-full max-w-md mx-auto mt-8 px-3">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
            Verify Your Email
          </h2>
          <p className="text-gray-600 mb-6">
            We've sent a verification code to your email. Please enter it below.
          </p>

          {verificationError && (
            <div className="mb-4 text-red-600 text-sm">{verificationError}</div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700"
              >
                Verification Code
              </label>
              <input
                type="text"
                id="otp"
                className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-[#FF7F5C] focus:border-[#FF7F5C] sm:text-sm ${
                  errors.otp ? "border-red-500" : "border-gray-300"
                }`}
                {...register("otp")}
              />
              {errors.otp && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.otp.message}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-[#f67a55]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7F5C] transition duration-150 ease-in-out"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          </form>

          {forgotPasswordStep !== "verify" && (
            <div className="mt-4 text-center">
              <button
                onClick={handleResendOtp}
                className="text-sm text-primary hover:text-[#f67a55]/80"
              >
                Resend OTP
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default OTPVerification;
