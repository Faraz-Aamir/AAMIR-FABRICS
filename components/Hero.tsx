"use client";

import { useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const slides = [
  {
    image: "/images/hero1.png",
    subtitle: "Spring / Summer 2026",
    title: "Luxury\nUnstitched\nCollection",
    description: "Discover Premium Fabrics From Top Brands",
    cta: "Shop Now",
    href: "/products",
    watermark: "LUXURY",
    badge: "New Arrival",
    price: "Starting from Rs. 2,499",
  },
  {
    image: "/images/hero2.png",
    subtitle: "Exclusive Designs",
    title: "Royal\nEmbroidered\nMasterpieces",
    description: "Handcrafted Elegance For Every Occasion",
    cta: "Explore Collection",
    href: "/women",
    watermark: "ROYAL",
    badge: "Best Seller",
    price: "Starting from Rs. 3,999",
  },
  {
    image: "/images/hero3.png",
    subtitle: "New Season",
    title: "Premium\nLawn &\nCotton",
    description: "Fresh Prints & Vibrant Colors For The Season",
    cta: "View All",
    href: "/products",
    watermark: "PREMIUM",
    badge: "Trending",
    price: "Starting from Rs. 1,899",
  },
];

const features = [
  { icon: "✦", text: "Free Shipping" },
  { icon: "✦", text: "Premium Quality" },
  { icon: "✦", text: "Authentic Brands" },
];

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
  }, []);

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        pagination={{ clickable: true, el: ".hero-custom-pagination" }}
        loop
        speed={1000}
        onSwiper={setSwiperInstance}
        onSlideChange={handleSlideChange}
        className="hero-swiper h-full w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-screen w-full">
              {/* Background Image with subtle zoom animation */}
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className={`object-cover transition-transform duration-[8000ms] ease-out ${
                    activeIndex === index ? "scale-105" : "scale-100"
                  }`}
                  priority={index === 0}
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ==========================================
          LARGE WATERMARK TEXT - fills the background
          ========================================== */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`watermark-${activeIndex}`}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute top-1/2 right-0 -translate-y-1/2 z-[5] pointer-events-none select-none hidden lg:block"
        >
          <span
            className="font-heading text-[18rem] xl:text-[22rem] font-bold tracking-tight leading-none"
            style={{
              WebkitTextStroke: "1.5px rgba(200, 169, 106, 0.15)",
              WebkitTextFillColor: "transparent",
            }}
          >
            {slides[activeIndex].watermark}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* ==========================================
          DECORATIVE CORNER FRAME
          ========================================== */}
      <div className="absolute inset-0 z-[6] pointer-events-none hidden md:block">
        {/* Top-left corner */}
        <div className="absolute top-20 left-8 lg:left-12">
          <div className="w-16 h-16 border-l-2 border-t-2 border-accent/30" />
        </div>
        {/* Bottom-right corner */}
        <div className="absolute bottom-20 right-8 lg:right-12">
          <div className="w-16 h-16 border-r-2 border-b-2 border-accent/30" />
        </div>
      </div>

      {/* ==========================================
          MAIN CONTENT OVERLAY
          ========================================== */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="h-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              className="max-w-xl lg:max-w-2xl pointer-events-auto"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.12, delayChildren: 0.2 },
                },
                exit: {
                  transition: { staggerChildren: 0.05, staggerDirection: -1 },
                },
              }}
            >
              {/* Badge */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
                  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
                }}
                className="mb-5"
              >
                <span className="inline-flex items-center gap-2 bg-accent/10 backdrop-blur-sm border border-accent/20 text-accent text-[10px] sm:text-xs tracking-[0.25em] uppercase px-4 py-2 font-body font-medium">
                  <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                  {slides[activeIndex].badge}
                </span>
              </motion.div>

              {/* Decorative accent line */}
              <motion.div
                variants={{
                  hidden: { width: 0, opacity: 0 },
                  visible: { width: 60, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
                  exit: { width: 0, opacity: 0, transition: { duration: 0.3 } },
                }}
                className="h-[3px] bg-accent mb-5"
              />

              {/* Subtitle */}
              <motion.p
                variants={{
                  hidden: { opacity: 0, x: -30 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
                  exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
                }}
                className="font-body text-accent text-xs sm:text-sm tracking-[0.3em] uppercase mb-3 font-medium"
              >
                {slides[activeIndex].subtitle}
              </motion.p>

              {/* Title with text shadow for readability */}
              <motion.h1
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
                  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
                }}
                className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary leading-[1.1] mb-4 whitespace-pre-line tracking-tight"
                style={{ textShadow: "0 2px 20px rgba(255,255,255,0.8), 0 1px 5px rgba(255,255,255,0.6)" }}
              >
                {slides[activeIndex].title}
              </motion.h1>

              {/* Description */}
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
                  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
                }}
                className="font-body text-gray-600 text-sm sm:text-base tracking-wide mb-4 max-w-md"
                style={{ textShadow: "0 1px 10px rgba(255,255,255,0.5)" }}
              >
                {slides[activeIndex].description}
              </motion.p>

              {/* Price Tag */}
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
                  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
                }}
                className="font-body text-accent-dark text-sm sm:text-base font-semibold tracking-wide mb-6"
                style={{ textShadow: "0 1px 10px rgba(255,255,255,0.5)" }}
              >
                {slides[activeIndex].price}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
                  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
                }}
                className="flex items-center gap-4 flex-wrap mb-8"
              >
                <Link
                  href={slides[activeIndex].href}
                  className="group inline-flex items-center gap-3 bg-accent text-white font-body text-xs sm:text-sm tracking-[0.25em] uppercase px-8 sm:px-10 py-4 hover:bg-accent-dark transition-all duration-500 hover:shadow-xl hover:shadow-accent/25"
                >
                  {slides[activeIndex].cta}
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/products"
                  className="group inline-flex items-center gap-2 border-2 border-primary/30 text-primary font-body text-xs sm:text-sm tracking-[0.2em] uppercase px-6 sm:px-8 py-[14px] hover:border-accent hover:text-accent transition-all duration-500 backdrop-blur-sm bg-white/20"
                >
                  View All
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>

              {/* Trust Features Bar */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
                  exit: { opacity: 0, transition: { duration: 0.2 } },
                }}
                className="flex items-center gap-4 sm:gap-6"
              >
                {features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-accent text-[10px]">{feature.icon}</span>
                    <span className="font-body text-[10px] sm:text-xs text-gray-500 tracking-wider uppercase">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ==========================================
          VERTICAL SIDE TEXT - Right side
          ========================================== */}
      <div className="absolute top-1/2 right-6 lg:right-10 -translate-y-1/2 z-20 hidden lg:flex flex-col items-center gap-4">
        <AnimatePresence mode="wait">
          <motion.span
            key={`side-${activeIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="font-body text-[10px] tracking-[0.4em] uppercase text-gray-400"
            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          >
            Collection 2026 — {slides[activeIndex].subtitle}
          </motion.span>
        </AnimatePresence>
        <div className="w-[1px] h-16 bg-accent/30" />
        <span className="font-heading text-accent text-lg font-bold">
          {String(activeIndex + 1).padStart(2, "0")}
        </span>
      </div>

      {/* ==========================================
          SOCIAL LINKS - Left side vertical
          ========================================== */}
      <div className="absolute top-1/2 left-6 lg:left-10 -translate-y-1/2 z-20 hidden lg:flex flex-col items-center gap-5">
        <div className="w-[1px] h-10 bg-gray-300" />
        {[
          {
            id: "whatsapp",
            href: "https://wa.me/923347092152?text=Hi%21%20I%20have%20a%20question%20about%20Aamir%20Fabrics.",
            label: "WhatsApp",
            path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z",
          },
          {
            id: "instagram",
            href: "https://instagram.com",
            label: "Instagram",
            path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
          },
          {
            id: "facebook",
            href: "https://facebook.com",
            label: "Facebook",
            path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
          },
        ].map((social) => (
          <a
            key={social.id}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-accent transition-colors duration-300"
            aria-label={social.label}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d={social.path} />
            </svg>
          </a>
        ))}
        <div className="w-[1px] h-10 bg-gray-300" />
      </div>

      {/* ==========================================
          BOTTOM BAR - Pagination + Arrows
          ========================================== */}
      {/* Custom Pagination - Bottom Left */}
      <div className="absolute bottom-8 left-6 sm:left-8 lg:left-12 z-20 flex items-center gap-6">
        <div className="hero-custom-pagination flex items-center gap-2" />
        <span className="font-body text-xs text-gray-500 tracking-widest">
          {String(activeIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </span>
      </div>

      {/* Navigation Arrows - Bottom Right */}
      <div className="absolute bottom-8 right-6 sm:right-8 lg:right-12 z-20 flex items-center gap-3">
        <button
          onClick={() => swiperInstance?.slidePrev()}
          className="w-12 h-12 border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-accent hover:border-accent hover:text-white transition-all duration-300 backdrop-blur-sm bg-white/10"
          aria-label="Previous slide"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => swiperInstance?.slideNext()}
          className="w-12 h-12 border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-accent hover:border-accent hover:text-white transition-all duration-300 backdrop-blur-sm bg-white/10"
          aria-label="Next slide"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-2"
      >
        <span className="font-body text-[10px] text-gray-400 tracking-[0.3em] uppercase rotate-90 origin-center mb-6">
          Scroll
        </span>
        <div className="w-[1px] h-8 bg-gray-300 relative overflow-hidden">
          <motion.div
            animate={{ y: [-32, 32] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-3 bg-accent absolute top-0"
          />
        </div>
      </motion.div>
    </section>
  );
}
