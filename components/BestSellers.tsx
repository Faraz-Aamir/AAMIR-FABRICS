"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useCart } from "@/contexts/CartContext";
import { useUI } from "@/contexts/UIContext";

import "swiper/css";
import "swiper/css/navigation";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? "text-accent" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function BestSellers() {
  const [products, setProducts] = useState<any[]>([]);
  const { data: session } = useSession();
  const { addItem } = useCart();
  const { setIsAuthOpen, setAuthTab } = useUI();

  useEffect(() => {
    fetch("/api/products?bestSellers=true&limit=8")
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
    <section id="best-sellers" className="py-20 md:py-28 bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white text-center">
            Best Sellers
          </h2>
          <p className="font-body text-sm md:text-base text-white/50 text-center tracking-widest uppercase mt-3">
            Most Loved By Our Customers
          </p>
          <div className="gold-separator" />
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {products.length > 0 ? (
            <Swiper
              modules={[Navigation, Autoplay]}
              navigation
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              spaceBetween={24}
              slidesPerView={1.2}
              breakpoints={{
                640: { slidesPerView: 2.2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              className="bestseller-swiper !pb-4"
            >
              {products.map((product) => {
                const imgs = (() => { try { return JSON.parse(product.images); } catch { return []; } })();
                const mainImage = imgs[0] || "/images/placeholder.png";

                return (
                  <SwiperSlide key={product.id}>
                    <Link href={`/product/${product.slug}`} className="group cursor-pointer block">
                      {/* Image */}
                      <div className="relative aspect-[3/4] overflow-hidden mb-4">
                        <Image
                          src={mainImage}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 640px) 80vw, (max-width: 768px) 45vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500 flex items-center justify-center">
                          <button onClick={(e) => handleAddToCart(e, product)}
                            className="bg-accent text-white px-6 py-2 text-xs font-body tracking-[0.15em] uppercase opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-accent/90">
                            Add to Cart
                          </button>
                        </div>
                        {/* Bestseller Badge */}
                        <div className="absolute top-3 left-3 bg-accent text-white text-[10px] font-body font-medium tracking-wider uppercase px-3 py-1">
                          Bestseller
                        </div>
                      </div>

                      {/* Info */}
                      <div>
                        <StarRating rating={4.8} />
                        <p className="text-accent text-xs tracking-[0.2em] uppercase font-body mt-2 mb-1">{product.brand}</p>
                        <h3 className="font-body text-sm font-medium text-white/90 mb-2 line-clamp-1">{product.name}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="font-body text-sm font-semibold text-accent">PKR {(product.discountPrice || product.price).toLocaleString()}</span>
                          {product.discountPrice && product.originalPrice && (
                            <span className="font-body text-xs text-white/40 line-through">PKR {product.originalPrice.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          ) : (
            <p className="text-center text-white/40 font-body">Loading best sellers...</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
