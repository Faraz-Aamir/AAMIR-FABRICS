"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Suspense, useState, useEffect } from "react";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setError(true);
      return;
    }

    fetch(`/api/orders/${orderId}`)
      .then(r => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then(data => {
        if (data.id) {
          setOrder(data);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [orderId]);

  // Loading state
  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Invalid or missing order
  if (error || !order) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4 py-16">
          <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="font-heading text-2xl text-primary mb-3">Order Not Found</h1>
          <p className="font-body text-gray-500 mb-6">
            We couldn&apos;t find this order. Please check your order ID or visit your account dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/account/orders" className="px-8 py-3 bg-accent text-white font-body text-sm tracking-[0.15em] uppercase hover:bg-accent/90 transition-colors">
              My Orders
            </Link>
            <Link href="/" className="px-8 py-3 border-2 border-primary text-primary font-body text-sm tracking-[0.15em] uppercase hover:bg-primary hover:text-white transition-colors">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isManualPayment = order.paymentMethod !== "COD";

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg mx-auto text-center px-4 py-16"
      >
        <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="font-heading text-3xl md:text-4xl text-primary mb-3">Order Confirmed!</h1>
        <p className="font-body text-gray-500 mb-6">
          Thank you for shopping with Aamir Fabrics. Your order has been placed successfully.
        </p>

        {orderId && (
          <div className="bg-gray-50 border border-gray-100 p-4 mb-6 inline-block">
            <p className="font-body text-xs text-gray-400 tracking-wider uppercase">Order ID</p>
            <p className="font-body text-sm font-medium text-primary mt-1">{orderId}</p>
          </div>
        )}

        {/* Payment Instructions for non-COD orders */}
        {isManualPayment && (
          <div className="bg-amber-50 border border-amber-200 p-6 mb-6 text-left rounded">
            <p className="font-body text-sm font-medium text-amber-800 mb-3">⚠️ Payment Required</p>
            <div className="font-body text-sm text-amber-700 space-y-2">
              <p>Please send <strong>PKR {order.total?.toLocaleString()}</strong> to complete your order:</p>
              {order.paymentMethod === "JazzCash" && (
                <p className="font-medium text-lg">JazzCash: 0334-7092152</p>
              )}
              {order.paymentMethod === "EasyPaisa" && (
                <p className="font-medium text-lg">EasyPaisa: 0334-7092152</p>
              )}
              {order.paymentMethod === "Bank Transfer" && (
                <div className="space-y-1">
                  <p className="font-medium">Bank: Meezan Bank</p>
                  <p className="font-medium">Account: XXXX-XXXXXXXX</p>
                  <p className="font-medium">IBAN: PK00XXXX0000000000000</p>
                </div>
              )}
              <p className="text-xs text-amber-600">Account Title: Aamir Fabrics</p>
              {order.transactionId && (
                <p className="text-xs text-green-700 bg-green-50 p-2 rounded mt-2">
                  ✅ Transaction ID submitted: <strong>{order.transactionId}</strong>
                </p>
              )}
              <p className="text-xs text-amber-600 mt-2">
                📱 You can also send the payment screenshot via WhatsApp for faster verification.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3 text-left bg-white border border-gray-100 p-6 mb-8">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="font-body text-sm text-gray-600">A confirmation email has been sent to your email address</p>
          </div>
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-body text-sm text-gray-600">
              {isManualPayment
                ? "Your order will be processed once payment is verified"
                : "Estimated delivery: 3-5 business days"
              }
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="font-body text-sm text-gray-600">Track your order in your account dashboard</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/account/orders" className="px-8 py-3 bg-accent text-white font-body text-sm tracking-[0.15em] uppercase hover:bg-accent/90 transition-colors">
            View Orders
          </Link>
          <Link href="/products" className="px-8 py-3 border-2 border-primary text-primary font-body text-sm tracking-[0.15em] uppercase hover:bg-primary hover:text-white transition-colors">
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="pt-20 min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
