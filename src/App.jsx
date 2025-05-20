import { useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import Routes from "./routes";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { verifyToken } from "./features/auth/authSlice";
import i18n from "./i18n";
import { retrieveSettings } from "./features";

function AppContent() {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.preferences.language);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  useEffect(() => {
    dispatch(verifyToken());
    dispatch(retrieveSettings())
  }, []);

  return (
    <HelmetProvider>
      <Routes key={language} />
      <Toaster position="top-right" />
    </HelmetProvider>
  );
}

function App() {
  return <AppContent />;
}

export default App;
