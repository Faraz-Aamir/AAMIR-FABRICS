"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useUI } from "@/contexts/UIContext";
import Breadcrumb from "@/components/Breadcrumb";

export default function AccountDashboard() {
  const { data: session, status } = useSession();
  const { setIsAuthOpen, setAuthTab } = useUI();
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      setAuthTab("login");
      setIsAuthOpen(true);
    }
  }, [status, setAuthTab, setIsAuthOpen]);

  useEffect(() => {
    if (session) {
      fetch("/api/orders").then(r => r.json()).then(data => {
        if (Array.isArray(data)) setRecentOrders(data.slice(0, 3));
      }).catch(() => {});
    }
  }, [session]);

  if (status === "loading") return <div className="pt-20 min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>;
  if (!session) return <div className="pt-20 min-h-screen flex items-center justify-center"><p className="font-body text-gray-400">Please sign in to view your account.</p></div>;

  const statusColor: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    PROCESSING: "bg-blue-100 text-blue-700",
    SHIPPED: "bg-purple-100 text-purple-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  const quickLinks = [
    { title: "My Orders", desc: "Track and manage orders", href: "/account/orders", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { title: "Wishlist", desc: "Your saved products", href: "/wishlist", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
    { title: "Settings", desc: "Manage your profile", href: "/account/settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
    { title: "Shop", desc: "Browse collections", href: "/products", icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" },
  ];

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: "My Account" }]} />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          <div className="bg-primary text-white p-8 mb-8">
            <h1 className="font-heading text-2xl md:text-3xl mb-1">Welcome back, {session.user?.name}</h1>
            <p className="font-body text-sm text-gray-400">{session.user?.email}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {quickLinks.map((link) => (
              <Link key={link.title} href={link.href} className="bg-white border border-gray-100 p-5 hover:border-accent hover:shadow-md transition-all duration-300 group">
                <svg className="w-6 h-6 text-gray-300 group-hover:text-accent transition-colors mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={link.icon} />
                </svg>
                <h3 className="font-body text-sm font-medium text-primary">{link.title}</h3>
                <p className="font-body text-xs text-gray-400 mt-1">{link.desc}</p>
              </Link>
            ))}
          </div>

          {recentOrders.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-xl text-primary">Recent Orders</h2>
                <Link href="/account/orders" className="text-accent text-sm font-body hover:underline">View All</Link>
              </div>
              <div className="space-y-3">
                {recentOrders.map((order: any) => (
                  <div key={order.id} className="bg-white border border-gray-100 p-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-body text-xs text-gray-400">Order #{order.id.slice(-8)}</p>
                      <p className="font-body text-sm font-medium">PKR {order.total.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 text-xs font-body rounded-full ${statusColor[order.status] || "bg-gray-100 text-gray-600"}`}>{order.status}</span>
                      <span className="text-xs font-body text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
