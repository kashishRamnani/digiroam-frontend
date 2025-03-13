import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { EmailTemplateForm, EmailTemplateList, SendEmailForm } from "../components";
import AdminDashboard from "../pages/protectedpages/AdminDashboard/EmailModule";
import { ProtectedRoute } from "../components";
import {
  Home,
  Login,
  Signup,
  PrivacyPolicy,
  TermsAndConditions,
  NotFound,
  Dashboard,
  AboutUs,
  FAQs,
  ProfileSettings,
  OTPVerification,
  ESimPlans,
  ESimManagement,
} from "../pages";
import { SocialCallback } from "../callBacks";
import { useAuth } from "../hooks";
import { Navigate } from "react-router-dom";

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
    // {path:"/admin/email-template",
    // element:<EmailTemplateForm/>},
    // {
    //   path:"/email-list",
    //   element:<EmailTemplateList/>
    // },
    // {
    //   path:"/admin-dashboard",
    //   element:
    //     <AdminDashboard/>,
        
      
    // },
      // ✅ Nest Admin Routes Correctly
      {
        path: "/admin-dashboard",
        element: (
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        ),
        children: [
          { path: "email-template", element: <EmailTemplateForm /> },
          { path: "email-list", element: <EmailTemplateList /> },
          {path:"send-email",element:<SendEmailForm/>}
        ],
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
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/profile",
      element: (
        <ProtectedRoute>
          <ProfileSettings />
        </ProtectedRoute>
      ),
    },
    {
      path: "/eSim-plans",
      element: (
        <ProtectedRoute>
          <ESimPlans />
        </ProtectedRoute>
      ),
    },
    {
      path: "/manage-user-profiles",
      element: (
        <ProtectedRoute>
          <ESimManagement />
        </ProtectedRoute>
      ),
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;
