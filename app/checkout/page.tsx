"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/contexts/CartContext";
import Breadcrumb from "@/components/Breadcrumb";
import Image from "next/image";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    shippingName: "",
    shippingEmail: "",
    shippingPhone: "",
    shippingAddress: "",
    shippingCity: "",
    paymentMethod: "COD",
    transactionId: "",
  });

  // Sync session data into form when session loads
  useEffect(() => {
    if (session?.user) {
      setForm((prev) => ({
        ...prev,
        shippingName: prev.shippingName || session.user?.name || "",
        shippingEmail: prev.shippingEmail || session.user?.email || "",
      }));
    }
  }, [session]);

  const shipping = totalPrice >= 5000 ? 0 : 250;
  const total = totalPrice + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          total,
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
            size: item.size,
            color: item.color,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to place order");
        setLoading(false);
        return;
      }

      clearCart();
      router.push(`/order-confirmation?orderId=${data.id}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <p className="font-body text-gray-400">Please sign in to proceed with checkout.</p>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
        <h1 className="font-heading text-3xl md:text-4xl text-primary mt-4 mb-8">Checkout</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm font-body rounded">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shipping Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-gray-100 p-6 space-y-4">
                <h3 className="font-heading text-lg text-primary border-b border-gray-100 pb-4">Shipping Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-body text-gray-500 tracking-wider uppercase mb-2">Full Name *</label>
                    <input type="text" name="shippingName" value={form.shippingName} onChange={handleChange} required className="w-full border border-gray-200 px-4 py-3 font-body text-sm focus:border-accent focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-body text-gray-500 tracking-wider uppercase mb-2">Email *</label>
                    <input type="email" name="shippingEmail" value={form.shippingEmail} onChange={handleChange} required className="w-full border border-gray-200 px-4 py-3 font-body text-sm focus:border-accent focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-body text-gray-500 tracking-wider uppercase mb-2">Phone *</label>
                    <input type="tel" name="shippingPhone" value={form.shippingPhone} onChange={handleChange} required placeholder="+92 3XX XXXXXXX" className="w-full border border-gray-200 px-4 py-3 font-body text-sm focus:border-accent focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-body text-gray-500 tracking-wider uppercase mb-2">City *</label>
                    <input type="text" name="shippingCity" value={form.shippingCity} onChange={handleChange} required placeholder="Lahore" className="w-full border border-gray-200 px-4 py-3 font-body text-sm focus:border-accent focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-body text-gray-500 tracking-wider uppercase mb-2">Full Address *</label>
                  <input type="text" name="shippingAddress" value={form.shippingAddress} onChange={handleChange} required placeholder="House #, Street, Area" className="w-full border border-gray-200 px-4 py-3 font-body text-sm focus:border-accent focus:outline-none" />
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white border border-gray-100 p-6 space-y-4">
                <h3 className="font-heading text-lg text-primary border-b border-gray-100 pb-4">Payment Method</h3>
                {["COD", "JazzCash", "EasyPaisa", "Bank Transfer"].map((method) => (
                  <label key={method} className={`flex items-center space-x-3 cursor-pointer group py-2 px-3 border rounded transition-colors ${
                    form.paymentMethod === method ? "border-accent bg-accent/5" : "border-transparent hover:bg-gray-50"
                  }`}>
                    <input type="radio" name="paymentMethod" value={method} checked={form.paymentMethod === method} onChange={handleChange} className="w-4 h-4 border-gray-300 text-accent focus:ring-accent" />
                    <span className="font-body text-sm text-gray-600 group-hover:text-primary transition-colors">
                      {method === "COD" ? "💵 Cash on Delivery" : method === "JazzCash" ? "📱 JazzCash" : method === "EasyPaisa" ? "📱 EasyPaisa" : "🏦 Bank Transfer"}
                    </span>
                  </label>
                ))}

                {/* Payment Instructions for non-COD methods */}
                {form.paymentMethod !== "COD" && (
                  <div className="mt-4 space-y-4">
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded">
                      <p className="font-body text-sm font-medium text-amber-800 mb-2">📋 Payment Instructions</p>
                      {form.paymentMethod === "JazzCash" && (
                        <div className="font-body text-sm text-amber-700 space-y-1">
                          <p>Send <strong>PKR {total.toLocaleString()}</strong> to:</p>
                          <p className="font-medium text-lg">JazzCash: 0334-7092152</p>
                          <p className="text-xs text-amber-600">Account Name: Aamir Fabrics</p>
                        </div>
                      )}
                      {form.paymentMethod === "EasyPaisa" && (
                        <div className="font-body text-sm text-amber-700 space-y-1">
                          <p>Send <strong>PKR {total.toLocaleString()}</strong> to:</p>
                          <p className="font-medium text-lg">EasyPaisa: 0334-7092152</p>
                          <p className="text-xs text-amber-600">Account Name: Aamir Fabrics</p>
                        </div>
                      )}
                      {form.paymentMethod === "Bank Transfer" && (
                        <div className="font-body text-sm text-amber-700 space-y-1">
                          <p>Transfer <strong>PKR {total.toLocaleString()}</strong> to:</p>
                          <p className="font-medium">Bank: Meezan Bank</p>
                          <p className="font-medium">Account: XXXX-XXXXXXXX</p>
                          <p className="font-medium">IBAN: PK00XXXX0000000000000</p>
                          <p className="text-xs text-amber-600">Account Title: Aamir Fabrics</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-body text-gray-500 tracking-wider uppercase mb-2">Transaction ID / Reference Number <span className="text-gray-300">(optional)</span></label>
                      <input type="text" name="transactionId" value={form.transactionId} onChange={handleChange} placeholder="e.g. TRX123456789" className="w-full border border-gray-200 px-4 py-3 font-body text-sm focus:border-accent focus:outline-none" />
                    </div>

                    <p className="font-body text-xs text-gray-400">
                      💡 You can also send the payment screenshot via WhatsApp after placing the order. Your order will be confirmed once payment is verified.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-100 p-6 sticky top-24 space-y-4">
                <h3 className="font-heading text-lg text-primary border-b border-gray-100 pb-4">Order Summary</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-3">
                      <div className="relative w-14 h-16 bg-gray-100 flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-xs text-primary truncate">{item.name}</p>
                        <p className="font-body text-xs text-gray-400">{item.size} · Qty: {item.quantity}</p>
                        <p className="font-body text-xs font-semibold">PKR {(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-3 space-y-2">
                  <div className="flex justify-between font-body text-sm"><span className="text-gray-500">Subtotal</span><span>PKR {totalPrice.toLocaleString()}</span></div>
                  <div className="flex justify-between font-body text-sm"><span className="text-gray-500">Shipping</span><span>{shipping === 0 ? "Free" : `PKR ${shipping}`}</span></div>
                  <div className="flex justify-between font-heading text-lg pt-2 border-t border-gray-100"><span>Total</span><span>PKR {total.toLocaleString()}</span></div>
                </div>
                <button type="submit" disabled={loading || items.length === 0} className="w-full py-3 bg-accent text-white font-body text-sm tracking-[0.15em] uppercase hover:bg-accent/90 transition-colors disabled:opacity-50">
                  {loading ? "Placing Order..." : "Place Order"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
