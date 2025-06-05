import { useState } from "react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { toggleModal } from "../features";
import { WalletModal } from "../components";

const DashboardLayout = ({ children, title, description, hideSidebar }) => {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const language = useSelector((state) => state.preferences.language);
  const isModalOpen = useSelector((state) => state.wallet.isModalOpen);

  const handleCloseModal = () => dispatch(toggleModal(false));

  return (
    <div className="flex h-screen bg-gray-100" key={location.pathname}>
      <Helmet>
        <html lang={language} />
        <title>{t(title)}</title>
        <meta name="description" content={t(description)} />
      </Helmet>

      <WalletModal isVisible={isModalOpen} onClose={handleCloseModal} />

      {/* Conditionally render Sidebar */}
      {!hideSidebar && (
        <DashboardSidebar
          isOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
      )}

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Conditionally render Header */}
        {!hideSidebar && <DashboardHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />}

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          {children}
          {/* <Outlet /> */}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;