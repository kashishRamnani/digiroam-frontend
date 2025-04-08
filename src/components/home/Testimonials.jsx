import { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteRight } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from "react-i18next";

export default function TestimonialsSection() {

  const { t } = useTranslation();
  const testimonialObj = t("home.testimonials", { returnObjects: true });
  const mainTestimonial = t("home.mainTestimonial", { returnObjects: true });

  const [showFullText, setShowFullText] = useState(false);

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 overflow-hidden">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <motion.h2 
            className="text-4xl font-bold text-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {mainTestimonial.heading}
          </motion.h2>

          <motion.p 
            className="text-[#303030] text-md leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {showFullText
              ? mainTestimonial.text
              : `${mainTestimonial.text.slice(0, 400)}...`}
          </motion.p>

          <motion.button
            onClick={() => setShowFullText(prev => !prev)}
            className="px-8 py-2 bg-[#f67a55] text-white rounded-full font-semibold hover:bg-[#e56a45] transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showFullText ? "Show Less" : mainTestimonial.btnText}
          </motion.button>
        </div>

        <div className="space-y-6">
          {testimonialObj.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className={`${testimonial.id != 2 ? 'lg:ml-12' : ''} flex gap-4 items-start relative`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="absolute left-0 top-0 w-1 h-full bg-[#f67a55] rounded-full" />
              
              <div className="pl-6 flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="text-xl font-semibold text-gray-800">{testimonial.name}</h3>
                  <FontAwesomeIcon 
                    icon={faQuoteRight} 
                    className="text-[#f67a55] text-3xl ml-auto"
                  />
                </div>
                <p className="text-[#303030] text-md">{testimonial.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
