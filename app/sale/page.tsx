"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Breadcrumb from "@/components/Breadcrumb";

interface SaleEvent {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "active" | "ended";
}

interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number | null;
  images: string;
  isOutOfStock: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  stockQuantity: number;
}

function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      return { days, hours, minutes, seconds };
    };
    setTimeLeft(calc());
    const timer = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center gap-3 sm:gap-6 justify-center flex-wrap">
      {units.map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-3 sm:gap-6">
          <div className="text-center">
            <motion.div
              key={unit.value}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="w-16 h-16 sm:w-20 sm:h-20 bg-primary flex items-center justify-center mb-2"
            >
              <span className="font-heading text-2xl sm:text-3xl font-bold text-white">
                {String(unit.value).padStart(2, "0")}
              </span>
            </motion.div>
            <p className="font-body text-[10px] sm:text-xs text-gray-400 tracking-[0.2em] uppercase">
              {unit.label}
            </p>
          </div>
          {i < 3 && (
            <span className="font-heading text-2xl sm:text-3xl text-accent font-bold mb-6">:</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function SalePage() {
  const [sale, setSale] = useState<SaleEvent | null>(null);
  const [saleLoading, setSaleLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [sort, setSort] = useState("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Fetch active sale event
  useEffect(() => {
    fetch("/api/sale")
      .then((r) => r.json())
      .then((data) => {
        setSale(data.sale);
        setSaleLoading(false);
      })
      .catch(() => setSaleLoading(false));
  }, []);

  // Fetch products only when sale is active
  const fetchProducts = useCallback(async () => {
    if (!sale || sale.status !== "active") return;
    setProductsLoading(true);
    try {
      const res = await fetch(`/api/products?onSale=true&sort=${sort}&limit=48`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      setProducts([]);
    }
    setProductsLoading(false);
  }, [sale, sort]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return (
    <div>
      {/* ─── PAGE HEADER — always shows "SALE" ─── */}
      <div
        className="relative h-[220px] sm:h-[280px] md:h-[320px] flex items-center justify-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #111111 0%, #1a1a1a 50%, #0a0a0a 100%)" }}
      >
        {/* Animated background accent */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center z-10 px-4"
        >
          {/* Sale name or just SALE */}
          <AnimatePresence mode="wait">
            {!saleLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {sale && (sale.status === "upcoming" || sale.status === "active") ? (
                  <>
                    <p className="font-body text-accent text-xs tracking-[0.4em] uppercase mb-3">
                      {sale.status === "active" ? "🔴 Live Now" : "Coming Soon"}
                    </p>
                    <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white font-bold tracking-tight">
                      {sale.name}
                    </h1>
                  </>
                ) : (
                  <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl text-white font-bold tracking-tight">
                    SALE
                  </h1>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="w-16 h-0.5 bg-accent mx-auto mt-4" />
        </motion.div>
      </div>

      {/* ─── CONTENT BELOW HEADER ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="mb-6">
          <Breadcrumb items={[{ label: "Sale" }]} />
        </div>

        <AnimatePresence mode="wait">
          {saleLoading ? (
            /* Loading skeleton */
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-24"
            >
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </motion.div>

          ) : !sale || sale.status === "ended" ? (
            /* ── STATE 1: No sale / ended ── */
            <motion.div
              key="no-sale"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-gray-100">
                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl text-primary mb-3">No Sale Yet</h2>
              <p className="font-body text-gray-400 text-sm sm:text-base tracking-wide mb-8 max-w-md mx-auto">
                {sale?.status === "ended"
                  ? "This sale has ended. Stay tuned for our next exciting sale!"
                  : "Stay tuned for our upcoming sales — Eid, Summer, Winter and more!"}
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link href="/women" className="btn-gold inline-block">
                  Shop Women
                </Link>
                <Link href="/products?newArrivals=true" className="btn-gold-outline inline-block">
                  New Arrivals
                </Link>
              </div>
            </motion.div>

          ) : sale.status === "upcoming" ? (
            /* ── STATE 2: Countdown ── */
            <motion.div
              key="countdown"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 sm:py-16"
            >
              <p className="font-body text-gray-500 text-xs sm:text-sm tracking-[0.3em] uppercase mb-4">
                Sale Goes Live In
              </p>
              <div className="mb-8">
                <Countdown targetDate={sale.startDate} />
              </div>
              {sale.description && (
                <p className="font-body text-gray-400 text-sm sm:text-base max-w-md mx-auto mb-8 tracking-wide">
                  {sale.description}
                </p>
              )}
              <p className="font-body text-xs text-gray-400 tracking-wider mb-2">
                Sale ends:{" "}
                <span className="text-primary font-medium">
                  {new Date(sale.endDate).toLocaleDateString("en-PK", {
                    day: "numeric", month: "long", year: "numeric",
                  })}
                </span>
              </p>
              <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
                <Link href="/women" className="btn-gold inline-block">
                  Shop Now
                </Link>
                <Link href="/products?newArrivals=true" className="btn-gold-outline inline-block">
                  New Arrivals
                </Link>
              </div>
            </motion.div>

          ) : (
            /* ── STATE 3: Active sale — show products ── */
            <motion.div
              key="active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Sale info bar */}
              <div className="bg-primary text-white px-6 py-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <p className="font-body text-xs text-accent tracking-[0.3em] uppercase">🔴 Sale Active</p>
                  {sale.description && (
                    <p className="font-body text-sm text-white/70 mt-0.5">{sale.description}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-body text-xs text-white/50 tracking-wider">Sale ends</p>
                  <p className="font-body text-sm font-medium text-accent">
                    {new Date(sale.endDate).toLocaleDateString("en-PK", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Filters bar */}
              <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
                <span className="font-body text-sm text-gray-400">
                  {products.length} sale products
                </span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="border border-gray-200 px-4 py-2 text-sm font-body focus:border-accent focus:outline-none bg-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name">Alphabetical</option>
                </select>
              </div>

              {/* Products grid */}
              {productsLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-[3/4] bg-gray-200 mb-3" />
                      <div className="h-3 bg-gray-200 w-1/3 mb-2" />
                      <div className="h-4 bg-gray-200 w-2/3 mb-2" />
                      <div className="h-3 bg-gray-200 w-1/4" />
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-16">
                  <p className="font-body text-gray-400 mb-4">No sale products found.</p>
                  <p className="font-body text-sm text-gray-300">
                    Go to Admin → Products and set a discount price on products to include them in the sale.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {products.map((product, index) => (
                    <ProductCard key={product.id} {...product} index={index} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
