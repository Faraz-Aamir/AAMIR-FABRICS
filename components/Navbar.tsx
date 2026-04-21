"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/contexts/CartContext";
import { useUI } from "@/contexts/UIContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdown, setAccountDropdown] = useState(false);
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const { totalItems, setIsCartOpen } = useCart();
  const { setIsSearchOpen, setIsAuthOpen, setAuthTab } = useUI();
  const pathname = usePathname();

  // Don't use transparent navbar on admin pages
  const isHomePage = pathname === "/";
  const isAdminPage = pathname.startsWith("/admin");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close account dropdown when clicking/tapping outside (works on mobile)
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(e.target as Node)) {
        setAccountDropdown(false);
      }
    };
    if (accountDropdown) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("touchstart", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [accountDropdown]);

  if (isAdminPage) return null;

  const navLinks = [
    { name: "Men", href: "/men" },
    { name: "Women", href: "/women" },
    { name: "Kids", href: "/kids" },
    { name: "New Arrivals", href: "/products?newArrivals=true" },
    { name: "Sale", href: "/sale" },
  ];

  const isTransparent = isHomePage && !scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isTransparent
          ? "bg-gradient-to-b from-black/40 via-black/15 to-transparent"
          : "bg-primary shadow-lg"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="font-heading text-xl md:text-2xl text-white tracking-wide">
              Aamir Fabrics
            </h1>
            <p className="text-accent text-[10px] tracking-[0.3em] uppercase font-body -mt-1">
              Premium Fabrics
            </p>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const hrefPath = link.href.split('?')[0];
              const hrefQuery = link.href.includes('?') ? link.href.split('?')[1] : null;
              const isActive = hrefQuery
                ? pathname === hrefPath && typeof window !== 'undefined' && window.location.search.includes(hrefQuery.split('=')[1])
                : (pathname === link.href || (link.href !== '/' && pathname.startsWith(hrefPath)));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`font-body text-xs tracking-[0.2em] uppercase transition-colors duration-300 ${
                    isActive ? "text-accent" : "text-white hover:text-accent"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-white hover:text-accent transition-all duration-300 hover:scale-110"
              aria-label="Search"
            >
              <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Account */}
            <div className="relative" ref={accountDropdownRef}>
              {session ? (
                <>
                  <button
                    onClick={() => setAccountDropdown(!accountDropdown)}
                    className="text-white hover:text-accent transition-all duration-300 hover:scale-110"
                    aria-label="Account"
                  >
                    <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>
                  <AnimatePresence>
                    {accountDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-white shadow-xl border border-gray-100 py-2 z-50"
                      >
                        <p className="px-4 py-2 text-xs text-gray-400 font-body border-b border-gray-50">
                          Hi, {session.user?.name}
                        </p>
                        <Link href="/account" className="block px-4 py-3 text-sm font-body text-gray-700 hover:text-accent hover:bg-gray-50 transition-colors" onClick={() => setAccountDropdown(false)}>
                          Dashboard
                        </Link>
                        <Link href="/account/orders" className="block px-4 py-3 text-sm font-body text-gray-700 hover:text-accent hover:bg-gray-50 transition-colors" onClick={() => setAccountDropdown(false)}>
                          My Orders
                        </Link>
                        <Link href="/wishlist" className="block px-4 py-3 text-sm font-body text-gray-700 hover:text-accent hover:bg-gray-50 transition-colors" onClick={() => setAccountDropdown(false)}>
                          Wishlist
                        </Link>
                        <Link href="/account/settings" className="block px-4 py-3 text-sm font-body text-gray-700 hover:text-accent hover:bg-gray-50 transition-colors" onClick={() => setAccountDropdown(false)}>
                          Settings
                        </Link>
                        {session.user?.role === "ADMIN" && (
                          <Link href="/admin" className="block px-4 py-3 text-sm font-body text-accent hover:bg-accent/5 transition-colors" onClick={() => setAccountDropdown(false)}>
                            Admin Panel
                          </Link>
                        )}
                        <hr className="my-1 border-gray-50" />
                        <button
                          onClick={() => { signOut(); setAccountDropdown(false); }}
                          className="block w-full text-left px-4 py-3 text-sm font-body text-red-500 hover:bg-red-50 transition-colors"
                        >
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <button
                  onClick={() => { setAuthTab("login"); setIsAuthOpen(true); }}
                  className="text-white hover:text-accent transition-all duration-300 hover:scale-110"
                  aria-label="Sign In"
                >
                  <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              )}
            </div>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="text-white hover:text-accent transition-all duration-300 hover:scale-110 relative"
              aria-label="Cart"
            >
              <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-accent text-white text-[9px] font-body rounded-full flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => { setMobileMenuOpen(!mobileMenuOpen); setAccountDropdown(false); }}
              className="md:hidden text-white hover:text-accent transition-all duration-300 p-1"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-primary border-t border-gray-800 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block font-body text-sm tracking-[0.15em] uppercase text-gray-300 hover:text-accent transition-colors py-2"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
