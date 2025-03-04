import MainLayout from "../../layouts/MainLayout";
import { useTranslation } from "react-i18next";
import {
  FaqHeroSection,
  FaqContent,
  FAQSimSupport,
  FAQSpecific,
  AnimatedSection,
} from "../../components";

const FAQs = () => {
  const { t } = useTranslation();
  return (
    <MainLayout title="FAQs" description="Frequently Asked Questions">
      <FaqHeroSection />
      <FaqContent />
      <FAQSimSupport />
      <AnimatedSection>
        <FAQSpecific />
      </AnimatedSection>
    </MainLayout>
  );
};

export default FAQs;
