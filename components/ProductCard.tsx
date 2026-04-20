"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useUI } from "@/contexts/UIContext";

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number | null;
  images: string; // JSON string
  isOutOfStock: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  stockQuantity?: number;
  index?: number;
}

export default function ProductCard({
  id, slug, name, brand, price, originalPrice, images,
  isOutOfStock, isNewArrival, isBestSeller, index = 0,
}: ProductCardProps) {
  const { data: session } = useSession();
  const { addItem: addToCart } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const { setIsAuthOpen, setAuthTab } = useUI();

  const imageList: string[] = (() => {
    try { return JSON.parse(images); } catch { return []; }
  })();
  const mainImage = imageList[0] || "/images/placeholder.png";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    if (!session) {
      setAuthTab("login");
      setIsAuthOpen(true);
      return;
    }
    addToCart({ id, slug, name, brand, price, image: mainImage });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({ id, slug, name, brand, price, image: mainImage });
  };

  const badge = isOutOfStock
    ? "Out of Stock"
    : isNewArrival
    ? "New"
    : isBestSeller
    ? "Best Seller"
    : originalPrice
    ? "Sale"
    : null;

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      viewport={{ once: true }}
    >
      <Link href={`/product/${slug}`} className="group block bg-white cursor-pointer overflow-hidden transition-all duration-500 hover:shadow-lg">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <Image
            src={mainImage}
            alt={name}
            fill
            className={`object-cover transition-transform duration-700 group-hover:scale-110 ${isOutOfStock ? "grayscale opacity-70" : ""}`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Badge */}
          {badge && (
            <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-body font-medium tracking-wider uppercase z-10 ${
              badge === "Out of Stock"
                ? "bg-red-600 text-white"
                : badge === "Sale"
                ? "bg-red-500 text-white"
                : "bg-accent text-white"
            }`}>
              {badge}
              {badge === "Sale" && discount > 0 && ` -${discount}%`}
            </span>
          )}

          {/* Hover Overlay */}
          {!isOutOfStock && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center">
              <button
                onClick={handleAddToCart}
                className="bg-accent text-white px-6 py-2 text-xs font-body tracking-[0.15em] uppercase opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-accent/90"
              >
                Add to Cart
              </button>
            </div>
          )}

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <span className="bg-white/90 text-primary px-4 py-2 text-xs font-body tracking-[0.15em] uppercase font-medium">
                Notify Me
              </span>
            </div>
          )}

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
            <button
              onClick={handleWishlist}
              className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors ${
                isInWishlist(id)
                  ? "bg-accent text-white"
                  : "bg-white hover:bg-accent hover:text-white"
              }`}
              aria-label="Wishlist"
            >
              <svg className="w-4 h-4" fill={isInWishlist(id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-accent text-xs tracking-[0.2em] uppercase font-body mb-1">{brand}</p>
          <h3 className="font-body text-sm font-medium text-primary mb-2 line-clamp-1">{name}</h3>
          <div className="flex items-center space-x-2">
            <span className="font-body text-sm font-semibold text-primary">PKR {price.toLocaleString()}</span>
            {originalPrice && (
              <span className="font-body text-xs text-gray-400 line-through">PKR {originalPrice.toLocaleString()}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
