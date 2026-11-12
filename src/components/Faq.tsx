import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { BUSINESS_INFO } from "../lib/businessInfo";

interface FAQItem {
  question: string;
  answer: string;
}

export default React.memo(function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqData: FAQItem[] = [
    {
      question: "Where is Demo Salon located in Agra?",
      answer: `Demo Salon is located ${BUSINESS_INFO.address}, ${BUSINESS_INFO.city}, ${BUSINESS_INFO.state}, ${BUSINESS_INFO.postalCode}. We provide a comfortable, professional environment for all your salon needs.`,
    },
    {
      question: "What services does Demo Salon offer?",
      answer: "We offer professional haircuts & styling for women and men, advanced skin treatments & hydrafacials, and royal bridal makeup and event packages.",
    },
    {
      question: "How can I book an appointment?",
      answer: `You can quickly request an appointment through our website booking form, or initiate a WhatsApp chat with us directly at ${BUSINESS_INFO.phone}.`,
    },
    {
      question: "What are the salon's business hours?",
      answer: "We are open Monday through Sunday from 9:00 AM to 8:00 PM to accommodate your schedule.",
    },
    {
      question: "Do you offer skin treatments and facials in Agra?",
      answer: "Yes, our estheticians provide advanced skincare treatments, including hydrafacials, anti-aging gold facials, and deep tan removal therapies.",
    },
    {
      question: "What is the contact email for Demo Salon?",
      answer: `You can reach us anytime at ${BUSINESS_INFO.email} or call ${BUSINESS_INFO.phone}.`,
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-white" itemScope itemType="https://schema.org/FAQPage">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F5F0EB] text-[#C4A47C] rounded-full text-xs font-semibold tracking-wider uppercase mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl text-[#1C1917] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about our salon services, pricing, opening hours, and appointments in Agra.
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border border-gray-100 rounded-lg overflow-hidden transition-all duration-300 bg-gray-50/50 hover:bg-white hover:shadow-sm"
                itemProp="mainEntity"
                itemScope
                itemType="https://schema.org/Question"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left px-6 py-5 flex justify-between items-center gap-4 transition-colors focus:outline-none"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="font-serif text-lg text-[#1C1917] font-medium leading-snug" itemProp="name">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#C4A47C] transition-transform duration-300 shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      itemProp="acceptedAnswer"
                      itemScope
                      itemType="https://schema.org/Answer"
                    >
                      <div className="px-6 pb-6 pt-1 text-gray-600 text-sm leading-relaxed border-t border-gray-100" itemProp="text">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});
