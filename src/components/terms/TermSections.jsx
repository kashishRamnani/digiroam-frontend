import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";

export default function TermSection({
  id,
  title,
  index,
  isExpanded,
  onToggle,
}) {
  const { t } = useTranslation();

  const content = t(`GeneralTermsandConditions.terms.${id}.content`);

  const paragraphs = content.split("\n");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="mb-4 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
    >
      <button
        className="w-full px-6 py-4 text-left focus:outline-none transition duration-300 ease-in-out hover:bg-gray-50"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl text-secondary font-semibold flex items-center gap-3">
            {title}
          </h2>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`transform transition-colors ${
                isExpanded ? "text-secondary" : "text-gray-400"
              }`}
            />
          </motion.div>
        </div>
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 py-4 border-t border-gray-100 ">
              {paragraphs.map((paragraph, idx) => {
                const parts = paragraph.split("**");

                return (
                  <p key={idx} className="text-gray-600 leading-relaxed mb-4">
                    {parts.map((part, index) => (
                      <span
                        key={index}
                        className={index % 2 === 1 ? "font-semibold" : ""}
                      >
                        {part}
                      </span>
                    ))}
                  </p>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
