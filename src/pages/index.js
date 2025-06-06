import Home from "./static/Home";
import FAQs from "./static/FAQs";
import Dashboard from "./protectedpages/Dashboard.jsx";
import AboutUs from "./static/AboutUs";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import NotFound from "./static/NotFound";
import Unauthorized from "./static/Unauthorized.jsx";
import PrivacyPolicy from "./static/PrivacyPolicy";
import TermsAndConditions from "./static/TermsAndConditions";
import ProfileSettings from "./protectedpages/ProfileSettings";
import OTPVerification from "./auth/OTPVerification";
import ESimPlans from "./protectedpages/ESimPlans";
import ESimManagement from "./protectedpages/ESimManagement";
import Wallet from "./protectedpages/Wallet";

// admin pages
import EmailTemplateList from "./protectedpages/EmailList.jsx";
import Settings from "./protectedpages/Settings.jsx";

// public
import QueriedEsimPlans from "./public/QueriedEsimPlans.jsx";

export {
  Home,
  FAQs,
  Dashboard,
  AboutUs,
  Login,
  Signup,
  NotFound,
  Unauthorized,
  PrivacyPolicy,
  TermsAndConditions,
  ProfileSettings,
  OTPVerification,
  ESimPlans,
  ESimManagement,
  Wallet,

  // admin pages
  EmailTemplateList,
  Settings,

  // public
  QueriedEsimPlans
};
