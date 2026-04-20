"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Breadcrumb from "@/components/Breadcrumb";
import { useUI } from "@/contexts/UIContext";

export default function AccountSettingsPage() {
  const { data: session, status } = useSession();
  const { setIsAuthOpen, setAuthTab } = useUI();
  const [message] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") { setAuthTab("login"); setIsAuthOpen(true); }
  }, [status, setAuthTab, setIsAuthOpen]);

  if (status === "loading") return <div className="pt-20 min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>;
  if (!session) return <div className="pt-20 min-h-screen flex items-center justify-center"><p className="font-body text-gray-400">Please sign in.</p></div>;

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={[{ label: "My Account", href: "/account" }, { label: "Settings" }]} />
        <h1 className="font-heading text-3xl text-primary mt-4 mb-8">Account Settings</h1>

        {message && <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-600 text-sm font-body rounded">{message}</div>}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Profile Info */}
          <div className="bg-white border border-gray-100 p-6 space-y-4">
            <h3 className="font-heading text-lg text-primary border-b border-gray-100 pb-4">Profile Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-body text-gray-500 tracking-wider uppercase mb-2">Name</label>
                <input type="text" defaultValue={session.user?.name || ""} disabled className="w-full border border-gray-200 px-4 py-3 font-body text-sm bg-gray-50 text-gray-500" />
              </div>
              <div>
                <label className="block text-xs font-body text-gray-500 tracking-wider uppercase mb-2">Email</label>
                <input type="email" defaultValue={session.user?.email || ""} disabled className="w-full border border-gray-200 px-4 py-3 font-body text-sm bg-gray-50 text-gray-500" />
              </div>
            </div>
            <p className="text-xs font-body text-gray-400">Contact support to update your profile information.</p>
          </div>

          {/* Account Info */}
          <div className="bg-white border border-gray-100 p-6 space-y-4">
            <h3 className="font-heading text-lg text-primary border-b border-gray-100 pb-4">Account Details</h3>
            <div className="flex items-center justify-between py-3 border-b border-gray-50">
              <div>
                <p className="font-body text-sm font-medium text-primary">Account Type</p>
                <p className="font-body text-xs text-gray-400 mt-1">{session.user?.role || "CUSTOMER"}</p>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-50">
              <div>
                <p className="font-body text-sm font-medium text-primary">Password</p>
                <p className="font-body text-xs text-gray-400 mt-1">••••••••</p>
              </div>
              <button className="text-xs text-accent font-body hover:underline tracking-wider uppercase">Change</button>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white border border-gray-100 p-6 space-y-4">
            <h3 className="font-heading text-lg text-primary border-b border-gray-100 pb-4">Preferences</h3>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 border-gray-300 rounded text-accent focus:ring-accent" />
              <span className="font-body text-sm text-gray-600">Email me about new arrivals and promotions</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 border-gray-300 rounded text-accent focus:ring-accent" />
              <span className="font-body text-sm text-gray-600">Send order status notifications via SMS</span>
            </label>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
