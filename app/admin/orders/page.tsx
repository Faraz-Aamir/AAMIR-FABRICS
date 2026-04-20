"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import AdminHeader from "@/components/AdminHeader";

export default function AdminOrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetch("/api/orders").then(r => r.json()).then(data => {
        if (Array.isArray(data)) setOrders(data);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [session]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update status");
      }
    } catch {
      alert("Failed to update order status");
    }
  };

  const updatePaymentStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: newStatus }),
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus: newStatus } : o));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update payment status");
      }
    } catch {
      alert("Failed to update payment status");
    }
  };

  const statusColor: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700", PROCESSING: "bg-blue-100 text-blue-700",
    SHIPPED: "bg-purple-100 text-purple-700", DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  const paymentStatusColor: Record<string, string> = {
    PENDING_PAYMENT: "bg-orange-100 text-orange-700",
    PAID: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
  };

  if (status === "loading" || loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>;
  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <div className="p-6 max-w-7xl mx-auto">
        <h2 className="font-heading text-2xl mb-6">Orders ({orders.length})</h2>

        <div className="bg-white border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left p-3 font-body text-xs text-gray-400 tracking-wider uppercase">Order ID</th>
                <th className="text-left p-3 font-body text-xs text-gray-400 tracking-wider uppercase">Customer</th>
                <th className="text-left p-3 font-body text-xs text-gray-400 tracking-wider uppercase">Items</th>
                <th className="text-left p-3 font-body text-xs text-gray-400 tracking-wider uppercase">Total</th>
                <th className="text-left p-3 font-body text-xs text-gray-400 tracking-wider uppercase">Payment</th>
                <th className="text-left p-3 font-body text-xs text-gray-400 tracking-wider uppercase">Pay Status</th>
                <th className="text-left p-3 font-body text-xs text-gray-400 tracking-wider uppercase">City</th>
                <th className="text-left p-3 font-body text-xs text-gray-400 tracking-wider uppercase">Status</th>
                <th className="text-left p-3 font-body text-xs text-gray-400 tracking-wider uppercase">Date</th>
              </tr></thead>
              <tbody>
                {orders.map((order: any) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-3 font-body text-sm font-medium">
                      <Link href={`/admin/orders/${order.id}`} className="text-accent hover:underline">#{order.id.slice(-8)}</Link>
                    </td>
                    <td className="p-3">
                      <p className="font-body text-sm text-primary">{order.user?.name || order.shippingName}</p>
                      <p className="font-body text-xs text-gray-400">{order.user?.email || order.shippingEmail}</p>
                    </td>
                    <td className="p-3 font-body text-sm text-gray-600">{order.items?.length || 0} items</td>
                    <td className="p-3 font-body text-sm font-medium">PKR {order.total.toLocaleString()}</td>
                    <td className="p-3">
                      <p className="font-body text-xs text-gray-500">{order.paymentMethod}</p>
                      {order.transactionId && (
                        <p className="font-body text-[10px] text-accent mt-0.5" title={order.transactionId}>TRX: {order.transactionId.slice(0, 12)}{order.transactionId.length > 12 ? "..." : ""}</p>
                      )}
                    </td>
                    <td className="p-3">
                      <select
                        value={order.paymentStatus || "PENDING_PAYMENT"}
                        onChange={(e) => updatePaymentStatus(order.id, e.target.value)}
                        className={`px-2 py-1 text-xs font-body rounded-full border-0 cursor-pointer ${paymentStatusColor[order.paymentStatus] || "bg-gray-100"}`}
                      >
                        {["PENDING_PAYMENT", "PAID", "REJECTED"].map(s => (
                          <option key={s} value={s}>{s === "PENDING_PAYMENT" ? "Pending" : s === "PAID" ? "Paid" : "Rejected"}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3 font-body text-sm text-gray-600">{order.shippingCity}</td>
                    <td className="p-3">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={`px-2 py-1 text-xs font-body rounded-full border-0 cursor-pointer ${statusColor[order.status] || "bg-gray-100"}`}
                      >
                        {["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3 font-body text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {orders.length === 0 && <div className="p-8 text-center font-body text-gray-400">No orders yet</div>}
        </div>
      </div>
    </div>
  );
}
