import PageHeader from "@/components/PageHeader";

export const metadata = { title: "About Us | Aamir Fabrics", description: "Learn about Aamir Fabrics — Pakistan's trusted destination for premium unstitched fabrics." };

export default function AboutPage() {
  return (
    <div>
      <PageHeader title="About Us" subtitle="Our Story" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <section className="text-center">
          <h2 className="font-heading text-2xl text-primary mb-4">Our Legacy</h2>
          <div className="w-12 h-0.5 bg-accent mx-auto mb-6" />
          <p className="font-body text-gray-600 leading-relaxed">
            Founded with a passion for premium fabrics, <strong>Aamir Fabrics</strong> has been serving discerning customers
            across Pakistan since its inception. We curate the finest unstitched collections from the country&apos;s most
            prestigious brands, bringing you elegance, quality, and style under one roof.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Premium Quality", desc: "We source only the finest fabrics from established Pakistani brands, ensuring every piece meets our high standards." },
            { title: "Customer First", desc: "Your satisfaction is our priority. From browsing to delivery, we ensure a seamless and delightful experience." },
            { title: "Fast Delivery", desc: "Nationwide delivery with careful packaging. Free shipping on all orders above PKR 5,000." },
          ].map((item) => (
            <div key={item.title} className="text-center p-6 border border-gray-100 bg-white">
              <h3 className="font-heading text-lg text-primary mb-2">{item.title}</h3>
              <p className="font-body text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </section>

        <section className="text-center">
          <h2 className="font-heading text-2xl text-primary mb-4">Our Brands</h2>
          <div className="w-12 h-0.5 bg-accent mx-auto mb-6" />
          <p className="font-body text-gray-600 leading-relaxed mb-6">
            We proudly carry collections from Pakistan&apos;s most beloved fashion houses.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {["Sapphire", "Khaadi", "Gul Ahmed", "Maria B", "Alkaram", "Sana Safinaz", "Nishat Linen", "Junaid Jamshed"].map((brand) => (
              <span key={brand} className="px-4 py-2 border border-gray-200 font-body text-sm text-gray-600 hover:border-accent hover:text-accent transition-colors">{brand}</span>
            ))}
          </div>
        </section>

        <section className="bg-primary text-white p-8 md:p-12 text-center">
          <h2 className="font-heading text-2xl mb-3">Visit Our Store</h2>
          <p className="font-body text-gray-400 text-sm mb-1">Main Market, Lahore, Pakistan</p>
          <p className="font-body text-gray-400 text-sm">Mon - Sat: 10:00 AM - 9:00 PM</p>
        </section>
      </div>
    </div>
  );
}
