import CollectionPage from "@/components/CollectionPage";

export const metadata = {
  title: "All Products | Aamir Fabrics",
  description: "Browse our complete collection of premium unstitched fabrics. Filter by brand, price, fabric type, and more.",
};

export default function ProductsPage() {
  return (
    <CollectionPage
      category="ALL"
      title="All Products"
      subtitle="Our Complete Collection"
    />
  );
}
