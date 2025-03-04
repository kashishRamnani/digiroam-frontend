import React from "react";
import { motion } from "framer-motion";
import { LoginCard, SearchCard, TicketCard } from "./mobile-mockups";
import { useTranslation } from "react-i18next";

function MobileMockups() {
  const {t} = useTranslation();

  return (
    <div
      className="bg-cover bg-center max-w-7xl mx-auto px-4 pt-8 pb-16 overflow-hidden"
      style={{ backgroundImage: `url('/images/home/dots-bg-mobile.png')` }}
    >
        <h2 className="text-center text-3xl mb-0">{t("home.appdemo.title")}</h2>
        <p className="text-[#303030] text-center text-lg lg:text-xl mb-4">
        {t("home.appdemo.subtitle")}
            </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20">
        <motion.div
          animate={{ y: [0, 25, 0] }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          className="flex items-center justify-center"
        >
          <SearchCard />
        </motion.div>
        <motion.div
          animate={{ y: [25, 0, 25] }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          className="flex items-center justify-center"
        >
          <TicketCard />
        </motion.div>
        <motion.div
          animate={{ y: [0, 25, 0] }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          className="flex items-center justify-center"
        >
          <LoginCard />
        </motion.div>
      </div>
    </div>
  );
}

export default MobileMockups;
