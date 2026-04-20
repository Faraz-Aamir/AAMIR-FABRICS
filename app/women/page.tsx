import CollectionPage from "@/components/CollectionPage";

export const metadata = {
  title: "Women's Collection | Aamir Fabrics",
  description: "Luxury unstitched fabrics for women. Shop Lawn, Chiffon, Silk, Organza, and more from premium Pakistani brands.",
};

export default function WomenPage() {
  return (
    <CollectionPage
      category="WOMEN"
      title="Women's Collection"
      subtitle="Elegance In Every Thread"
      bgImage="/images/category-women.png"
    />
  );
}
