import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!product) return { title: "Product Not Found | Aamir Fabrics" };

  const images = product.images ? product.images.split(",").map(s => s.trim()).filter(Boolean) : [];
  const firstImage = images[0] || "/favicon.svg";
  const price = product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price;

  return {
    title: `${product.name} | Aamir Fabrics`,
    description: product.description || `Shop ${product.name} by ${product.brand} — premium ${product.fabricType} fabric at PKR ${price.toLocaleString()}. Free delivery over PKR 5,000.`,
    keywords: [product.brand, product.fabricType, product.category, "unstitched fabric", "Pakistan", product.name].filter(Boolean).join(", "),
    openGraph: {
      title: `${product.name} — ${product.brand}`,
      description: product.description || `Premium ${product.fabricType} fabric at PKR ${price.toLocaleString()}`,
      images: [{ url: firstImage, width: 800, height: 1000, alt: product.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Aamir Fabrics`,
      description: product.description || `Premium ${product.fabricType} fabric at PKR ${price.toLocaleString()}`,
      images: [firstImage],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!product) notFound();

  // Get related products (same category, different product)
  const related = await prisma.product.findMany({
    where: {
      category: product.category,
      id: { not: product.id },
    },
    take: 4,
  });

  // Serialize Date fields to strings for client component
  const serializedProduct = {
    ...product,
    discountExpiry: product.discountExpiry ? product.discountExpiry.toISOString() : null,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
  const serializedRelated = related.map(p => ({
    ...p,
    discountExpiry: p.discountExpiry ? p.discountExpiry.toISOString() : null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return <ProductDetailClient product={serializedProduct} relatedProducts={serializedRelated} />;
}
