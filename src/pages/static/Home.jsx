import MainLayout from "../../layouts/MainLayout";
import { useTranslation } from "react-i18next";
import {
  HeroSection,
  ESimPlans,
  MobileMockups,
  AboutFAQ,
  FeaturesGrid,
  TestimonialsSection,
  AnimatedSection,
} from "../../components";

const Home = () => {
  const { t } = useTranslation();
  return (
    <MainLayout title="Home" description="Welcome to our app">
      <HeroSection />
      <ESimPlans />
      <MobileMockups />
      <AnimatedSection>
        <FeaturesGrid />
      </AnimatedSection>
      <AnimatedSection>
        <TestimonialsSection />
      </AnimatedSection>
      <AboutFAQ />
    </MainLayout>
  );
};

export default Home;
