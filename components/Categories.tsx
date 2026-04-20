"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const categories = [
  { name: "Men", image: "/images/category-men.png", count: "120+ Fabrics", href: "/men" },
  { name: "Women", image: "/images/category-women.png", count: "250+ Fabrics", href: "/women" },
  { name: "Kids", image: "/images/category-kids.png", count: "80+ Fabrics", href: "/kids" },
];

export default function Categories() {
  return (
    <section id="categories" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-heading">Shop By Category</h2>
          <p className="section-subheading">Find Your Perfect Fabric</p>
          <div className="gold-separator" />
        </motion.div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
            >
              <Link href={cat.href} className="group relative h-[500px] md:h-[600px] overflow-hidden cursor-pointer block">
                {/* Image */}
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-all duration-500 group-hover:from-black/90" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
                  <motion.div
                    className="transform transition-transform duration-500 group-hover:-translate-y-2"
                  >
                    <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mb-2">
                      {cat.count}
                    </p>
                    <h3 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
                      {cat.name}
                    </h3>
                    <div className="overflow-hidden">
                      <div className="btn-gold-outline !border-white !text-white group-hover:!bg-accent group-hover:!border-accent inline-block text-xs transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        Shop {cat.name}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
