import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Navbar, Footer, WalletModal } from "../components";
import { toggleModal } from "../features";

const MainLayout = ({ children, title, description }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { t } = useTranslation();
  const isAuthPage = ["/login", "/signup", "/verify-otp"].includes(
    location.pathname.split("?")[0]
  );
  const isModalOpen = useSelector((state) => state.wallet.isModalOpen);

  const language = useSelector((state) => state.preferences.language);
  const handleCloseModal = () => dispatch(toggleModal(false));

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

      <WalletModal isVisible={isModalOpen} onClose={handleCloseModal} />
      <main className="flex-grow">{children}</main>
      {/* Footer */}
      {!isAuthPage && <Footer />}
    </div>
  );
};

export default MainLayout;
