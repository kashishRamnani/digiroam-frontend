import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import MainLayout from "../../layouts/MainLayout";
import {
  PoliciesSection,
  CommonHeroSection,
  PoliciesSidePanel,
} from "../../components";

const PrivacyPolicy = () => {
  const { t } = useTranslation();
  const [expandedSection, setExpandedSection] = useState(null);
  const [activeSection, setActiveSection] = useState(null);

  const policiesSection = [
    {
      id: "validity",
      title: t("privacypolicy.ValidityofTheseTerms"),
    },
    {
      id: "description",
      title: t("privacypolicy.DescriptionofServices"),
    },
    {
      id: "duration",
      title: t("privacypolicy.StartDurationandTerminationofService"),
    },
    { id: "charges", title: t("privacypolicy.ChargesandPayment") },
    {
      id: "delivery",
      title: t("privacypolicy.DeliveryofServices"),
    },
    {
      id: "refund",
      title: t("privacypolicy.RefundCancellationandModificationPolicy"),
    },
    {
      id: "currencies",
      title: t("privacypolicy.UseofDigitalCurrencies"),
    },
    {
      id: "esim",
      title: t("privacypolicy.eSIMRecyclingandActivationPolicy"),
    },
    {
      id: "pricing",
      title: t("privacypolicy.PricingandPromotions"),
    },
    { id: "location", title: t("privacypolicy.LocationTracking") }
    ];

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
    setActiveSection(activeSection === section ? null : section);
  };

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    setExpandedSection(sectionId);
  };

  return (
    <MainLayout
      title={t("privacypolicy.title")}
      description="Our terms and conditions of use"
    >
      <main className="min-h-screen pb-12 bg-gray-50">
        <CommonHeroSection
          id={"privacypolicy"}
          title={"title"}
          description={"description"}
        />
        <div className="relative max-w-7xl mx-auto">
          <PoliciesSidePanel
            sections={policiesSection}
            activeSection={activeSection}
            onSectionClick={scrollToSection}
            className="hidden lg:block lg:w-1/4 xl:w-1/5 lg:absolute lg:left-0 lg:mb-12"
          />
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden px-4 sm:px-6 lg:px-8 mt-12 lg:ml-[25%] xl:ml-[20%] lg:w-[75%] xl:w-[80%]"
          >
            {policiesSection.map((section, index) => (
              <div key={section.id} id={section.id}>
                <PoliciesSection
                  id={section.id}
                  title={section.title}
                  index={index}
                  isExpanded={expandedSection === section.id}
                  onToggle={() => toggleSection(section.id)}
                />
              </div>
            ))}
          </motion.section>
        </div>
      </main>
    </MainLayout>
  );
};

export default PrivacyPolicy;
