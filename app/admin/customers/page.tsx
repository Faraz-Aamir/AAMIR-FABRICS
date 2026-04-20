"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import AdminHeader from "@/components/AdminHeader";

export default function AdminCustomersPage() {
  const { data: session, status } = useSession();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (session) {
      fetch("/api/customers").then(r => r.json()).then(data => {
        if (Array.isArray(data)) setCustomers(data);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [session]);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.city || "").toLowerCase().includes(search.toLowerCase())
  );

  if (status === "loading" || loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>;
  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <h2 className="font-heading text-2xl">Customers ({filtered.length})</h2>
          <input type="text" placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)}
            className="md:w-64 border border-gray-200 px-4 py-2 text-sm font-body focus:border-accent focus:outline-none" />
        </div>

        <div className="bg-white border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left p-3 font-body text-xs text-gray-400 tracking-wider uppercase">Customer</th>
                <th className="text-left p-3 font-body text-xs text-gray-400 tracking-wider uppercase">Phone</th>
                <th className="text-left p-3 font-body text-xs text-gray-400 tracking-wider uppercase">City</th>
                <th className="text-left p-3 font-body text-xs text-gray-400 tracking-wider uppercase">Orders</th>
                <th className="text-left p-3 font-body text-xs text-gray-400 tracking-wider uppercase">Joined</th>
              </tr></thead>
              <tbody>
                {filtered.map((c: any) => (
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-3">
                      <p className="font-body text-sm font-medium text-primary">{c.name}</p>
                      <p className="font-body text-xs text-gray-400">{c.email}</p>
                    </td>
                    <td className="p-3 font-body text-sm text-gray-600">{c.phone || "—"}</td>
                    <td className="p-3 font-body text-sm text-gray-600">{c.city || "—"}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 text-xs font-body bg-accent/10 text-accent rounded-full">{c.orderCount} orders</span>
                    </td>
                    <td className="p-3 font-body text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <div className="p-8 text-center font-body text-gray-400">No customers found</div>}
        </div>
      </div>
    </div>
  );
}
