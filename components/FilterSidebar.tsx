"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FilterSidebarProps {
  brands: string[];
  fabricTypes: string[];
  selectedBrands: string[];
  selectedFabricTypes: string[];
  priceRange: [number, number];
  maxPrice: number;
  showInStock: boolean;
  onBrandChange: (brands: string[]) => void;
  onFabricTypeChange: (types: string[]) => void;
  onPriceChange: (range: [number, number]) => void;
  onInStockChange: (show: boolean) => void;
  onClearAll: () => void;
}

export default function FilterSidebar({
  brands, fabricTypes, selectedBrands, selectedFabricTypes,
  priceRange, maxPrice, showInStock,
  onBrandChange, onFabricTypeChange, onPriceChange, onInStockChange, onClearAll,
}: FilterSidebarProps) {
  const [openSections, setOpenSections] = useState({
    brand: true, fabric: true, price: true, availability: true,
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !(prev as any)[key] }));
  };

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      onBrandChange(selectedBrands.filter((b) => b !== brand));
    } else {
      onBrandChange([...selectedBrands, brand]);
    }
  };

  const toggleFabricType = (type: string) => {
    if (selectedFabricTypes.includes(type)) {
      onFabricTypeChange(selectedFabricTypes.filter((t) => t !== type));
    } else {
      onFabricTypeChange([...selectedFabricTypes, type]);
    }
  };

  const hasFilters = selectedBrands.length > 0 || selectedFabricTypes.length > 0 || showInStock || priceRange[0] > 0 || priceRange[1] < maxPrice;

  const filterContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg text-primary">Filters</h3>
        {hasFilters && (
          <button onClick={onClearAll} className="text-xs text-accent font-body hover:underline tracking-wider uppercase">
            Clear All
          </button>
        )}
      </div>

      {/* Brand */}
      <div className="border-t border-gray-100 pt-4">
        <button onClick={() => toggleSection("brand")} className="flex items-center justify-between w-full mb-3">
          <span className="font-body text-sm font-medium text-primary tracking-wider uppercase">Brand</span>
          <svg className={`w-4 h-4 transition-transform ${openSections.brand ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <AnimatePresence>
          {openSections.brand && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-2">
              {brands.map((brand) => (
                <label key={brand} className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="w-4 h-4 border-gray-300 rounded text-accent focus:ring-accent"
                  />
                  <span className="font-body text-sm text-gray-600 group-hover:text-primary transition-colors">{brand}</span>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fabric Type */}
      <div className="border-t border-gray-100 pt-4">
        <button onClick={() => toggleSection("fabric")} className="flex items-center justify-between w-full mb-3">
          <span className="font-body text-sm font-medium text-primary tracking-wider uppercase">Fabric Type</span>
          <svg className={`w-4 h-4 transition-transform ${openSections.fabric ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <AnimatePresence>
          {openSections.fabric && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-2">
              {fabricTypes.map((type) => (
                <label key={type} className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedFabricTypes.includes(type)}
                    onChange={() => toggleFabricType(type)}
                    className="w-4 h-4 border-gray-300 rounded text-accent focus:ring-accent"
                  />
                  <span className="font-body text-sm text-gray-600 group-hover:text-primary transition-colors">{type}</span>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Price Range */}
      <div className="border-t border-gray-100 pt-4">
        <button onClick={() => toggleSection("price")} className="flex items-center justify-between w-full mb-3">
          <span className="font-body text-sm font-medium text-primary tracking-wider uppercase">Price Range</span>
          <svg className={`w-4 h-4 transition-transform ${openSections.price ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <AnimatePresence>
          {openSections.price && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="space-y-3">
                <input
                  type="range"
                  min={0}
                  max={maxPrice}
                  value={priceRange[1]}
                  onChange={(e) => onPriceChange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full accent-[#C8A96A]"
                />
                <div className="flex items-center justify-between">
                  <span className="font-body text-xs text-gray-500">PKR {priceRange[0].toLocaleString()}</span>
                  <span className="font-body text-xs text-gray-500">PKR {priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Availability */}
      <div className="border-t border-gray-100 pt-4">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={showInStock}
            onChange={(e) => onInStockChange(e.target.checked)}
            className="w-4 h-4 border-gray-300 rounded text-accent focus:ring-accent"
          />
          <span className="font-body text-sm text-gray-600">In Stock Only</span>
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden flex items-center space-x-2 border border-gray-200 px-4 py-2 text-sm font-body hover:border-accent transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <span>Filters</span>
        {hasFilters && <span className="w-5 h-5 bg-accent text-white text-xs rounded-full flex items-center justify-center">{selectedBrands.length + selectedFabricTypes.length + (showInStock ? 1 : 0)}</span>}
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        {filterContent}
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-black/50 z-50 lg:hidden" />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "tween" }} className="fixed left-0 top-0 h-full w-80 bg-white z-50 p-6 overflow-y-auto lg:hidden">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading text-lg">Filters</h3>
                <button onClick={() => setMobileOpen(false)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {filterContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
