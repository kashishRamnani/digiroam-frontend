import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Navbar, Footer } from "../components";

const MainLayout = ({ children, title, description }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const isAuthPage = ["/login", "/signup", "/verify-otp"].includes(
    location.pathname.split("?")[0]
  );

  const language = useSelector((state) => state.preferences.language);

  return (
    <div
      className={`min-h-screen bg-white ${!isAuthPage ? "flex flex-col" : ""}`}
      key={location.pathname}
    >
      <Helmet>
        <html lang={language} />
        <title>{t(title)}</title>
        <meta name="description" content={t(description)} />
      </Helmet>
      {/* Navbar */}
      {!isAuthPage && <Navbar />}
      <main className="flex-grow">{children}</main>
      {/* Footer */}
      {!isAuthPage && <Footer />}
    </div>
  );
};

export default MainLayout;
