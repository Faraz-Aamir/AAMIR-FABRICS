"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AdminHeader from "@/components/AdminHeader";

export default function AdminOrderDetailPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session && params.id) {
      fetch(`/api/orders/${params.id}`)
        .then(r => r.json())
        .then(data => { setOrder(data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [session, params.id]);

  const updateStatus = async (newStatus: string) => {
    const res = await fetch(`/api/orders/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) setOrder((prev: any) => ({ ...prev, status: newStatus }));
  };

  const updatePaymentStatus = async (newStatus: string) => {
    const res = await fetch(`/api/orders/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentStatus: newStatus }),
    });
    if (res.ok) setOrder((prev: any) => ({ ...prev, paymentStatus: newStatus }));
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
  if (!session || !order) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="font-body text-gray-400">Order not found</p></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <div className="p-6 max-w-5xl mx-auto">
        {/* Back link + Order ID */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin/orders" className="font-body text-xs text-accent hover:underline">← Back to Orders</Link>
          <span className="text-gray-300">|</span>
          <h2 className="font-heading text-xl">Order #{order.id.slice(-8)}</h2>
          <span className={`px-2 py-0.5 text-xs font-body rounded-full ${statusColor[order.status] || "bg-gray-100"}`}>{order.status}</span>
          <span className={`px-2 py-0.5 text-xs font-body rounded-full ${paymentStatusColor[order.paymentStatus] || "bg-gray-100"}`}>
            {order.paymentStatus === "PENDING_PAYMENT" ? "Payment Pending" : order.paymentStatus === "PAID" ? "Paid" : order.paymentStatus}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Order Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-gray-100 p-6">
              <h3 className="font-heading text-sm uppercase tracking-wider text-gray-400 mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="flex-1">
                      <p className="font-body text-sm font-medium text-primary">{item.product?.name || "Unknown Product"}</p>
                      <p className="font-body text-xs text-gray-400 mt-1">
                        {item.size && `Size: ${item.size}`} {item.color && `· Color: ${item.color}`}
                      </p>
                      <p className="font-body text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-body text-sm font-medium">PKR {(item.price * item.quantity).toLocaleString()}</p>
                      <p className="font-body text-xs text-gray-400">PKR {item.price.toLocaleString()} each</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="font-heading text-sm">Total</span>
                <span className="font-heading text-lg">PKR {order.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white border border-gray-100 p-6">
              <h3 className="font-heading text-sm uppercase tracking-wider text-gray-400 mb-4">Update Order</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-body text-gray-500 tracking-wider uppercase mb-2">Order Status</label>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(e.target.value)}
                    className="w-full border border-gray-200 px-4 py-2 font-body text-sm focus:border-accent focus:outline-none"
                  >
                    {["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-body text-gray-500 tracking-wider uppercase mb-2">Payment Status</label>
                  <select
                    value={order.paymentStatus || "PENDING_PAYMENT"}
                    onChange={(e) => updatePaymentStatus(e.target.value)}
                    className="w-full border border-gray-200 px-4 py-2 font-body text-sm focus:border-accent focus:outline-none"
                  >
                    {["PENDING_PAYMENT", "PAID", "REJECTED"].map(s => (
                      <option key={s} value={s}>{s === "PENDING_PAYMENT" ? "Pending Payment" : s === "PAID" ? "Paid" : "Rejected"}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Customer & Shipping Info */}
          <div className="space-y-4">
            <div className="bg-white border border-gray-100 p-6">
              <h3 className="font-heading text-sm uppercase tracking-wider text-gray-400 mb-4">Customer</h3>
              <p className="font-body text-sm font-medium text-primary">{order.user?.name || order.shippingName}</p>
              <p className="font-body text-xs text-gray-400 mt-1">{order.user?.email || order.shippingEmail}</p>
              {order.user?.phone && <p className="font-body text-xs text-gray-400 mt-1">{order.user.phone}</p>}
            </div>

            <div className="bg-white border border-gray-100 p-6">
              <h3 className="font-heading text-sm uppercase tracking-wider text-gray-400 mb-4">Shipping Address</h3>
              <p className="font-body text-sm text-gray-700">{order.shippingName}</p>
              <p className="font-body text-xs text-gray-500 mt-1">{order.shippingAddress}</p>
              <p className="font-body text-xs text-gray-500">{order.shippingCity}</p>
              <p className="font-body text-xs text-gray-500 mt-1">{order.shippingPhone}</p>
            </div>

            <div className="bg-white border border-gray-100 p-6">
              <h3 className="font-heading text-sm uppercase tracking-wider text-gray-400 mb-4">Payment</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-body text-xs text-gray-400">Method</span>
                  <span className="font-body text-sm font-medium">{order.paymentMethod}</span>
                </div>
                {order.transactionId && (
                  <div className="flex justify-between">
                    <span className="font-body text-xs text-gray-400">Transaction ID</span>
                    <span className="font-body text-sm font-medium text-accent">{order.transactionId}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="font-body text-xs text-gray-400">Status</span>
                  <span className={`px-2 py-0.5 text-xs font-body rounded-full ${paymentStatusColor[order.paymentStatus] || "bg-gray-100"}`}>
                    {order.paymentStatus === "PENDING_PAYMENT" ? "Pending" : order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 p-6">
              <h3 className="font-heading text-sm uppercase tracking-wider text-gray-400 mb-4">Timeline</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-body text-xs text-gray-400">Ordered</span>
                  <span className="font-body text-xs text-gray-600">{new Date(order.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body text-xs text-gray-400">Last Updated</span>
                  <span className="font-body text-xs text-gray-600">{new Date(order.updatedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
