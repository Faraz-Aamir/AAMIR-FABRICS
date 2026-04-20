"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function AdminHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const navLinks = [
    { name: "Dashboard", href: "/admin" },
    { name: "Products", href: "/admin/products" },
    { name: "Orders", href: "/admin/orders" },
    { name: "Customers", href: "/admin/customers" },
    { name: "View Store", href: "/" },
  ];

  return (
    <header className="bg-primary text-white px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="font-heading text-xl">Aamir Fabrics</h1>
        <p className="text-accent text-[10px] tracking-[0.3em] uppercase font-body">Admin Dashboard</p>
      </div>
      <div className="flex items-center space-x-6">
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/admin"
                ? pathname === "/admin"
                : link.href !== "/" && pathname.startsWith(link.href);

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`font-body text-xs tracking-wider uppercase transition-colors ${
                  isActive ? "text-accent" : "text-gray-400 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center space-x-3">
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
    </header>
  );
}
