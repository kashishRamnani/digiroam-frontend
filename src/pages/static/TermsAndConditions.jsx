import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import MainLayout from "../../layouts/MainLayout";
import { TermSection, CommonHeroSection, SidePanel } from "../../components";

const TermsAndConditions = () => {
  const { t } = useTranslation();
  const [expandedSection, setExpandedSection] = useState(null);
  const [activeSection, setActiveSection] = useState(null);

  const termsSections = [
    {
      id: "validity",
      title: t("GeneralTermsandConditions.ValidityofTheseTerms"),
    },
    {
      id: "description",
      title: t("GeneralTermsandConditions.DescriptionofServices"),
    },
    {
      id: "duration",
      title: t(
        "GeneralTermsandConditions.StartDurationandTerminationofService"
      ),
    },
    { id: "charges", title: t("GeneralTermsandConditions.ChargesandPayment") },
    {
      id: "delivery",
      title: t("GeneralTermsandConditions.DeliveryofServices"),
    },
    {
      id: "refund",
      title: t(
        "GeneralTermsandConditions.RefundCancellationandModificationPolicy"
      ),
    },
    {
      id: "currencies",
      title: t("GeneralTermsandConditions.UseofDigitalCurrencies"),
    },
    {
      id: "esim",
      title: t("GeneralTermsandConditions.eSIMRecyclingandActivationPolicy"),
    },
    {
      id: "pricing",
      title: t("GeneralTermsandConditions.PricingandPromotions"),
    },
    { id: "location", title: t("GeneralTermsandConditions.LocationTracking") },
    {
      id: "compliance",
      title: t("GeneralTermsandConditions.LocalRegulatoryCompliance"),
    },
    {
      id: "warranties",
      title: t("GeneralTermsandConditions.RepresentationsandWarranties"),
    },
    {
      id: "account",
      title: t("GeneralTermsandConditions.EndingorSuspendingYourAccount"),
    },
    { id: "links", title: t("GeneralTermsandConditions.LinkstoOtherWebsites") },
    {
      id: "ip",
      title: t("GeneralTermsandConditions.IntellectualPropertyRights"),
    },
    {
      id: "copyright",
      title: t("GeneralTermsandConditions.CopyrightComplaints"),
    },
    {
      id: "confidential",
      title: t("GeneralTermsandConditions.ConfidentialInformation"),
    },
    {
      id: "disclaimer",
      title: t("GeneralTermsandConditions.DisclaimersofWarranties"),
    },
    {
      id: "indemnification",
      title: t("GeneralTermsandConditions.Indemnification"),
    },
    { id: "dispute", title: t("GeneralTermsandConditions.DisputeResolution") },
    { id: "law", title: t("GeneralTermsandConditions.GoverningLaw") },
    {
      id: "agency",
      title: t("GeneralTermsandConditions.NoAgencyorEmployment"),
    },
    { id: "general", title: t("GeneralTermsandConditions.GeneralProvisions") },
    {
      id: "changes",
      title: t("GeneralTermsandConditions.ChangestoTermsandServices"),
    },
    {
      id: "thirdparty",
      title: t("GeneralTermsandConditions.NoThirdPartyRights"),
    },
    {
      id: "notices",
      title: t("GeneralTermsandConditions.NoticesandCommunication"),
    },
    { id: "contact", title: t("GeneralTermsandConditions.ContactInformation") },
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
      title={t("GeneralTermsandConditions.title")}
      description="Our terms and conditions of use"
    >
      <main className="min-h-screen pb-12 bg-gray-50">
        <CommonHeroSection
          id={"GeneralTermsandConditions"}
          title={"title"}
          description={"description"}
        />
        <div className="relative max-w-7xl mx-auto">
          <SidePanel
            sections={termsSections}
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
            {termsSections.map((section, index) => (
              <div key={section.id} id={section.id}>
                <TermSection
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

export default TermsAndConditions;
