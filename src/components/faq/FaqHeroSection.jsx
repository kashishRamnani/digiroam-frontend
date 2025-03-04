import React from "react";
import { useTranslation } from "react-i18next";
const FaqHeroSection = () => {

  const {t} = useTranslation();

  return (
    <section className="relative w-full overflow-hidden">
      {/* Main background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/faq/faq-bg.png"
          alt="FAQ Hero BG"
          className="w-full h-full opacity-95 object-cover lg:object-fill"
        />
      </div>
      <div className="relative z-10 container flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Left Content Section */}
        <div className="w-full lg:w-1/2 space-y-8">
          {/* Main Content */}
          <h1 className="text-[#303030] text-4xl lg:text-6xl font-bold leading-tight lg:pt-6 pt-10 text-center">
            {t("faq.faq_title")}
          </h1>
        </div>
        {/* Right Image Section */}
        <div className="w-full lg:w-1/2 mt-12 lg:mt-0 relative max-w-2xl">
          <div className="relative w-full aspect-square  lg:max-h-full">
            <div className="absolute right-0 top-0 w-full h-full">
              <div className="relative w-full h-full">
                <div className="absolute max-sm:right-12 sm:right-16 lg:right-0 top-0 w-[75%] h-full bg-[url('/images/faq/faq-hero-bg.png')] bg-cover rounded-br-[70px]"></div>
                <img
                  src="/images/faq/faq-hero.png"
                  alt="Person using phone"
                  className="absolute max-sm:right-8 lg:left-12 bottom-0 object-contain w-full h-[90%]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqHeroSection;
