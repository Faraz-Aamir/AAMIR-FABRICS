"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

export default function CartSidebar() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, isCartOpen, setIsCartOpen } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/50 z-[60]"
          />
          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-heading text-xl text-primary">
                Shopping Bag <span className="text-accent text-sm font-body">({totalItems})</span>
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-16">
                  <svg className="w-16 h-16 mx-auto text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p className="font-body text-gray-400 mb-2">Your bag is empty</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-accent text-sm font-body hover:underline"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4 pb-4 border-b border-gray-50">
                    <div className="relative w-20 h-24 bg-gray-100 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-accent tracking-[0.15em] uppercase font-body">{item.brand}</p>
                      <h4 className="font-body text-sm font-medium text-primary truncate">{item.name}</h4>
                      {(item.size || item.color) && (
                        <p className="text-xs text-gray-400 font-body mt-0.5">
                          {item.size && `Size: ${item.size}`}{item.size && item.color && " · "}{item.color && item.color}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-gray-200">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.size, item.color)}
                            className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors text-sm"
                          >
                            −
                          </button>
                          <span className="w-8 h-7 flex items-center justify-center text-xs font-body font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.size, item.color)}
                            className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors text-sm"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-body text-sm font-semibold">
                          PKR {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id, item.size, item.color)}
                      className="text-gray-300 hover:text-red-500 transition-colors self-start mt-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-body text-sm text-gray-500">Subtotal</span>
                  <span className="font-heading text-lg">PKR {totalPrice.toLocaleString()}</span>
                </div>
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="block w-full text-center py-3 border-2 border-primary text-primary font-body text-sm tracking-[0.15em] uppercase hover:bg-primary hover:text-white transition-all duration-300"
                >
                  View Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="block w-full text-center py-3 bg-accent text-white font-body text-sm tracking-[0.15em] uppercase hover:bg-accent/90 transition-all duration-300"
                >
                  Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
