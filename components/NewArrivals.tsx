"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useCart } from "@/contexts/CartContext";
import { useUI } from "@/contexts/UIContext";

export default function NewArrivals() {
  const [products, setProducts] = useState<any[]>([]);
  const { data: session } = useSession();
  const { addItem } = useCart();
  const { setIsAuthOpen, setAuthTab } = useUI();

  useEffect(() => {
    fetch("/api/products?newArrivals=true&limit=8")
      .then(r => r.json())
      .then(data => setProducts(data.products || []))
      .catch(() => {});
  }, []);

  const handleAddToCart = (e: React.MouseEvent, p: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (p.isOutOfStock) return;
    if (!session) { setAuthTab("login"); setIsAuthOpen(true); return; }
    const imgs = (() => { try { return JSON.parse(p.images); } catch { return []; } })();
    addItem({ id: p.id, slug: p.slug, name: p.name, brand: p.brand, price: p.discountPrice || p.price, image: imgs[0] || "/images/placeholder.png" });
  };

  return (
    <section id="new-arrivals" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-heading">Latest Arrivals</h2>
          <p className="section-subheading">Fresh From The Latest Collections</p>
          <div className="gold-separator" />
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => {
            const imgs = (() => { try { return JSON.parse(product.images); } catch { return []; } })();
            const mainImage = imgs[0] || "/images/placeholder.png";
            const hasDiscount = product.discountPrice && product.originalPrice && product.discountPrice < product.originalPrice;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
              >
                <Link href={`/product/${product.slug}`} className="group block bg-white overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {/* Image */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    <Image
                      src={mainImage}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />

                    {/* Badge */}
                    {hasDiscount ? (
                      <span className="absolute top-3 left-3 px-3 py-1 text-xs font-body font-medium tracking-wider uppercase z-10 bg-red-500 text-white">
                        -{product.discountPercent || Math.round(((product.originalPrice - product.discountPrice) / product.originalPrice) * 100)}%
                      </span>
                    ) : (
                      <span className="absolute top-3 left-3 px-3 py-1 text-xs font-body font-medium tracking-wider uppercase z-10 bg-accent text-white">New</span>
                    )}

                    {/* Add to Cart Overlay */}
                    {!product.isOutOfStock && (
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center">
                        <button onClick={(e) => handleAddToCart(e, product)}
                          className="bg-accent text-white px-6 py-2 text-xs font-body tracking-[0.15em] uppercase opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-accent/90">
                          Add to Cart
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <p className="text-accent text-xs tracking-[0.2em] uppercase font-body mb-1">{product.brand}</p>
                    <h3 className="font-body text-sm font-medium text-primary mb-2 line-clamp-1">{product.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="font-body text-sm font-semibold text-primary">PKR {(product.discountPrice || product.price).toLocaleString()}</span>
                      {hasDiscount && (
                        <span className="font-body text-xs text-gray-400 line-through">PKR {product.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="font-body text-gray-400">Loading latest arrivals...</p>
          </div>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/products" className="btn-gold-outline inline-block">
            View All Products
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
