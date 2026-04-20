import PageHeader from "@/components/PageHeader";

export const metadata = { title: "Privacy Policy | Aamir Fabrics" };

export default function PrivacyPolicyPage() {
  return (
    <div>
      <PageHeader title="Privacy Policy" subtitle="Your Data, Our Responsibility" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-body text-gray-600 text-sm leading-relaxed space-y-8">
        <p>Last updated: March 2026</p>
        <section>
          <h2 className="font-heading text-xl text-primary mb-3">Information We Collect</h2>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Personal Information:</strong> Name, email, phone number, shipping address</li>
            <li><strong>Payment Information:</strong> Payment method (we do not store card details)</li>
            <li><strong>Usage Data:</strong> Pages visited, products viewed, search queries</li>
          </ul>
        </section>
        <section>
          <h2 className="font-heading text-xl text-primary mb-3">How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Process and deliver your orders</li>
            <li>Send order updates and delivery notifications</li>
            <li>Improve our website and shopping experience</li>
            <li>Send promotional emails (only with your consent)</li>
          </ul>
        </section>
        <section>
          <h2 className="font-heading text-xl text-primary mb-3">Data Security</h2>
          <p>We implement industry-standard security measures to protect your personal data. Passwords are encrypted and we use secure connections (HTTPS) for all transactions.</p>
        </section>
        <section>
          <h2 className="font-heading text-xl text-primary mb-3">Third-Party Sharing</h2>
          <p>We do not sell or share your personal data with third parties except for delivery partners (courier services) necessary to fulfill your orders.</p>
        </section>
        <section>
          <h2 className="font-heading text-xl text-primary mb-3">Contact</h2>
          <p>For privacy-related queries, contact us at <strong>info@aamirfabrics.com</strong></p>
        </section>
      </div>
    </div>
  );
}
