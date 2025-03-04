import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function FAQSpecific() {
  const { t } = useTranslation();


  const specificFaqs = t("faq.specificFaqs", { returnObjects: true });

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 overflow-hidden md:mt-12">
      <div
        className="grid gap-6 md:grid-cols-2"
        style={{
          gridAutoFlow: "row dense",
        }}
      >
        {specificFaqs.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            className={`relative ${
              specificFaqs.length % 2 !== 0 &&
              index === specificFaqs.length - 1 &&
              "md:col-span-2 md:mx-auto"
            }`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
          >
            <div className="flex gap-4 items-start">
              <div className="absolute left-0 top-0 w-1 h-full bg-[#f67a55] rounded-full" />
              <div className="pl-6 flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {testimonial.title}
                  </h3>
                </div>
                <p className="text-[#303030] text-md">
                  {testimonial.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
