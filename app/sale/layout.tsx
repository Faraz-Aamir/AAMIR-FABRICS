import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sale | Aamir Fabrics",
  description: "Shop the latest sales at Aamir Fabrics. Exclusive discounts on premium unstitched fabrics — Eid Sale, Summer Sale, Winter Sale and more.",
};

export default function SaleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
