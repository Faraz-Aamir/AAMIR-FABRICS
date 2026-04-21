"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import Breadcrumb from "@/components/Breadcrumb";
import PageHeader from "@/components/PageHeader";

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

interface CollectionPageProps {
  category: string;
  title: string;
  subtitle: string;
  bgImage?: string;
}

const ALL_BRANDS = ["Sapphire", "Khaadi", "Gul Ahmed", "Maria B", "Alkaram", "Sana Safinaz", "Nishat Linen", "Junaid Jamshed"];
const ALL_FABRICS = ["Lawn", "Cotton", "Chiffon", "Velvet", "Silk", "Organza", "Khaddar", "Wash & Wear", "Jacquard", "Embroidered"];

export default function CollectionPage({ category, title, subtitle, bgImage }: CollectionPageProps) {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFabricTypes, setSelectedFabricTypes] = useState<string[]>([]);
  const [showInStock, setShowInStock] = useState(false);
  const [sort, setSort] = useState("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Detect special modes from URL
  const isNewArrivals = searchParams.get("newArrivals") === "true";
  const isSale = searchParams.get("sale") === "true";

  // Dynamic title/subtitle based on URL params
  const displayTitle = isNewArrivals ? "New Arrivals" : isSale ? "Sale" : title;
  const displaySubtitle = isNewArrivals ? "Fresh From The Latest Collections" : isSale ? "Exclusive Discounts & Deals" : subtitle;

  // Read fabric type from URL params (from FabricCollections links)
  useEffect(() => {
    const fabric = searchParams.get("fabric");
    if (fabric && ALL_FABRICS.includes(fabric)) {
      setSelectedFabricTypes([fabric]);
    }
  }, [searchParams]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== "ALL") params.set("category", category);
    if (selectedBrands.length > 0) params.set("brand", selectedBrands.join(","));
    if (selectedFabricTypes.length > 0) params.set("fabricType", selectedFabricTypes.join(","));
    if (showInStock) params.set("inStock", "true");
    if (sort) params.set("sort", sort);
    params.set("limit", "24");

    if (isNewArrivals) params.set("newArrivals", "true");
    if (isSale) params.set("onSale", "true");

    try {
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotalProducts(data.pagination?.total || 0);
    } catch {
      setProducts([]);
    }
    setLoading(false);
  }, [category, selectedBrands, selectedFabricTypes, showInStock, sort, isNewArrivals, isSale]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedFabricTypes([]);
    setShowInStock(false);
  };

  const activeFilterCount = selectedBrands.length + selectedFabricTypes.length + (showInStock ? 1 : 0);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
  };

  const toggleFabric = (fabric: string) => {
    setSelectedFabricTypes(prev => prev.includes(fabric) ? prev.filter(f => f !== fabric) : [...prev, fabric]);
  };

  return (
    <div>
      <PageHeader title={displayTitle} subtitle={displaySubtitle} bgImage={bgImage} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Breadcrumb items={[{ label: displayTitle }]} />
        </div>

        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 border border-gray-200 px-4 py-2 text-sm font-body hover:border-accent transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-accent text-white text-[10px] rounded-full flex items-center justify-center">{activeFilterCount}</span>
              )}
            </button>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="text-xs text-red-400 hover:text-red-600 font-body">Clear All</button>
            )}
            <span className="font-body text-sm text-gray-400">{totalProducts} products</span>
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            className="border border-gray-200 px-4 py-2 text-sm font-body focus:border-accent focus:outline-none bg-white">
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Alphabetical</option>
          </select>
        </div>

        {/* Expandable Filters Panel */}
        {filtersOpen && (
          <div className="bg-white border border-gray-100 p-6 mb-8 animate-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Brands */}
              <div>
                <h3 className="font-body text-xs text-gray-500 tracking-wider uppercase mb-3 font-medium">Brand</h3>
                <div className="flex flex-wrap gap-2">
                  {ALL_BRANDS.map(brand => (
                    <button key={brand} onClick={() => toggleBrand(brand)}
                      className={`px-3 py-1.5 text-xs font-body border transition-colors ${selectedBrands.includes(brand)
                        ? "border-accent bg-accent/10 text-accent" : "border-gray-200 text-gray-500 hover:border-gray-400"}`}>
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
              {/* Fabric Types */}
              <div>
                <h3 className="font-body text-xs text-gray-500 tracking-wider uppercase mb-3 font-medium">Fabric Type</h3>
                <div className="flex flex-wrap gap-2">
                  {ALL_FABRICS.map(fabric => (
                    <button key={fabric} onClick={() => toggleFabric(fabric)}
                      className={`px-3 py-1.5 text-xs font-body border transition-colors ${selectedFabricTypes.includes(fabric)
                        ? "border-accent bg-accent/10 text-accent" : "border-gray-200 text-gray-500 hover:border-gray-400"}`}>
                      {fabric}
                    </button>
                  ))}
                </div>
              </div>
              {/* Availability */}
              <div>
                <h3 className="font-body text-xs text-gray-500 tracking-wider uppercase mb-3 font-medium">Availability</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={showInStock} onChange={e => setShowInStock(e.target.checked)} className="w-4 h-4 accent-accent" />
                  <span className="text-sm font-body">In Stock Only</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div>
          {loading ? (
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
              <svg className="w-16 h-16 mx-auto text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="font-body text-gray-400 mb-2">No products found</p>
              <button onClick={clearFilters} className="text-accent text-sm font-body hover:underline">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product, index) => (
                <ProductCard key={product.id} {...product} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
