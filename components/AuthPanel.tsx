"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useUI } from "@/contexts/UIContext";
import { useRouter } from "next/navigation";

export default function AuthPanel() {
  const { isAuthOpen, setIsAuthOpen, authTab, setAuthTab } = useUI();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPhone, setRegPhone] = useState("");

  const resetForms = () => {
    setLoginEmail(""); setLoginPassword("");
    setRegName(""); setRegEmail(""); setRegPassword(""); setRegPhone("");
    setError(""); setSuccess("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      redirect: false,
      email: loginEmail,
      password: loginPassword,
    });
    setLoading(false);
    if (result?.error) {
      setError(result.error);
    } else {
      resetForms();
      setIsAuthOpen(false);
      router.refresh();
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPassword,
          phone: regPhone,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }
      // Auto-login after registration
      const loginResult = await signIn("credentials", {
        redirect: false,
        email: regEmail,
        password: regPassword,
      });
      setLoading(false);
      if (loginResult?.error) {
        setSuccess("Account created! Please log in.");
        setAuthTab("login");
      } else {
        resetForms();
        setIsAuthOpen(false);
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isAuthOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setIsAuthOpen(false); resetForms(); }}
            className="fixed inset-0 bg-black/50 z-[60]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-heading text-xl text-primary">My Account</h2>
              <button
                onClick={() => { setIsAuthOpen(false); resetForms(); }}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => { setAuthTab("login"); setError(""); }}
                className={`flex-1 py-3 text-sm font-body tracking-[0.15em] uppercase transition-colors ${
                  authTab === "login"
                    ? "text-accent border-b-2 border-accent"
                    : "text-gray-400 hover:text-primary"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setAuthTab("register"); setError(""); }}
                className={`flex-1 py-3 text-sm font-body tracking-[0.15em] uppercase transition-colors ${
                  authTab === "register"
                    ? "text-accent border-b-2 border-accent"
                    : "text-gray-400 hover:text-primary"
                }`}
              >
                Register
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm font-body rounded">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 text-sm font-body rounded">
                  {success}
                </div>
              )}

              {authTab === "login" ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-body text-gray-500 tracking-wider uppercase mb-2">Email</label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      className="w-full border border-gray-200 px-4 py-3 font-body text-sm focus:border-accent focus:outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-body text-gray-500 tracking-wider uppercase mb-2">Password</label>
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="w-full border border-gray-200 px-4 py-3 font-body text-sm focus:border-accent focus:outline-none transition-colors"
                      placeholder="••••••••"
                    />
                    <p className="text-right mt-1">
                      <button
                        type="button"
                        onClick={() => setError("To reset your password, please contact us on WhatsApp at +92 300 1234567")}
                        className="text-xs font-body text-accent hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-accent text-white font-body text-sm tracking-[0.15em] uppercase hover:bg-accent/90 transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </button>
                  <p className="text-center text-xs text-gray-400 font-body">
                    Don&apos;t have an account?{" "}
                    <button type="button" onClick={() => setAuthTab("register")} className="text-accent hover:underline">
                      Register
                    </button>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-xs font-body text-gray-500 tracking-wider uppercase mb-2">Full Name</label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      required
                      className="w-full border border-gray-200 px-4 py-3 font-body text-sm focus:border-accent focus:outline-none transition-colors"
                      placeholder="Ahmed Khan"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-body text-gray-500 tracking-wider uppercase mb-2">Email</label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                      className="w-full border border-gray-200 px-4 py-3 font-body text-sm focus:border-accent focus:outline-none transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-body text-gray-500 tracking-wider uppercase mb-2">Phone</label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full border border-gray-200 px-4 py-3 font-body text-sm focus:border-accent focus:outline-none transition-colors"
                      placeholder="+92 3XX XXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-body text-gray-500 tracking-wider uppercase mb-2">Password</label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full border border-gray-200 px-4 py-3 font-body text-sm focus:border-accent focus:outline-none transition-colors"
                      placeholder="Min 6 characters"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-accent text-white font-body text-sm tracking-[0.15em] uppercase hover:bg-accent/90 transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </button>
                  <p className="text-center text-xs text-gray-400 font-body">
                    Already have an account?{" "}
                    <button type="button" onClick={() => setAuthTab("login")} className="text-accent hover:underline">
                      Sign In
                    </button>
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
