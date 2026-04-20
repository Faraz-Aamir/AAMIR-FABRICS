"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useUI } from "@/contexts/UIContext";
import Breadcrumb from "@/components/Breadcrumb";
import ProductCard from "@/components/ProductCard";

interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  fabricType: string;
  price: number;
  originalPrice: number | null;
  discountPrice: number | null;
  discountPercent: number | null;
  discountExpiry: string | null;
  description: string;
  images: string;
  sizes: string;
  colors: string;
  stockQuantity: number;
  isOutOfStock: boolean;
  restockDate: string | null;
  isNewArrival: boolean;
  isBestSeller: boolean;
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: {
  product: Product;
  relatedProducts: Product[];
}) {
  const { data: session } = useSession();
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const { setIsAuthOpen, setAuthTab } = useUI();

  const images: string[] = (() => { try { return JSON.parse(product.images); } catch { return []; } })();
  const sizes: string[] = (() => { try { return JSON.parse(product.sizes); } catch { return []; } })();
  const colors: string[] = (() => { try { return JSON.parse(product.colors); } catch { return []; } })();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [expiryCountdown, setExpiryCountdown] = useState("");

  // Determine display price
  const hasDiscount = product.discountPrice && product.originalPrice && product.discountPrice < product.originalPrice;
  const displayPrice = hasDiscount ? product.discountPrice! : product.price;
  const strikePrice = hasDiscount ? product.originalPrice! : null;
  const discountPct = hasDiscount
    ? (product.discountPercent || Math.round(((product.originalPrice! - product.discountPrice!) / product.originalPrice!) * 100))
    : 0;

  // Check if discount is expired
  const isExpired = product.discountExpiry ? new Date(product.discountExpiry) < new Date() : false;

  // Countdown timer for discount expiry
  useEffect(() => {
    if (!product.discountExpiry || isExpired) return;
    const updateCountdown = () => {
      const now = new Date();
      const expiry = new Date(product.discountExpiry!);
      const diff = expiry.getTime() - now.getTime();
      if (diff <= 0) { setExpiryCountdown("Expired"); return; }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      if (days > 0) setExpiryCountdown(`${days} day${days > 1 ? "s" : ""} ${hours}h left`);
      else {
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setExpiryCountdown(`${hours}h ${mins}m left`);
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [product.discountExpiry, isExpired]);

  const mainImage = images[selectedImage] || "/images/placeholder.png";

  const handleAddToCart = () => {
    if (product.isOutOfStock) return;
    if (!session) {
      setAuthTab("login");
      setIsAuthOpen(true);
      return;
    }
    addItem(
      { id: product.id, slug: product.slug, name: product.name, brand: product.brand, price: isExpired ? product.price : displayPrice, image: mainImage, size: selectedSize, color: selectedColor, maxStock: product.stockQuantity },
      quantity
    );
  };

  const categoryLabel = product.category === "MEN" ? "Men" : product.category === "WOMEN" ? "Women" : "Kids";

  return (
    <div className="pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[
          { label: categoryLabel, href: `/${categoryLabel.toLowerCase()}` },
          { label: product.name },
        ]} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mt-8">
          {/* Image Gallery */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-4">
              <Image src={mainImage} alt={product.name} fill className={`object-cover ${product.isOutOfStock ? "grayscale opacity-70" : ""}`} sizes="(max-width: 1024px) 100vw, 50vw" priority />
              {product.isOutOfStock && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 text-sm font-body tracking-wider uppercase">
                  Out of Stock
                </div>
              )}
              {hasDiscount && !isExpired && !product.isOutOfStock && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 text-sm font-body font-medium">
                  -{discountPct}% OFF
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)} className={`relative aspect-square bg-gray-100 overflow-hidden border-2 transition-colors ${selectedImage === i ? "border-accent" : "border-transparent hover:border-gray-300"}`}>
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="100px" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="space-y-6">
            <div>
              <p className="text-accent text-xs tracking-[0.25em] uppercase font-body mb-2">{product.brand}</p>
              <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl text-primary mb-3">{product.name}</h1>
              
              {/* Price Display */}
              <div className="flex items-center flex-wrap gap-3">
                {hasDiscount && !isExpired ? (
                  <>
                    <span className="font-heading text-2xl text-red-600">PKR {displayPrice.toLocaleString()}</span>
                    <span className="font-body text-lg text-gray-400 line-through">PKR {strikePrice!.toLocaleString()}</span>
                    <span className="bg-red-500 text-white px-2 py-0.5 text-xs font-body font-medium rounded">Save {discountPct}%</span>
                  </>
                ) : (
                  <>
                    <span className="font-heading text-2xl text-primary">PKR {product.price.toLocaleString()}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="font-body text-lg text-gray-400 line-through">PKR {product.originalPrice.toLocaleString()}</span>
                    )}
                  </>
                )}
              </div>

              {/* Discount Expiry Countdown */}
              {hasDiscount && !isExpired && expiryCountdown && (
                <div className="mt-2 inline-flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-1.5">
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-body text-red-600 font-medium">Offer ends in {expiryCountdown}</span>
                </div>
              )}
            </div>

            <div className="w-full h-px bg-gray-200" />

            <p className="font-body text-sm text-gray-600 leading-relaxed">{product.description}</p>

            {/* Fabric Type */}
            <div>
              <span className="font-body text-xs text-gray-500 tracking-wider uppercase">Fabric</span>
              <p className="font-body text-sm text-primary mt-1">{product.fabricType}</p>
            </div>

            {/* Stock Status */}
            {product.isOutOfStock && (
              <div className="bg-red-50 border border-red-200 p-4">
                <p className="font-body text-sm text-red-600 font-medium">This product is currently out of stock</p>
                {product.restockDate && (
                  <p className="font-body text-xs text-red-500 mt-1">Expected restock: {new Date(product.restockDate).toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" })}</p>
                )}
              </div>
            )}

            {!product.isOutOfStock && product.stockQuantity <= 5 && (
              <p className="text-orange-600 text-sm font-body">Only {product.stockQuantity} left in stock!</p>
            )}

            {/* Size Selector */}
            {sizes.length > 0 && (
              <div>
                <span className="font-body text-xs text-gray-500 tracking-wider uppercase block mb-2">Size</span>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      disabled={product.isOutOfStock}
                      className={`min-w-[48px] h-10 px-3 border text-sm font-body transition-all ${
                        selectedSize === size
                          ? "border-accent bg-accent text-white"
                          : product.isOutOfStock
                          ? "border-gray-200 text-gray-300 cursor-not-allowed"
                          : "border-gray-200 hover:border-accent"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {colors.length > 0 && (
              <div>
                <span className="font-body text-xs text-gray-500 tracking-wider uppercase block mb-2">
                  Color{selectedColor && `: ${selectedColor}`}
                </span>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      disabled={product.isOutOfStock}
                      className={`px-4 py-2 border text-sm font-body transition-all ${
                        selectedColor === color
                          ? "border-accent bg-accent/10 text-accent"
                          : product.isOutOfStock
                          ? "border-gray-200 text-gray-300 cursor-not-allowed"
                          : "border-gray-200 hover:border-accent"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4">
              {!product.isOutOfStock && (
                <div className="flex items-center border border-gray-200">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-12 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">−</button>
                  <span className="w-12 h-12 flex items-center justify-center font-body text-sm font-medium border-x border-gray-200">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))} className="w-10 h-12 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">+</button>
                </div>
              )}
              <button
                onClick={handleAddToCart}
                disabled={product.isOutOfStock}
                className={`flex-1 h-12 font-body text-sm tracking-[0.15em] uppercase transition-all duration-300 ${
                  product.isOutOfStock
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-accent text-white hover:bg-accent/90"
                }`}
              >
                {product.isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>

            {/* Wishlist */}
            <button
              onClick={() => toggleItem({ id: product.id, slug: product.slug, name: product.name, brand: product.brand, price: displayPrice, image: mainImage })}
              className="flex items-center space-x-2 font-body text-sm text-gray-500 hover:text-accent transition-colors"
            >
              <svg className="w-5 h-5" fill={isInWishlist(product.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}</span>
            </button>

            <div className="w-full h-px bg-gray-200" />

            {/* Details Tabs */}
            <div>
              <div className="flex border-b border-gray-200">
                {["description", "details", "shipping"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 px-4 text-xs font-body tracking-wider uppercase transition-colors ${
                      activeTab === tab ? "text-accent border-b-2 border-accent" : "text-gray-400 hover:text-primary"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="py-4 font-body text-sm text-gray-600 leading-relaxed">
                {activeTab === "description" && <p>{product.description}</p>}
                {activeTab === "details" && (
                  <div className="space-y-2">
                    <p><strong>Brand:</strong> {product.brand}</p>
                    <p><strong>Category:</strong> {categoryLabel}</p>
                    <p><strong>Fabric:</strong> {product.fabricType}</p>
                    <p><strong>Available Sizes:</strong> {sizes.join(", ")}</p>
                    <p><strong>Colors:</strong> {colors.join(", ")}</p>
                  </div>
                )}
                {activeTab === "shipping" && (
                  <div className="space-y-2">
                    <p>Free delivery on orders above PKR 5,000</p>
                    <p>Standard delivery: 3-5 business days</p>
                    <p>Cash on Delivery available nationwide</p>
                    <p>Easy returns within 7 days</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="font-heading text-2xl text-center mb-2">You May Also Like</h2>
            <p className="text-center font-body text-sm text-gray-400 tracking-[0.2em] uppercase mb-8">Similar Products</p>
            <div className="w-16 h-0.5 bg-accent mx-auto mb-10" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} {...p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
