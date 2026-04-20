import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || "https://aamirfabrics.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/account/", "/checkout", "/order-confirmation"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
