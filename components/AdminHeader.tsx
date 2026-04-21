"use client";

import { useState } from "react";
import Link from "next/link";

import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";

export default function AdminHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navLinks = [
    { name: "Dashboard", href: "/admin" },
    { name: "Products", href: "/admin/products" },
    { name: "Orders", href: "/admin/orders" },
    { name: "Customers", href: "/admin/customers" },
    { name: "Sale", href: "/admin/sale" },
    { name: "View Store", href: "/" },
  ];

  const isActive = (link: { href: string }) =>
    link.href === "/admin"
      ? pathname === "/admin"
      : link.href !== "/" && pathname.startsWith(link.href);

  return (
    <header className="bg-primary text-white sticky top-0 z-50 shadow-md">
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo — clicks to home */}
        <Link href="/" className="flex-shrink-0 group">
          <h1 className="font-heading text-lg sm:text-xl group-hover:text-accent transition-colors duration-300">Aamir Fabrics</h1>
          <p className="text-accent text-[9px] sm:text-[10px] tracking-[0.3em] uppercase font-body -mt-0.5">
            Admin Dashboard
          </p>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex items-center space-x-5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`font-body text-xs tracking-wider uppercase transition-colors ${
                  isActive(link) ? "text-accent" : "text-gray-400 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="flex items-center space-x-3 border-l border-gray-700 pl-5">
            <span className="font-body text-xs text-gray-400 hidden sm:inline">
              {session?.user?.name}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="font-body text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile: user name + hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          <span className="font-body text-xs text-gray-400 max-w-[100px] truncate">
            {session?.user?.name}
          </span>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="text-white p-1"
            aria-label="Toggle navigation"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileNavOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden border-t border-gray-700"
          >
            <nav className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`block py-2.5 px-3 font-body text-sm tracking-wider uppercase transition-colors rounded ${
                    isActive(link)
                      ? "text-accent bg-white/5"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-2 border-t border-gray-700 mt-2">
                <button
                  onClick={() => signOut({ callbackUrl: "/admin/login" })}
                  className="block w-full text-left py-2.5 px-3 font-body text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  Logout
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
