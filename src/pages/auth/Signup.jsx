import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import MainLayout from "../../layouts/MainLayout";
import { signupSchema } from "../../schemas/auth";
import { LoginButtons } from "../../components";
import { signupUser } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { faCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Signup = () => {
  const { t } = useTranslation();
  const { isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    const result = await dispatch(
      signupUser({
        name: data.name,
        email: data.email,
        password: data.password,
      })
    );
    if (signupUser.fulfilled.match(result)) {
      reset();
    }
  };

  return (
    <MainLayout title={t("signup.title")} description={t("signup.description")}>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="md:hidden bg-[url('/images/auth/auth-bg.png')] rounded-b-lg">
          <div className="max-w-md w-full mx-auto p-6 text-white">
            <img
              src="/images/auth/roam-digi-logo.png"
              alt="Roamdigi Logo"
              className="w-32 mb-4"
            />

            <button
              className=" absolute top-60 w-32 p-2 border border-transparent rounded-md shadow-sm text-sm font-medium bg-white   focus:outline-none focus:ring-2 focus:ring-offset-2 bg-primary focus:ring-[#FF7F5C] transition duration-150 ease-in-out"
              onClick={() => {
                navigate("/");
              }}
            >
              <FontAwesomeIcon
                icon={faCircleLeft}
                className=" bg-primary mr-3"
              />
              Home Page
            </button>

            <h1 className="text-2xl font-bold mb-2 text-white">
              Join Roamdigi for Seamless eSIM Activation!
            </h1>
            <p className="text-sm opacity-80">
              Sign up now to access a world of eSIM solutions and manage your
              connectivity with ease.
            </p>
          </div>
        </div>
        <div className="flex flex-grow">
          <div className="hidden md:flex md:w-1/2 bg-[url('/images/auth/auth-bg.png')] flex-col justify-center px-8 lg:px-16 relative overflow-hidden">
            <button
              className=" absolute top-20 w-32 p-2 border border-transparent rounded-md shadow-sm text-sm font-medium bg-white   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7F5C] transition duration-150 ease-in-out"
              onClick={() => {
                navigate("/");
              }}
            >
              <FontAwesomeIcon
                icon={faCircleLeft}
                className="text-primary mr-3"
              />
              Home Page
            </button>

            <div className="relative z-10">
              <img
                src="/images/auth/roam-digi-logo.png"
                alt="Roamdigi Logo"
                className="w-56 mb-12"
              />

              <h1 className="text-4xl font-bold text-white mb-8 leading-tight">
                Join Roamdigi for Seamless eSIM Activation!
              </h1>
              <p className="text-white text-xl opacity-80">
                Sign up now to access a world of eSIM solutions and manage your
                connectivity with ease.
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full md:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12 bg-white">
            <div className="max-w-md w-full mx-auto">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
                Let's Connect
              </h2>
              <p className="text-gray-600 mb-6">
                At Roamdigi, we provide a hassle-free eSIM experience, enabling
                you to stay connected globally with ease. Sign up to unlock the
                power of eSIM for your mobile devices.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-[#FF7F5C] focus:border-[#FF7F5C] sm:text-sm ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>
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
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-[#FF7F5C] focus:border-[#FF7F5C] sm:text-sm ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-[#f67a55]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7F5C] transition duration-150 ease-in-out"
                    disabled={isLoading}
                  >
                    {isLoading ? "Registering..." : "Signup"}
                  </button>
                </div>
              </form>

              <div className="mt-3">
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
                Already have an account?{" "}
                <a
                  href="/login"
                  className="font-medium text-primary hover:text-[#f67a55]/80"
                >
                  Login
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Signup;
