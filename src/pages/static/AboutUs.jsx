import MainLayout from "../../layouts/MainLayout";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
  faUsers,
  faBullseye,
} from "@fortawesome/free-solid-svg-icons";
import { CommonHeroSection } from "../../components";

const AboutUs = () => {
  const { t } = useTranslation();
  return (
    <MainLayout
      title={t("aboutUs.title")}
      description={t("aboutUs.description")}
    >
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <CommonHeroSection
          id={"aboutUs"}
          title={"heading"}
          description={"heroText"}
        />
        {/* Main Content */}
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto px-4">
            {/* Seamless Connection Section */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div className="relative aspect-square">
                <img
                  src="/images/aboutus/seamless-travel.png"
                  alt="Global Connectivity"
                  className="rounded-2xl object-cover w-full h-full"
                />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#f67a55] rounded-2xl -z-10"></div>
              </div>
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-[#303030]">
                  {t("aboutUs.seamlessConnectionHeading")}
                </h2>
                <p className="text-lg text-gray-600">
                  {t("aboutUs.seamlessConnectionText1")}
                </p>
                <p className="text-lg text-gray-600">
                  {t("aboutUs.seamlessConnectionText2")}
                </p>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              <div className="bg-gray-50 p-8 rounded-2xl text-center">
                <FontAwesomeIcon
                  icon={faGlobe}
                  className="text-5xl text-[#f67a55] mb-4"
                />
                <h3 className="text-4xl font-bold text-[#0049ac] mb-2">200+</h3>
                <p className="text-gray-600">{t("aboutUs.countriesRegions")}</p>
              </div>
              <div className="bg-gray-50 p-8 rounded-2xl text-center">
                <FontAwesomeIcon
                  icon={faUsers}
                  className="text-5xl text-[#f67a55] mb-4"
                />
                <h3 className="text-4xl font-bold text-[#0049ac] mb-2">44+</h3>
                <p className="text-gray-600">
                  {t("aboutUs.countriesWithLocalTeams")}
                </p>
              </div>
              <div className="bg-gray-50 p-8 rounded-2xl text-center">
                <FontAwesomeIcon
                  icon={faBullseye}
                  className="text-5xl text-[#f67a55] mb-4"
                />
                <h3 className="text-4xl font-bold text-[#0049ac] mb-2">6</h3>
                <p className="text-gray-600">
                  {t("aboutUs.continentsCovered")}
                </p>
              </div>
            </div>

            {/* Mission Section */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 order-2 md:order-1">
                <h2 className="text-3xl md:text-4xl font-bold text-[#303030]">
                  {t("aboutUs.missionHeading")}
                </h2>
                <p className="text-lg text-gray-600">
                  {t("aboutUs.missionText1")}
                </p>
                <p className="text-lg text-gray-600">
                  {t("aboutUs.missionText2")}
                </p>
                <p className="text-lg text-gray-600">
                  {t("aboutUs.missionText3")}
                </p>
              </div>
              <div className="relative aspect-square order-1 md:order-2">
                <img
                  src="/images/aboutus/about-mission.png"
                  alt="Our Mission"
                  className="rounded-2xl object-cover w-full h-full"
                />
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#0049ac] rounded-2xl -z-10"></div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </MainLayout>
  );
};

export default AboutUs;
