"use client";

import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  bgImage?: string;
}

export default function PageHeader({ title, subtitle, bgImage }: PageHeaderProps) {
  return (
    <div
      className="relative h-[280px] md:h-[350px] flex items-center justify-center overflow-hidden"
      style={{
        background: bgImage
          ? `linear-gradient(rgba(17,17,17,0.6), rgba(17,17,17,0.6)), url(${bgImage}) center/cover no-repeat`
          : "linear-gradient(135deg, #111111 0%, #2a2a2a 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center z-10 px-4"
      >
        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-3">{title}</h1>
        {subtitle && (
          <p className="font-body text-sm md:text-base text-gray-300 tracking-[0.2em] uppercase">{subtitle}</p>
        )}
        <div className="w-16 h-0.5 bg-accent mx-auto mt-4" />
      </motion.div>
    </div>
  );
}
