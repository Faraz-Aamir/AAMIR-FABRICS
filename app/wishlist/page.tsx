"use client";

import { motion } from "framer-motion";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useSession } from "next-auth/react";
import { useUI } from "@/contexts/UIContext";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const { addItem: addToCart } = useCart();
  const { data: session } = useSession();
  const { setIsAuthOpen, setAuthTab } = useUI();

  const handleMoveToCart = (item: any) => {
    if (!session) { setAuthTab("login"); setIsAuthOpen(true); return; }
    addToCart({ id: item.id, slug: item.slug, name: item.name, brand: item.brand, price: item.price, image: item.image });
    removeItem(item.id);
  };

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: "Wishlist" }]} />
        <h1 className="font-heading text-3xl text-primary mt-4 mb-8">My Wishlist ({items.length})</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-20 h-20 mx-auto text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            <p className="font-body text-gray-400 mb-4">Your wishlist is empty</p>
            <Link href="/products" className="text-accent text-sm font-body hover:underline">Browse Products →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {items.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white group">
                <Link href={`/product/${item.slug}`} className="block">
                  <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                    <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 50vw, 25vw" />
                  </div>
                </Link>
                <div className="p-4">
                  <p className="text-accent text-xs tracking-[0.2em] uppercase font-body mb-1">{item.brand}</p>
                  <h3 className="font-body text-sm font-medium text-primary mb-1 line-clamp-1">{item.name}</h3>
                  <p className="font-body text-sm font-semibold mb-3">PKR {item.price.toLocaleString()}</p>
                  <div className="flex gap-2">
                    <button onClick={() => handleMoveToCart(item)} className="flex-1 py-2 bg-accent text-white text-xs font-body tracking-wider uppercase hover:bg-accent/90 transition-colors">
                      Add to Cart
                    </button>
                    <button onClick={() => removeItem(item.id)} className="w-10 h-auto border border-gray-200 flex items-center justify-center hover:border-red-300 hover:text-red-500 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
