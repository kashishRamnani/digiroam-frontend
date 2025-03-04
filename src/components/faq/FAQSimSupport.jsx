import React from "react";
import { useTranslation } from "react-i18next";

const FAQSimSupport = () => {

  const {t} = useTranslation();
  return (
    <section className="relative w-full bg-white py-8 mb-4">
      <div className="absolute left-0 top-0 w-screen lg:w-4/5 lg:max-w-[70%] border-t border-r border-b border-orange-700 h-full" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="flex flex-wrap items-end justify-between">
          <div className="w-full lg:w-[75%] lg:p-6">
            <div className="space-y-6 mx-4 lg:mx-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">
                  {t("faq.device_support.question")}
                </h2>
                <p className="text-sm lg:text-base leading-relaxed text-gray-600">
                {t("faq.device_support.answer")}
                </p>
              </div>

              {/* Second FAQ Item */}
              <div>
                <h2 className="text-3xl font-bold">
                  {t("faq.how_to_buy.question")}
                </h2>
                <p className="text-md text-gray-800 mb-2">

                {t("faq.how_to_buy.answer")}
                  
                </p>
                <div className="space-y-2">
                  <p className="text-md text-gray-800">
                    {t("faq.how_to_activate.question")}
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>
                    {t('faq.how_to_activate.answer', { returnObjects: true })[0]}          
                    </li>
                    <li>
                    {t('faq.how_to_activate.answer', { returnObjects: true })[1]}          
                    </li>
                    <li>
                    {t('faq.how_to_activate.answer', { returnObjects: true })[2]}          
                    </li>
                    <li> {t('faq.how_to_activate.answer', { returnObjects: true })[3]} </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full hidden lg:block lg:w-[25%] bottom-[-20px] lg:h-[100%] lg:left-[58%] mt-12 lg:mt-0 lg:absolute max-w-2xl max-lg:mx-auto max-lg:h-[250px] max-lg:w-[250px]">
        <div className="relative w-full aspect-square h-full">
          <div className="absolute right-0 top-0 w-full h-full">
            <div className="relative w-full h-full">
              <div className="absolute max-sm:right-12 sm:right-16 lg:right-0 bg-bottom w-[75%] h-full bg-[url('/images/faq/esim-card-bg.png')] bg-no-repeat bg-contain"></div>
              <img
                src="/images/faq/esim-card.png"
                alt="Person using phone"
                className="absolute max-sm:right-8 lg:left-20 bottom-0 object-contain w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSimSupport;
