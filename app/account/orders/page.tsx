"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Breadcrumb from "@/components/Breadcrumb";
import { useUI } from "@/contexts/UIContext";

export default function OrderHistoryPage() {
  const { data: session, status } = useSession();
  const { setIsAuthOpen, setAuthTab } = useUI();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") { setAuthTab("login"); setIsAuthOpen(true); }
  }, [status, setAuthTab, setIsAuthOpen]);

  useEffect(() => {
    if (session) {
      fetch("/api/orders").then(r => r.json()).then(data => {
        if (Array.isArray(data)) setOrders(data);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [session]);

  const statusColor: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700", PROCESSING: "bg-blue-100 text-blue-700",
    SHIPPED: "bg-purple-100 text-purple-700", DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  if (status === "loading" || loading) return <div className="pt-20 min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>;
  if (!session) return <div className="pt-20 min-h-screen flex items-center justify-center"><p className="font-body text-gray-400">Please sign in.</p></div>;

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: "My Account", href: "/account" }, { label: "Orders" }]} />
        <h1 className="font-heading text-3xl text-primary mt-4 mb-8">Order History</h1>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-body text-gray-400 mb-4">You haven&apos;t placed any orders yet.</p>
            <a href="/products" className="text-accent font-body text-sm hover:underline">Start Shopping →</a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <motion.div key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-gray-100 overflow-hidden">
                <div className="p-4 md:p-6 flex flex-wrap items-center justify-between gap-4 border-b border-gray-50">
                  <div className="space-y-1">
                    <p className="font-body text-xs text-gray-400">Order #{order.id.slice(-8)}</p>
                    <p className="font-body text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" })}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 text-xs font-body rounded-full ${statusColor[order.status] || "bg-gray-100"}`}>{order.status}</span>
                    <span className="font-heading text-lg">PKR {order.total.toLocaleString()}</span>
                  </div>
                </div>
                <div className="p-4 md:p-6 space-y-3">
                  {order.items?.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between text-sm font-body">
                      <div>
                        <span className="text-primary">{item.product?.name || "Product"}</span>
                        {item.size && <span className="text-gray-400 ml-2">· {item.size}</span>}
                        <span className="text-gray-400 ml-2">× {item.quantity}</span>
                      </div>
                      <span className="font-medium">PKR {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="px-4 md:px-6 py-3 bg-gray-50 text-xs font-body text-gray-400">
                  {order.paymentMethod === "COD" ? "Cash on Delivery" : order.paymentMethod} · {order.shippingCity}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
