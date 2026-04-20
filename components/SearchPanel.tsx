"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useUI } from "@/contexts/UIContext";

interface SearchResult {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  images: string;
  isOutOfStock: boolean;
}

export default function SearchPanel() {
  const { isSearchOpen, setIsSearchOpen } = useUI();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const performSearch = useCallback(async (value: string) => {
    if (value.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(value)}&limit=6`);
      const data = await res.json();
      setResults(data.products || []);
    } catch {
      setResults([]);
    }
    setLoading(false);
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);

    // Debounce: wait 300ms after last keystroke before searching
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setResults([]);
    }
  };

  const handleClose = () => {
    setIsSearchOpen(false);
    setQuery("");
    setResults([]);
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
  };

  const getImage = (images: string) => {
    try {
      const arr = JSON.parse(images);
      return arr[0] || "/images/placeholder.png";
    } catch {
      return "/images/placeholder.png";
    }
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-[60]"
          />
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 left-0 right-0 bg-white z-[70] shadow-2xl max-h-[80vh] overflow-y-auto"
          >
            <div className="max-w-4xl mx-auto p-6 md:p-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-xl text-primary">Search</h2>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search for fabrics, brands, collections..."
                    className="w-full border-b-2 border-gray-200 focus:border-accent pb-3 text-lg font-body outline-none bg-transparent placeholder:text-gray-300 transition-colors"
                    autoFocus
                  />
                  <button type="submit" className="absolute right-0 bottom-3 text-gray-400 hover:text-accent transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>

              {loading && (
                <div className="py-8 text-center">
                  <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              )}

              {!loading && results.length > 0 && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      onClick={handleClose}
                      className="group flex flex-col"
                    >
                      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-2">
                        <Image
                          src={getImage(product.images)}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                        {product.isOutOfStock && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="bg-red-600 text-white text-xs font-body px-3 py-1 tracking-wider uppercase">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-accent tracking-[0.15em] uppercase font-body">{product.brand}</p>
                      <h4 className="font-body text-sm text-primary truncate">{product.name}</h4>
                      <p className="font-body text-sm font-semibold mt-0.5">PKR {product.price.toLocaleString()}</p>
                    </Link>
                  ))}
                </div>
              )}

              {!loading && query.length >= 2 && results.length === 0 && (
                <p className="py-8 text-center font-body text-gray-400">No products found for &ldquo;{query}&rdquo;</p>
              )}

              {query.length >= 2 && results.length > 0 && (
                <div className="mt-6 text-center">
                  <button
                    onClick={handleSubmit as any}
                    className="text-accent font-body text-sm hover:underline tracking-wide"
                  >
                    View all results for &ldquo;{query}&rdquo; →
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
