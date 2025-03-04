import React from "react";
import { useTranslation } from "react-i18next";

const CommonHeroSection = ({ id, title, description }) => {
  const { t } = useTranslation();
  return (
    <section className="relative bg-[#004AAD] text-white py-20">
      <div className="absolute inset-0 opacity-75">
        <img
          src="/images/auth/auth-bg.png"
          alt="Network Pattern Background"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="container mx-auto px-4 relative">
        <h1 className="text-4xl text-[#004AAD] md:text-5xl lg:text-6xl font-bold text-center mb-6">
          {t(`${id}.${title}`)}
        </h1>
        <p className="max-w-3xl mx-auto text-center text-lg md:text-xl">
          {t(`${id}.${description}`)}
        </p>
      </div>
    </section>
  );
};

export default CommonHeroSection;
