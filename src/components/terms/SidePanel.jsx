import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function SidePanel({
  sections,
  activeSection,
  onSectionClick,
  className,
}) {
  const handleSectionClick = (id) => {
    const sectionElement = document.getElementById(id);
    if (sectionElement) {
      // Delay scroll to allow DOM updates
      setTimeout(() => {
        window.scrollTo({
          top: sectionElement.offsetTop,
          behavior: "smooth",
        });
      }, 100); // Adjust delay if necessary
    }
    onSectionClick(id);
  };

  const {t} = useTranslation();

  return (
    <div className={`w-full bg-white shadow-lg lg:h-auto ${className}`}>
      <motion.nav
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
        className="py-6"
      >
        <h2 className="text-3xl px-6 text-primary"> {t("GeneralTermsandConditions.title")} </h2>
        <hr />
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => handleSectionClick(section.id)}
            className={`w-full text-left px-6 py-3 transition duration-300 ease-in-out flex items-start gap-3 hover:bg-gray-50 ${
              activeSection === section.id
                ? "bg-primary-color/10 border-r-4 border-[#f67a55]"
                : ""
            }`}
          >
            <span className="text-gray-900">{section.title}</span>
          </button>
        ))}
      </motion.nav>
    </div>
  );
}
