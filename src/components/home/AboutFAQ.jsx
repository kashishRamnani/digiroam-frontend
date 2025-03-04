import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

const FAQItem = ({ question, answer, index, isOpen, onToggle }) => (
  <div className="border-b border-gray-200 py-4">
    <button
      className="flex justify-between items-center w-full text-left"
      onClick={() => onToggle(index)}
    >
      <span
        className={`${isOpen ? 'text-xl font-bold text-primary mb-4' : ''} text-md font-semibold`}
      >
        {question}
      </span>
      <FontAwesomeIcon icon={isOpen ? faMinus : faPlus} className="text-gray-400" />
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-2 text-[#303030] text-sm"
        >
          {answer}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const AboutFAQ = () => {
  const { t } = useTranslation();
  const faqs = t("home.faqs", { returnObjects: true }); 

  const [openIndex, setOpenIndex] = useState(null); 

  const handleToggle = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 overflow-hidden">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">
          {t("home.faqAbout.download.title")}
          <br />
          {t("home.faqAbout.download.app")}
        </h2>
        <div className="flex flex-wrap sm:flex-row justify-center gap-4 mb-8">
          <motion.a
            href="#"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <img
              src="/images/home/app-store-badge.png"
              alt="Download on the App Store"
              className="h-16 w-auto"
            />
          </motion.a>
          <motion.a
            href="#"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <img
              src="/images/home/google-play-badge.png"
              alt="Get it on Google Play"
              className="h-16 w-auto"
            />
          </motion.a>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-primary text-white font-semibold py-3 px-16 rounded-full text-xl shadow-lg hover:bg-orange-500 transition-colors"
        >
            {t("home.faqAbout.download.buttonText")}
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="text-left">
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
           {t("home.faqAbout.general.title")}
          </h2>
          <p className="text-[#303030] mb-8">
          {t("home.faqAbout.general.description")}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-orange-500 transition-colors"
          >
            {t("home.faqAbout.general.buttonText")}
          </motion.button>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              index={index}
              isOpen={openIndex === index}
              onToggle={handleToggle}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutFAQ;
