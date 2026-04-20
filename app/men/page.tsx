import CollectionPage from "@/components/CollectionPage";

export const metadata = {
  title: "Men's Collection | Aamir Fabrics",
  description: "Premium unstitched fabrics for men. Shop Wash & Wear, Cotton, Khaddar, and more from top Pakistani brands.",
};

export default function MenPage() {
  return (
    <CollectionPage
      category="MEN"
      title="Men's Collection"
      subtitle="Premium Fabrics For The Modern Man"
      bgImage="/images/category-men.png"
    />
  );
}
