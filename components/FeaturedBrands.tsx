"use client";

import { motion } from "framer-motion";

const brands = [
  { name: "Sapphire", initials: "S" },
  { name: "Khaadi", initials: "K" },
  { name: "Gul Ahmed", initials: "GA" },
  { name: "Junaid Jamshed", initials: "J." },
  { name: "Alkaram", initials: "AK" },
  { name: "Nishat Linen", initials: "NL" },
  { name: "Sana Safinaz", initials: "SS" },
  { name: "Maria B", initials: "MB" },
];

export default function FeaturedBrands() {
  return (
    <section id="brands" className="py-20 md:py-28 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-heading">Featured Brands</h2>
          <p className="section-subheading">Trusted Names In Fashion</p>
          <div className="gold-separator" />
        </motion.div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white border border-gray-100 p-8 md:p-10 flex flex-col items-center justify-center cursor-pointer
                         transition-all duration-300 hover:shadow-xl hover:shadow-accent/10 hover:border-accent/30 group"
            >
              {/* Brand Logo Placeholder - Elegant Text-based */}
              <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-4
                            group-hover:bg-accent/10 transition-colors duration-300">
                <span className="font-heading text-2xl font-bold text-primary group-hover:text-accent transition-colors duration-300">
                  {brand.initials}
                </span>
              </div>
              <span className="font-body text-sm tracking-wider text-gray-600 group-hover:text-primary transition-colors duration-300">
                {brand.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
