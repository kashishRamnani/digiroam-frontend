import React from "react";
import { useTranslation } from "react-i18next";

const FaqContent = () => {
  const {t} = useTranslation();
  return (
    <section className="w-full bg-white">
      <div className="container max-w-7xl mx-auto px-4 overflow-hidden py-8">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 relative">
            <div
              className="absolute inset-0 bg-cover bg-center z-0 rounded-none rounded-tr-[40px] rounded-bl-[40px]"
              style={{
                backgroundImage: "url('/images/faq/intro-faq-bg.png')",
                opacity: 0.9,
              }}
            />
            <div className="relative z-10 p-8 lg:p-16 text-white">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-white text-3xl font-bold">
                    {t("faq.what_is_esim.question")}
                  </h2>
                  <p className="text-md leading-relaxed">
                  {t("faq.what_is_esim.answer")}
                  </p>
                </div>
                <div className="space-y-4">
                  <h2 className="text-white text-3xl font-bold">
                    {t("faq.how_does_roamdigi_work.question")}
                  </h2>
                  <p className="text-md leading-relaxed">
                      {t("faq.how_does_roamdigi_work.answer")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full lg:w-1/2 bg-white p-8 lg:p-16">
            <div className="space-y-8">
              <h2 className=" text-3xl font-bold text-gray-800">
                {t("faq.benefits_of_esim.question")}
              </h2>
              <p className="text-md text-gray-600">

              {t("faq.benefits_of_esim.several")}
              </p>

              <div className="space-y-2">
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-800">
                {t("faq.benefits_of_esim.few")}
                </h3>
                <ul className="space-y-4 text-md text-gray-600 list-disc">
                  <li>
                  {t('faq.benefits_of_esim.answer', { returnObjects: true })[0]}
                  </li>
                  <li>
                  {t('faq.benefits_of_esim.answer', { returnObjects: true })[1]}
                  </li>
                  <li>
                  {t('faq.benefits_of_esim.answer', { returnObjects: true })[2]}
                  </li>
                  <li>{t('faq.benefits_of_esim.answer', { returnObjects: true })[3]}</li>
                  <li>{t('faq.benefits_of_esim.answer', { returnObjects: true })[4]}</li>
                  <li>
                  {t('faq.benefits_of_esim.answer', { returnObjects: true })[5]}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqContent;
