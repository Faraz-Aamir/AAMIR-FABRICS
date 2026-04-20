"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useSession } from "next-auth/react";
import { useUI } from "@/contexts/UIContext";
import Breadcrumb from "@/components/Breadcrumb";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const { data: session } = useSession();
  const { setIsAuthOpen, setAuthTab } = useUI();

  const handleCheckout = () => {
    if (!session) {
      setAuthTab("login");
      setIsAuthOpen(true);
      return;
    }
  };

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: "Shopping Cart" }]} />
        <h1 className="font-heading text-3xl md:text-4xl text-primary mt-4 mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <svg className="w-24 h-24 mx-auto text-gray-200 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="font-heading text-2xl text-gray-400 mb-2">Your cart is empty</h2>
            <p className="font-body text-gray-400 mb-6">Looks like you haven&apos;t added anything yet</p>
            <Link href="/products" className="inline-block bg-accent text-white px-8 py-3 font-body text-sm tracking-[0.15em] uppercase hover:bg-accent/90 transition-colors">
              Continue Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-gray-200 font-body text-xs text-gray-400 tracking-wider uppercase">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {items.map((item) => (
                <motion.div
                  key={`${item.id}-${item.size}-${item.color}`}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 py-4 border-b border-gray-100 items-center"
                >
                  {/* Product */}
                  <div className="md:col-span-6 flex gap-4">
                    <div className="relative w-20 h-24 bg-gray-100 flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                    </div>
                    <div>
                      <p className="text-xs text-accent tracking-[0.15em] uppercase font-body">{item.brand}</p>
                      <h3 className="font-body text-sm font-medium text-primary">{item.name}</h3>
                      {(item.size || item.color) && (
                        <p className="text-xs text-gray-400 font-body mt-1">
                          {item.size && `Size: ${item.size}`}{item.size && item.color && " · "}{item.color}
                        </p>
                      )}
                      <button onClick={() => removeItem(item.id, item.size, item.color)} className="text-xs text-red-400 hover:text-red-600 font-body mt-2 transition-colors">
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="md:col-span-2 text-center font-body text-sm">
                    PKR {item.price.toLocaleString()}
                  </div>

                  {/* Quantity */}
                  <div className="md:col-span-2 flex items-center justify-center">
                    <div className="flex items-center border border-gray-200">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1, item.size, item.color)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 text-sm">−</button>
                      <span className="w-10 h-8 flex items-center justify-center text-xs font-body font-medium border-x border-gray-200">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1, item.size, item.color)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 text-sm">+</button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="md:col-span-2 text-right font-body text-sm font-semibold">
                    PKR {(item.price * item.quantity).toLocaleString()}
                  </div>
                </motion.div>
              ))}

              <div className="flex justify-between pt-4">
                <button onClick={clearCart} className="text-sm font-body text-gray-400 hover:text-red-500 transition-colors">Clear Cart</button>
                <Link href="/products" className="text-sm font-body text-accent hover:underline">Continue Shopping</Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-100 p-6 sticky top-24 space-y-4">
                <h3 className="font-heading text-lg text-primary border-b border-gray-100 pb-4">Order Summary</h3>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>PKR {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-body text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className={totalPrice >= 5000 ? "text-green-600" : ""}>{totalPrice >= 5000 ? "Free" : "PKR 250"}</span>
                </div>
                <div className="w-full h-px bg-gray-200" />
                <div className="flex justify-between font-heading text-lg">
                  <span>Total</span>
                  <span>PKR {(totalPrice + (totalPrice >= 5000 ? 0 : 250)).toLocaleString()}</span>
                </div>
                {totalPrice < 5000 && <p className="text-xs font-body text-gray-400">Add PKR {(5000 - totalPrice).toLocaleString()} more for free shipping</p>}
                {session ? (
                  <Link href="/checkout" className="block w-full text-center py-3 bg-accent text-white font-body text-sm tracking-[0.15em] uppercase hover:bg-accent/90 transition-colors">
                    Proceed to Checkout
                  </Link>
                ) : (
                  <button onClick={handleCheckout} className="w-full py-3 bg-accent text-white font-body text-sm tracking-[0.15em] uppercase hover:bg-accent/90 transition-colors">
                    Sign In to Checkout
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
