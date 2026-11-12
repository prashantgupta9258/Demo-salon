import React, { lazy, Suspense } from "react";
import { motion } from "motion/react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Services from "../components/Services";
import WhatsAppAIChat from "../components/WhatsAppAIChat";

const Faq = lazy(() => import("../components/Faq"));
const Reviews = lazy(() => import("../components/Reviews"));
const Contact = lazy(() => import("../components/Contact"));
const Footer = lazy(() => import("../components/Footer"));

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      <Navbar />
      <main id="main-content">
        <Hero />
        <Services />
        <Suspense fallback={<div className="h-32 bg-white animate-pulse" />}>
          <Faq />
        </Suspense>
        <Suspense fallback={<div className="h-32 bg-[#1C1917] animate-pulse" />}>
          <Reviews />
        </Suspense>
        {/* About section */}
        <section
          id="about"
          className="py-24 bg-white"
          itemScope
          itemType="https://schema.org/AboutPage"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto px-6 text-center"
          >
            <h2
              className="font-serif text-4xl md:text-5xl text-[#1C1917] mb-6"
              itemProp="headline"
            >
              Why Choose Demo Salon Agra?
            </h2>
            <p
              className="text-gray-600 text-lg leading-relaxed"
              itemProp="text"
            >
              Founded with a passion for excellence and style,{" "}
              <strong>Demo Salon Agra</strong> represents the pinnacle of modern
              haircuts, advanced skin treatments, and royal bridal packages in Agra, Uttar Pradesh. Our team
              of expert stylists and estheticians are dedicated to bringing out your natural
              beauty through personalized consultations, bespoke balayage treatments, and professional care. We believe every appointment
              should be an experience of relaxation and transformation at our premium salon.
            </p>
          </motion.div>
        </section>
        <Suspense fallback={<div className="h-32 bg-white animate-pulse" />}>
          <Contact />
        </Suspense>
      </main>

      {/* WhatsApp AI Chat & Direct WhatsApp Chat Widget */}
      <WhatsAppAIChat />

      <Suspense fallback={<div className="h-24 bg-[#1C1917]" />}>
        <Footer />
      </Suspense>
    </div>
  );
}
