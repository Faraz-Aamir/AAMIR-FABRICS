"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const collections = [
  {
    name: "Lawn Collection",
    description: "Breathable & vibrant prints for summer",
    image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1200&h=500&fit=crop",
    count: "85+ Designs",
    href: "/products?fabric=Lawn",
  },
  {
    name: "Cotton Collection",
    description: "Classic comfort for everyday wear",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=500&fit=crop",
    count: "60+ Designs",
    href: "/products?fabric=Cotton",
  },
  {
    name: "Winter Khaddar",
    description: "Warm & cozy fabrics for the season",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=500&fit=crop",
    count: "45+ Designs",
    href: "/products?fabric=Khaddar",
  },
  {
    name: "Luxury Embroidery",
    description: "Handcrafted elegance for special occasions",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1200&h=500&fit=crop",
    count: "30+ Designs",
    href: "/products?fabric=Embroidered",
  },
];

export default function FabricCollections() {
  return (
    <section id="collections" className="py-20 md:py-28 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-heading">Fabric Collections</h2>
          <p className="section-subheading">Curated For Every Season & Style</p>
          <div className="gold-separator" />
        </motion.div>

        {/* Bento grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Large - Lawn */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="md:col-span-2"
          >
            <Link href={collections[0].href} className="relative h-[300px] md:h-[400px] group overflow-hidden cursor-pointer block">
              <Image src={collections[0].image} alt={collections[0].name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 md:p-12">
                <span className="text-accent text-xs tracking-[0.3em] uppercase font-body">{collections[0].count}</span>
                <h3 className="font-heading text-3xl md:text-4xl font-bold text-white mt-2 mb-2">{collections[0].name}</h3>
                <p className="font-body text-white/60 text-sm mb-4">{collections[0].description}</p>
                <span className="btn-gold text-xs !px-6 !py-2 inline-block">Explore</span>
              </div>
            </Link>
          </motion.div>

          {/* Cotton */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }}>
            <Link href={collections[1].href} className="relative h-[280px] md:h-[350px] group overflow-hidden cursor-pointer block">
              <Image src={collections[1].image} alt={collections[1].name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-center">
                <span className="text-accent text-xs tracking-[0.3em] uppercase font-body">{collections[1].count}</span>
                <h3 className="font-heading text-2xl md:text-3xl font-bold text-white mt-2 mb-2">{collections[1].name}</h3>
                <p className="font-body text-white/60 text-sm mb-3">{collections[1].description}</p>
                <span className="btn-gold-outline !border-white !text-white group-hover:!bg-accent group-hover:!border-accent text-xs !px-6 !py-2 inline-block">Explore</span>
              </div>
            </Link>
          </motion.div>

          {/* Winter Khaddar */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }}>
            <Link href={collections[2].href} className="relative h-[280px] md:h-[350px] group overflow-hidden cursor-pointer block">
              <Image src={collections[2].image} alt={collections[2].name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-center">
                <span className="text-accent text-xs tracking-[0.3em] uppercase font-body">{collections[2].count}</span>
                <h3 className="font-heading text-2xl md:text-3xl font-bold text-white mt-2 mb-2">{collections[2].name}</h3>
                <p className="font-body text-white/60 text-sm mb-3">{collections[2].description}</p>
                <span className="btn-gold-outline !border-white !text-white group-hover:!bg-accent group-hover:!border-accent text-xs !px-6 !py-2 inline-block">Explore</span>
              </div>
            </Link>
          </motion.div>

          {/* Large - Luxury Embroidery */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }} viewport={{ once: true }} className="md:col-span-2">
            <Link href={collections[3].href} className="relative h-[300px] md:h-[400px] group overflow-hidden cursor-pointer block">
              <Image src={collections[3].image} alt={collections[3].name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-l from-black/70 to-transparent" />
              <div className="absolute bottom-0 right-0 p-8 md:p-12 text-right">
                <span className="text-accent text-xs tracking-[0.3em] uppercase font-body">{collections[3].count}</span>
                <h3 className="font-heading text-3xl md:text-4xl font-bold text-white mt-2 mb-2">{collections[3].name}</h3>
                <p className="font-body text-white/60 text-sm mb-4">{collections[3].description}</p>
                <span className="btn-gold text-xs !px-6 !py-2 inline-block">Explore</span>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
