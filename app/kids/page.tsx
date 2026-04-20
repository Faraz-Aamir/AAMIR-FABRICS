import CollectionPage from "@/components/CollectionPage";

export const metadata = {
  title: "Kids' Collection | Aamir Fabrics",
  description: "Adorable unstitched fabrics for kids. Comfortable cotton, festive kurtas, and more from top brands.",
};

export default function KidsPage() {
  return (
    <CollectionPage
      category="KIDS"
      title="Kids' Collection"
      subtitle="Little Styles, Big Impressions"
      bgImage="/images/category-kids.png"
    />
  );
}
