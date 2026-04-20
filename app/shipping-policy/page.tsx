import PageHeader from "@/components/PageHeader";

export const metadata = { title: "Shipping Policy | Aamir Fabrics" };

export default function ShippingPolicyPage() {
  return (
    <div>
      <PageHeader title="Shipping & Delivery" subtitle="Policy" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-body text-gray-600 text-sm leading-relaxed space-y-8">
        <section>
          <h2 className="font-heading text-xl text-primary mb-3">Delivery Areas</h2>
          <p>We deliver nationwide across Pakistan. Orders are dispatched from our warehouse in Lahore and typically arrive within the estimated delivery timeframes.</p>
        </section>
        <section>
          <h2 className="font-heading text-xl text-primary mb-3">Delivery Timeframes</h2>
          <div className="border border-gray-100 divide-y divide-gray-100">
            {[["Lahore", "1-2 business days"], ["Major Cities (Karachi, Islamabad, Rawalpindi, Faisalabad)", "2-3 business days"], ["Other Cities", "3-5 business days"], ["Remote Areas", "5-7 business days"]].map(([area, time]) => (
              <div key={area} className="flex justify-between p-3"><span className="text-primary">{area}</span><span>{time}</span></div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="font-heading text-xl text-primary mb-3">Shipping Charges</h2>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Free Shipping</strong> on all orders above PKR 5,000</li>
            <li>Flat rate of <strong>PKR 250</strong> for orders below PKR 5,000</li>
            <li>Cash on Delivery available nationwide</li>
          </ul>
        </section>
        <section>
          <h2 className="font-heading text-xl text-primary mb-3">Order Tracking</h2>
          <p>Once your order is dispatched, you will receive a tracking number via SMS and email. You can track your order status from your account dashboard.</p>
        </section>
        <section>
          <h2 className="font-heading text-xl text-primary mb-3">Important Notes</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Delivery times may vary during peak seasons (Eid, Ramadan)</li>
            <li>Please ensure a correct delivery address to avoid delays</li>
            <li>Someone must be available to receive the package at the delivery address</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
