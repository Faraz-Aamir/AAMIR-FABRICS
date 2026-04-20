"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import Breadcrumb from "@/components/Breadcrumb";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      setLoading(true);
      fetch(`/api/products?search=${encodeURIComponent(query)}&limit=24`)
        .then(r => r.json())
        .then(data => { setProducts(data.products || []); setLoading(false); })
        .catch(() => setLoading(false));
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [query]);

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: "Search" }]} />
        <h1 className="font-heading text-3xl text-primary mt-4 mb-2">Search Results</h1>
        {query && <p className="font-body text-sm text-gray-400 mb-8">Showing results for &ldquo;{query}&rdquo; ({products.length} found)</p>}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (<div key={i} className="animate-pulse"><div className="aspect-[3/4] bg-gray-200 mb-3" /><div className="h-3 bg-gray-200 w-1/3 mb-2" /><div className="h-4 bg-gray-200 w-2/3" /></div>))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-body text-gray-400 mb-4">No products found{query ? ` for "${query}"` : ""}</p>
            <a href="/products" className="text-accent text-sm font-body hover:underline">Browse All Products →</a>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((p: any, i: number) => (<ProductCard key={p.id} {...p} index={i} />))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return <Suspense fallback={<div className="pt-20 min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>}><SearchContent /></Suspense>;
}
