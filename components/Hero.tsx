"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";


const slides = [
  {
    image: "/images/hero1.png",
    subtitle: "Spring / Summer 2026",
    title: "Luxury Unstitched\nCollection",
    description: "Discover Premium Fabrics From Top Brands",
    cta: "Shop Now",
    href: "/products",
  },
  {
    image: "/images/hero2.png",
    subtitle: "Exclusive Designs",
    title: "Royal Embroidered\nMasterpieces",
    description: "Handcrafted Elegance For Every Occasion",
    cta: "Explore Collection",
    href: "/women",
  },
  {
    image: "/images/hero3.png",
    subtitle: "New Season",
    title: "Premium Lawn\n& Cotton",
    description: "Fresh Prints & Vibrant Colors For The Season",
    cta: "View All",
    href: "/products",
  },
];

export default function Hero() {
  return (
    <section id="hero" className="relative h-screen w-full">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
        speed={800}
        className="hero-swiper h-full w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-screen w-full">
              {/* Background Image */}
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              {/* Subtle bottom gradient for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

              {/* Content - Centered at bottom */}
              <div className="absolute inset-0 flex items-end justify-center pb-20 sm:pb-24">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: false }}
                  className="text-center"
                >
                  <p className="font-body text-white/90 text-sm sm:text-base tracking-[0.25em] uppercase mb-2">
                    {slide.subtitle}
                  </p>
                  <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold text-white leading-tight mb-4 whitespace-pre-line tracking-wide">
                    {slide.title}
                  </h1>
                  <Link href={slide.href} className="inline-block font-body text-white text-sm tracking-[0.3em] uppercase border-b border-white/60 pb-1 hover:border-white transition-colors duration-300">
                    {slide.cta}
                  </Link>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-accent rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
