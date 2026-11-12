import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { services } from "../lib/data";

export default React.memo(function Services() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredServices = activeCategory === "all"
    ? services
    : services.filter((s) => s.category === activeCategory);

  return (
    <section id="services" className="py-24 bg-[#F5F0EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            className="font-serif text-4xl md:text-5xl text-[#1C1917] mb-4"
          >
            Salon Services & Packages
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 max-w-2xl mx-auto mb-10"
          >
            Explore our expert haircuts, advanced skin treatments, and royal bridal packages designed exclusively for you at Demo Salon.
          </motion.p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {[
              { id: "all", label: "All Services" },
              { id: "haircuts", label: "Haircuts & Styling" },
              { id: "skin", label: "Skin Treatments" },
              { id: "bridal", label: "Bridal Packages" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all ${
                  activeCategory === cat.id
                    ? "bg-[#1C1917] text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-[#E8E1D7] border border-gray-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-8 lg:gap-10"
        >
          <AnimatePresence>
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow group rounded-sm overflow-hidden flex flex-col"
                itemScope
                itemType="https://schema.org/Service"
              >
                <meta itemProp="provider" content="Demo Salon Agra" />
                <div className="h-32 sm:h-48 w-full overflow-hidden">
                  <img
                    itemProp="image"
                    src={service.image}
                    alt={`${service.title} at Demo Salon Agra`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-4 sm:p-8 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-2 sm:mb-4">
                      <h3
                        className="font-serif text-sm sm:text-xl text-[#1C1917] pr-1 line-clamp-2"
                        itemProp="name"
                      >
                        {service.title}
                      </h3>
                      <span className="text-[#C4A47C] font-semibold text-xs sm:text-base shrink-0 mt-1 sm:mt-0">
                        {service.price}
                      </span>
                    </div>
                    <p
                      className="text-xs sm:text-sm text-gray-500 mb-4 leading-relaxed line-clamp-2 sm:line-clamp-none"
                      itemProp="description"
                    >
                      {service.description}
                    </p>
                  </div>
                  <div className="pt-2 sm:pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 font-medium tracking-wide uppercase">
                    <span className="hidden sm:inline-flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {service.duration}
                    </span>
                    <a
                      href="#booking"
                      className="text-[#1C1917] group-hover:text-[#C4A47C] font-semibold transition-colors"
                    >
                      Book &rarr;
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
});
