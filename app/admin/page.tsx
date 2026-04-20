"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import AdminHeader from "@/components/AdminHeader";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, customers: 0, lowStock: 0, outOfStock: 0, pending: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);

  useEffect(() => {
    if (session && ["ADMIN", "STAFF"].includes(session.user?.role)) {
      // Products
      fetch("/api/products?limit=100").then(r => r.json()).then(data => {
        const products = data.products || [];
        setStats(prev => ({
          ...prev,
          products: data.pagination?.total || products.length,
          lowStock: products.filter((p: any) => p.stockQuantity > 0 && p.stockQuantity <= 5).length,
          outOfStock: products.filter((p: any) => p.isOutOfStock).length,
        }));
        setTopProducts(products.filter((p: any) => p.isBestSeller).slice(0, 5));
      });
      // Orders
      fetch("/api/orders").then(r => r.json()).then(data => {
        if (Array.isArray(data)) {
          setRecentOrders(data.slice(0, 5));
          setStats(prev => ({
            ...prev,
            orders: data.length,
            revenue: data.reduce((s: number, o: any) => s + o.total, 0),
            pending: data.filter((o: any) => o.status === "PENDING").length,
          }));
        }
      });
      // Customers
      fetch("/api/customers").then(r => r.json()).then(data => {
        if (Array.isArray(data)) setStats(prev => ({ ...prev, customers: data.length }));
      });
    }
  }, [session]);

  if (status === "loading") return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>;
  if (!session) return null;

  const statusColor: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700", PROCESSING: "bg-blue-100 text-blue-700",
    SHIPPED: "bg-purple-100 text-purple-700", DELIVERED: "bg-green-100 text-green-700",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <div className="p-6 max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          {[
            { label: "Products", value: stats.products, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Total Orders", value: stats.orders, color: "text-green-600", bg: "bg-green-50" },
            { label: "Revenue", value: `PKR ${(stats.revenue / 1000).toFixed(0)}k`, color: "text-accent", bg: "bg-amber-50" },
            { label: "Customers", value: stats.customers, color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Pending", value: stats.pending, color: "text-yellow-600", bg: "bg-yellow-50" },
            { label: "Low Stock", value: stats.lowStock, color: "text-orange-600", bg: "bg-orange-50" },
            { label: "Out of Stock", value: stats.outOfStock, color: "text-red-600", bg: "bg-red-50" },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.bg} p-4 border border-gray-100`}>
              <p className="font-body text-[10px] text-gray-500 tracking-wider uppercase mb-1">{stat.label}</p>
              <p className={`font-heading text-xl ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { title: "Manage Products", desc: "Add, edit, or remove products", href: "/admin/products", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
            { title: "Manage Orders", desc: "View and update statuses", href: "/admin/orders", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
            { title: "Customers", desc: "View customer list", href: "/admin/customers", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
            { title: "View Store", desc: "See the live storefront", href: "/", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
          ].map((item) => (
            <Link key={item.title} href={item.href} className="bg-white border border-gray-100 p-5 hover:border-accent transition-colors flex items-center space-x-4">
              <div className="w-10 h-10 bg-accent/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} /></svg>
              </div>
              <div><h3 className="font-body text-sm font-medium">{item.title}</h3><p className="font-body text-xs text-gray-400">{item.desc}</p></div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-lg">Recent Orders</h2>
              <Link href="/admin/orders" className="text-accent text-xs font-body hover:underline">View All</Link>
            </div>
            {recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-50">
                    <div>
                      <p className="font-body text-sm font-medium">#{order.id.slice(-8)}</p>
                      <p className="font-body text-xs text-gray-400">{order.user?.name || order.shippingName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-body text-sm font-medium">PKR {order.total.toLocaleString()}</p>
                      <span className={`px-2 py-0.5 text-[10px] font-body rounded-full ${statusColor[order.status] || "bg-gray-100"}`}>{order.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-body text-sm text-gray-400 text-center py-4">No orders yet</p>
            )}
          </div>

          {/* Top Products */}
          <div className="bg-white border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-lg">Best Sellers</h2>
              <Link href="/admin/products" className="text-accent text-xs font-body hover:underline">View All</Link>
            </div>
            {topProducts.length > 0 ? (
              <div className="space-y-3">
                {topProducts.map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50">
                    <div>
                      <p className="font-body text-sm font-medium truncate max-w-[200px]">{p.name}</p>
                      <p className="font-body text-xs text-gray-400">{p.brand} · {p.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-body text-sm font-medium">PKR {p.price.toLocaleString()}</p>
                      <p className={`font-body text-xs ${p.stockQuantity <= 5 ? "text-red-500" : "text-gray-400"}`}>{p.stockQuantity} in stock</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-body text-sm text-gray-400 text-center py-4">No best sellers marked</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
