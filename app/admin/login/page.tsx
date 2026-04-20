"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in as admin, redirect
  if (session && ["ADMIN", "STAFF"].includes(session.user?.role)) {
    router.push("/admin");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", { redirect: false, email, password });
    setLoading(false);
    if (result?.error) {
      setError(result.error);
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-heading text-2xl text-white">Aamir Fabrics</h1>
          <p className="text-accent text-xs tracking-[0.3em] uppercase font-body mt-1">Admin Panel</p>
        </div>

        <div className="bg-white p-8">
          <h2 className="font-heading text-xl text-primary mb-6 text-center">Staff Login</h2>

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm font-body rounded">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-body text-gray-500 tracking-wider uppercase mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border border-gray-200 px-4 py-3 font-body text-sm focus:border-accent focus:outline-none" placeholder="admin@aamirfabrics.com" />
            </div>
            <div>
              <label className="block text-xs font-body text-gray-500 tracking-wider uppercase mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full border border-gray-200 px-4 py-3 font-body text-sm focus:border-accent focus:outline-none" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-accent text-white font-body text-sm tracking-[0.15em] uppercase hover:bg-accent/90 transition-colors disabled:opacity-50">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
