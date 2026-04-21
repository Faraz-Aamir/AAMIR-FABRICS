"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import AdminHeader from "@/components/AdminHeader";

interface SaleEvent {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  status?: "upcoming" | "active" | "ended";
}

export default function AdminSalePage() {
  const { data: session, status } = useSession();
  const [sale, setSale] = useState<SaleEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const emptyForm = { name: "", description: "", startDate: "", endDate: "" };
  const [form, setForm] = useState(emptyForm);

  const fetchSale = async () => {
    const res = await fetch("/api/sale");
    const data = await res.json();
    setSale(data.sale);
    setLoading(false);
  };

  useEffect(() => { if (session) fetchSale(); }, [session]);

  const showMsg = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/sale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description || null,
          startDate: new Date(form.startDate).toISOString(),
          endDate: new Date(form.endDate).toISOString(),
        }),
      });
      if (res.ok) {
        showMsg("success", "Sale event created successfully!");
        setShowForm(false);
        setForm(emptyForm);
        fetchSale();
      } else {
        const data = await res.json();
        showMsg("error", data.error || "Failed to create sale");
      }
    } catch {
      showMsg("error", "Something went wrong");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!sale || !confirm(`Delete "${sale.name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/sale/${sale.id}`, { method: "DELETE" });
    if (res.ok) {
      showMsg("success", "Sale event deleted.");
      setSale(null);
    } else {
      showMsg("error", "Failed to delete.");
    }
  };

  const handleToggle = async () => {
    if (!sale) return;
    const res = await fetch(`/api/sale/${sale.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !sale.isActive }),
    });
    if (res.ok) {
      showMsg("success", `Sale ${sale.isActive ? "deactivated" : "activated"}.`);
      fetchSale();
    }
  };

  const now = new Date();
  const saleStatus = sale
    ? now >= new Date(sale.endDate)
      ? "ended"
      : now >= new Date(sale.startDate)
      ? "active"
      : "upcoming"
    : null;

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    upcoming: "bg-blue-100 text-blue-700",
    ended: "bg-gray-100 text-gray-500",
  };

  if (status === "loading" || loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <div className="p-4 sm:p-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-heading text-xl sm:text-2xl">Sale Management</h2>
            <p className="font-body text-sm text-gray-400 mt-0.5">
              Create & manage sale events (Eid Sale, Summer Sale, etc.)
            </p>
          </div>
          {!sale && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-accent text-white px-5 py-2 text-sm font-body tracking-wider uppercase hover:bg-accent/90 transition-colors"
            >
              + Create Sale
            </button>
          )}
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-4 px-4 py-3 text-sm font-body ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {message.text}
          </div>
        )}

        {/* ── CREATE FORM ── */}
        {showForm && (
          <div className="bg-white border border-gray-100 p-6 mb-6">
            <h3 className="font-heading text-lg mb-4">Create New Sale Event</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-body text-gray-500 tracking-wider uppercase mb-1">
                  Sale Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eid Sale 2026"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2 text-sm font-body focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-body text-gray-500 tracking-wider uppercase mb-1">
                  Tagline / Description
                  <span className="text-gray-300 normal-case ml-1">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Up to 50% off on selected items"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-gray-200 px-3 py-2 text-sm font-body focus:border-accent focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-body text-gray-500 tracking-wider uppercase mb-1">
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm font-body focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-body text-gray-500 tracking-wider uppercase mb-1">
                    End Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full border border-gray-200 px-3 py-2 text-sm font-body focus:border-accent focus:outline-none"
                  />
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-100 px-4 py-3 text-xs font-body text-amber-700">
                💡 Products appear in the sale only if they have a <strong>Discount Price</strong> set. Go to Products → Edit a product → set Discount Price.
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 bg-accent text-white font-body text-sm tracking-[0.15em] uppercase hover:bg-accent/90 transition-colors disabled:opacity-50"
                >
                  {saving ? "Creating..." : "Create Sale Event"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setForm(emptyForm); }}
                  className="px-6 py-3 border border-gray-200 text-sm font-body hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── CURRENT SALE ── */}
        {sale ? (
          <div className="bg-white border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-heading text-xl">{sale.name}</h3>
                {sale.description && (
                  <p className="font-body text-sm text-gray-400 mt-1">{sale.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                {saleStatus && (
                  <span className={`px-3 py-1 text-xs font-body rounded-full ${statusColors[saleStatus]}`}>
                    {saleStatus === "active" ? "🔴 Live" : saleStatus === "upcoming" ? "⏳ Upcoming" : "✓ Ended"}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-3">
                <p className="font-body text-[10px] text-gray-400 tracking-wider uppercase mb-1">Start Date</p>
                <p className="font-body text-sm font-medium">
                  {new Date(sale.startDate).toLocaleDateString("en-PK", {
                    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="bg-gray-50 p-3">
                <p className="font-body text-[10px] text-gray-400 tracking-wider uppercase mb-1">End Date</p>
                <p className="font-body text-sm font-medium">
                  {new Date(sale.endDate).toLocaleDateString("en-PK", {
                    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={handleToggle}
                className={`px-5 py-2 text-sm font-body tracking-wider uppercase transition-colors ${
                  sale.isActive
                    ? "border border-gray-300 text-gray-600 hover:bg-gray-50"
                    : "bg-accent text-white hover:bg-accent/90"
                }`}
              >
                {sale.isActive ? "Deactivate" : "Activate"}
              </button>
              <a
                href="/sale"
                target="_blank"
                className="px-5 py-2 text-sm font-body tracking-wider uppercase border border-accent text-accent hover:bg-accent/5 transition-colors"
              >
                Preview Sale Page ↗
              </a>
              {session.user?.role === "ADMIN" && (
                <button
                  onClick={handleDelete}
                  className="px-5 py-2 text-sm font-body tracking-wider uppercase text-red-500 border border-red-200 hover:bg-red-50 transition-colors ml-auto"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ) : !showForm ? (
          <div className="bg-white border border-gray-100 p-10 text-center">
            <div className="w-16 h-16 bg-gray-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 className="font-heading text-xl mb-2">No Sale Event</h3>
            <p className="font-body text-sm text-gray-400 mb-6">
              Create a sale event to display a countdown or live sale on the Sale page.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-accent text-white px-8 py-3 text-sm font-body tracking-wider uppercase hover:bg-accent/90 transition-colors"
            >
              + Create Sale Event
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
