import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProtectedRoute } from "../components";
import {
  // public pages
  Home,

  // auth pages
  Login,
  Signup,

  // static pages
  PrivacyPolicy,
  TermsAndConditions,
  NotFound,
  Dashboard,
  AboutUs,
  FAQs,

  // regular user pages
  ProfileSettings,
  OTPVerification,
  ESimPlans,
  ESimManagement,

  // admin pages
  // EmailTemplateForm,
  EmailTemplateList,
  Settings,
  // SendEmailForm
} from "../pages";

import { SocialCallback } from "../callBacks";
import { useAuth } from "../hooks";
import { Navigate } from "react-router-dom";
import RoleGuard from "../components/routes/RoleGuard";

const Routes = () => {
  const { isAuthenticated, otpRequired, forgotPasswordStep } = useAuth();

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/about-us",
      element: <AboutUs />,
    },
    {
      path: "/faqs",
      element: <FAQs />,
    },
    {
      path: "/privacy-policy",
      element: <PrivacyPolicy />,
    },
    {
      path: "/verify-otp",
      element: isAuthenticated ? (
        <Navigate to="/dashboard" replace />
      ) : otpRequired || forgotPasswordStep === "verify" ? (
        <OTPVerification />
      ) : (
        <Navigate to="/login" replace />
      ),
    },
    {
      path: "/terms-and-conditions",
      element: <TermsAndConditions />,
    },
    {
      path: "/login",
      element: isAuthenticated ? (
        <Navigate to="/dashboard" replace />
      ) : otpRequired || forgotPasswordStep === "verify" ? (
        <Navigate to="/verify-otp" replace />
      ) : (
        <Login />
      ),
    },
    {
      path: "/signup",
      element: isAuthenticated ? (
        <Navigate to="/dashboard" replace />
      ) : otpRequired ? (
        <Navigate to="/verify-otp" replace />
      ) : (
        <Signup />
      ),
    },
    {
      path: "/auth/callback",
      element: <SocialCallback />,
    },

    // protect routes for both user type
    {
      path: '/',
      element: <ProtectedRoute />,
      children: [
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
        {
          path: "/profile",
          element: <ProfileSettings />,
        },
      ]
    },

    // regualar user routes
    {
      path: '/',
      element: <RoleGuard userRole={1} />,
      children: [
        {
          path: "/eSim-plans",
          element: <ESimPlans />,
        },
        {
          path: "/esims",
          element: <ESimManagement />,
        },
      ]
    },

    // admin routes
    {
      path: "/",
      element: <RoleGuard userRole={2} />,
      children: [
        {
          path: "/email-list",
          element: <EmailTemplateList />,
        },
        {
          path: "/settings",
          element: <Settings />,
        },
      ]
    },

    // unknown routes
    {
      path: "*",
      element: <NotFound />,
    },
  ]);


  return <RouterProvider router={router} />;
};

export default Routes;