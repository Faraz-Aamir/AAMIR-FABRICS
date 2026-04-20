import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import FeaturedBrands from "@/components/FeaturedBrands";
import NewArrivals from "@/components/NewArrivals";
import BestSellers from "@/components/BestSellers";
import FabricCollections from "@/components/FabricCollections";
import Newsletter from "@/components/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedBrands />
      <NewArrivals />
      <BestSellers />
      <FabricCollections />
      <Newsletter />
    </>
  );
}
