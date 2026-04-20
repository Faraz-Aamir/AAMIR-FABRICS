import PageHeader from "@/components/PageHeader";

export const metadata = { title: "Terms & Conditions | Aamir Fabrics" };

export default function TermsPage() {
  return (
    <div>
      <PageHeader title="Terms & Conditions" subtitle="Legal" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-body text-gray-600 text-sm leading-relaxed space-y-8">
        <p>Last updated: March 2026</p>
        <section>
          <h2 className="font-heading text-xl text-primary mb-3">General</h2>
          <p>By accessing and using aamirfabrics.com, you agree to comply with these terms. We reserve the right to modify these terms at any time without prior notice.</p>
        </section>
        <section>
          <h2 className="font-heading text-xl text-primary mb-3">Products</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Product images are for illustration purposes; actual colors may vary slightly</li>
            <li>Prices are listed in Pakistani Rupees (PKR) and may be updated</li>
            <li>Product availability is subject to stock levels</li>
            <li>We reserve the right to limit product quantities per order</li>
          </ul>
        </section>
        <section>
          <h2 className="font-heading text-xl text-primary mb-3">Orders</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>All orders are subject to availability and confirmation</li>
            <li>We reserve the right to cancel orders due to stock issues or pricing errors</li>
            <li>Payment must be made via available payment methods (COD, JazzCash, EasyPaisa, Bank Transfer)</li>
          </ul>
        </section>
        <section>
          <h2 className="font-heading text-xl text-primary mb-3">User Accounts</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>You are responsible for maintaining your account credentials</li>
            <li>One account per email address</li>
            <li>We may suspend accounts engaging in fraudulent activity</li>
          </ul>
        </section>
        <section>
          <h2 className="font-heading text-xl text-primary mb-3">Intellectual Property</h2>
          <p>All content on this website (images, text, designs, logos) is the property of Aamir Fabrics and may not be reproduced without written permission.</p>
        </section>
        <section>
          <h2 className="font-heading text-xl text-primary mb-3">Contact</h2>
          <p>For questions regarding these terms, contact us at <strong>info@aamirfabrics.com</strong></p>
        </section>
      </div>
    </div>
  );
}
