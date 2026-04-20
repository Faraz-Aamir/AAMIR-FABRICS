"use client";

import { useState, useEffect, useCallback } from "react";
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
  },
  {
    image: "/images/hero2.png",
    subtitle: "Exclusive Designs",
    title: "Royal\nEmbroidered\nMasterpieces",
    description: "Handcrafted Elegance For Every Occasion",
    cta: "Explore Collection",
    href: "/women",
  },
  {
    image: "/images/hero3.png",
    subtitle: "New Season",
    title: "Premium\nLawn &\nCotton",
    description: "Fresh Prints & Vibrant Colors For The Season",
    cta: "View All",
    href: "/products",
  },
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

      {/* Content Overlay - positioned outside Swiper for consistent animations */}
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
                  transition: { staggerChildren: 0.15, delayChildren: 0.3 },
                },
                exit: {
                  transition: { staggerChildren: 0.05, staggerDirection: -1 },
                },
              }}
            >
              {/* Decorative accent line */}
              <motion.div
                variants={{
                  hidden: { width: 0, opacity: 0 },
                  visible: { width: 60, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
                  exit: { width: 0, opacity: 0, transition: { duration: 0.3 } },
                }}
                className="h-[3px] bg-accent mb-6"
              />

              {/* Subtitle */}
              <motion.p
                variants={{
                  hidden: { opacity: 0, x: -30 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
                  exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
                }}
                className="font-body text-accent text-xs sm:text-sm tracking-[0.3em] uppercase mb-4 font-medium"
              >
                {slides[activeIndex].subtitle}
              </motion.p>

              {/* Title */}
              <motion.h1
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
                  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
                }}
                className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary leading-[1.1] mb-5 whitespace-pre-line tracking-tight"
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
                className="font-body text-gray-600 text-sm sm:text-base tracking-wide mb-8 max-w-md"
              >
                {slides[activeIndex].description}
              </motion.p>

              {/* CTA Button */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
                  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
                }}
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
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

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
          className="w-12 h-12 border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-accent hover:border-accent hover:text-white transition-all duration-300"
          aria-label="Previous slide"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => swiperInstance?.slideNext()}
          className="w-12 h-12 border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-accent hover:border-accent hover:text-white transition-all duration-300"
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
