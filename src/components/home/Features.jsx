import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { faInfinity, faMobile, faMessage, faHeadset, faRocket, faSimCard } from "@fortawesome/free-solid-svg-icons";  // Import icons

export default function FeaturesGrid() {
  const { t } = useTranslation();
  const featuresObj = t("home.features", { returnObjects: true });

  const icons = [
    {
      icon: faInfinity, 
    },
    {
      icon: faMobile,
    },
    {
      icon: faMessage,
    },
    {
      icon: faHeadset,
    },
    {
      icon: faRocket,
    },
    {
      icon: faSimCard,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
        {t("home.featuresheading")}
          <br className="hidden md:block" />
          {t("home.featuresheading1")}
        </h2>
      </div>

      {/* Framer Motion Container */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
      >
        {featuresObj.map((feature, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{
              scale: 1.02,
              boxShadow: "0px 8px 24px rgba(0,0,0,0.2)",
            }}
            className="features-grid-box rounded-2xl p-8 pb-10 shadow-lg relative overflow-hidden group transition-all duration-300"
          >
            <div className="features-gradient-box"></div>

            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-6 group-hover:bg-white group-hover:scale-110 transition-all duration-300">
              
                <FontAwesomeIcon
                  icon={icons[index].icon}  
                  className="text-white text-2xl group-hover:text-[#f67a55]"
                />
              </div>

              <h3 className="text-xl font-bold mb-0 text-[#303030] group-hover:text-white">
                {feature.title}
              </h3>

              <p className="text-gray-600 group-hover:text-white">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
