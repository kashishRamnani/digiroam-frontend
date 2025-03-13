import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { loginSchema, forgotSchema } from "../../schemas/auth";
import MainLayout from "../../layouts/MainLayout";
import { LoginButtons } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, requestPasswordReset } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleLeft } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { loading } = useSelector((state) => state.auth);
  const [mode, setMode] = useState("login");

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(mode === "login" ? loginSchema : forgotSchema),
  });
  
  const onSubmit = async (data) => {
    try {
        const { userRole, accountType } = await dispatch(loginUser(data)).unwrap();

        if (userRole == 2 && accountType == 2) {
            navigate("/admin-dashboard");
        } else {
            navigate("/dashboard");
        }
    } catch (error) {
        console.log(error.message);
    }
};

  return (
    <MainLayout title={t("login.title")} description={t("login.title")}>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="md:hidden bg-[url('/images/auth/auth-bg.png')] rounded-b-lg">
          {/* Mobile Welcome Section */}
          <div className="max-w-md w-full mx-auto p-6 text-white">
            <img
              src="/images/auth/roam-digi-logo.png"
              alt="Roamdigi Logo"
              className="w-32 mb-4"
            />

            <button
              className=" absolute top-56 w-32 p-2 border border-transparent rounded-md shadow-sm text-sm font-medium bg-primary   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7F5C] transition duration-150 ease-in-out"
              onClick={() => {
                navigate("/");
              }}
            >
               <FontAwesomeIcon icon={faCircleLeft} className="text-white mr-3"/>
              Home Page
            </button>

            <h1 className="text-2xl font-bold mb-2 text-white">
              Welcome Back!
            </h1>
            <p className="text-sm opacity-80">
              Log in to access your personalized dashboard and continue your
              journey with Roamdigi.
            </p>
          </div>
        </div>
        <div className="flex flex-grow">
          <div className="hidden md:flex md:w-1/2 bg-[url('/images/auth/auth-bg.png')] flex-col justify-center px-8 lg:px-16 relative overflow-hidden">
            <button
              className=" absolute top-16 w-32 p-2 border border-transparent rounded-md shadow-sm text-sm font-medium bg-white   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7F5C] transition duration-150 ease-in-out"
              onClick={() => {
                navigate("/");
              }}
            >
              <FontAwesomeIcon icon={faCircleLeft} className="text-primary mr-3"/>
              Home Page
            </button>

            <div className="relative z-10">
              <img
                src="/images/auth/roam-digi-logo.png"
                alt="Roamdigi Logo"
                className="w-56 mb-12"
              />

              <h1 className="text-6xl font-bold text-white mb-8 leading-tight">
                Welcome Back!
              </h1>
              <p className="text-white text-xl opacity-80">
                Log in to access your personalized dashboard and continue your
                journey with Roamdigi.
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full md:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12 bg-white">
            <div className="max-w-md w-full mx-auto">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
                {mode === "login" ? "Login to Your Account" : "Forgot Password"}
              </h2>
              <p className="text-gray-600 mb-8">
                {mode === "login"
                  ? "At Roamdigi, we're dedicated to providing answers to all your questions. Whether you need information, assistance, or advice, our team is here to help."
                  : "Enter your email address below, and we'll send you instructions to reset your password."}
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="text"
                    id="email"
                    className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-[#FF7F5C] focus:border-[#FF7F5C] sm:text-sm ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {mode === "login" && (
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-[#FF7F5C] focus:border-[#FF7F5C] sm:text-sm ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      }`}
                      {...register("password")}
                    />
                    {errors.password && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  {mode === "login" ? (
                    <div className="text-sm">
                      <button
                        type="button"
                        onClick={() => setMode("forgotPassword")}
                        className="font-medium text-primary hover:text-[#f67a55]/80"
                      >
                        Forgot password?
                      </button>
                    </div>
                  ) : (
                    <div className="text-sm">
                      <button
                        type="button"
                        onClick={() => setMode("login")}
                        className="font-medium text-primary hover:text-[#f67a55]/80"
                      >
                        Back to Login
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-[#f67a55]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7F5C] transition duration-150 ease-in-out"
                    disabled={loading}
                  >
                    {loading
                      ? mode === "login"
                        ? "Logging in..."
                        : "Sending..."
                      : mode === "login"
                      ? "Login"
                      : "Send Reset Link"}
                  </button>
                </div>
              </form>

              {mode === "login" && (
                <>
                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">
                          Or continue with
                        </span>
                      </div>
                    </div>

                    <LoginButtons />
                  </div>

                  <p className="mt-8 text-center text-sm text-gray-600">
                    New User?{" "}
                    <a
                      href="/signup"
                      className="font-medium text-primary hover:text-[#f67a55]/80"
                    >
                      Sign up
                    </a>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;
