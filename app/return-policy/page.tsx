import PageHeader from "@/components/PageHeader";

export const metadata = { title: "Return & Refund Policy | Aamir Fabrics" };

export default function ReturnPolicyPage() {
  return (
    <div>
      <PageHeader title="Return & Refund" subtitle="Policy" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-body text-gray-600 text-sm leading-relaxed space-y-8">
        <section>
          <h2 className="font-heading text-xl text-primary mb-3">Return Policy</h2>
          <p>We want you to be completely satisfied with your purchase. If for any reason you are not satisfied, you may return your order within <strong>7 days</strong> of delivery.</p>
        </section>
        <section>
          <h2 className="font-heading text-xl text-primary mb-3">Conditions for Return</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Items must be <strong>unused, unwashed, and unstitched</strong></li>
            <li>Original tags and packaging must be intact</li>
            <li>Sale items are <strong>non-returnable</strong></li>
            <li>Return request must be made within 7 days of delivery</li>
          </ul>
        </section>
        <section>
          <h2 className="font-heading text-xl text-primary mb-3">How to Return</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Contact us at <strong>info@aamirfabrics.com</strong> or call <strong>+92 300 1234567</strong></li>
            <li>Provide your order number and reason for return</li>
            <li>Our team will arrange a pickup or provide return shipping instructions</li>
            <li>Once received and inspected, refund will be processed</li>
          </ol>
        </section>
        <section>
          <h2 className="font-heading text-xl text-primary mb-3">Refund Process</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Refunds are processed within <strong>5-7 business days</strong> of receiving the returned item</li>
            <li>Refund will be credited to the original payment method</li>
            <li>For COD orders, refund will be sent via bank transfer or EasyPaisa/JazzCash</li>
            <li>Shipping charges are non-refundable</li>
          </ul>
        </section>
        <section>
          <h2 className="font-heading text-xl text-primary mb-3">Exchange Policy</h2>
          <p>We offer free exchanges for size or color issues. Contact our support team within 7 days of delivery to request an exchange. Subject to availability.</p>
        </section>
      </div>
    </div>
  );
}
