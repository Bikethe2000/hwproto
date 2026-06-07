import React from 'react';
import SiteLayout from '@/components/layout/SiteLayout';

export default function Terms() {
  return (
    <SiteLayout>
      <div className="max-w-4xl mx-auto px-4 py-16 prose">
        <h1>Terms of Service</h1>
        <p>Last updated: 30/05/2026</p>
        <p>Version: 1.0</p>

        <h2>1. Parties and Acceptance</h2>
        <p>
          These Terms govern your access to and use of the HWProto Studio website, platform,
          storefront, and related services (collectively, the "Service"), operated by
          HWProto Studio ("HWProto", "we", "us", or "our"), a company incorporated under
          the laws of Greece, with registered address at Greece.
        </p>
        <p>
          By accessing or using the Service, you confirm that you have read, understood, and agree
          to be bound by these Terms and our Privacy Policy and Cookie Policy.
        </p>
        <p>If you do not agree to these Terms, you must not use the Service.</p>
        <p>
          If you are using the Service on behalf of a company or other legal entity, you represent
          that you have authority to bind that entity to these Terms.
        </p>

        <h2>2. Definitions</h2>
        <ul>
          <li><strong>Service:</strong> The HWProto Studio website, storefront, order system, file upload tools, and related features.</li>
          <li><strong>User:</strong> Any person who accesses or uses the Service.</li>
          <li><strong>Customer:</strong> A User who places an order or submits a quote request.</li>
          <li><strong>Order:</strong> A confirmed request for products or services.</li>
          <li><strong>Uploaded Content:</strong> Files, images, designs, BOMs, artwork, or other materials uploaded by a User.</li>
          <li><strong>Account:</strong> A registered user account (where enabled).</li>
          <li><strong>Intellectual Property Rights:</strong> All proprietary rights including copyrights, trademarks, patents, etc.</li>
        </ul>

        <h2>3. Eligibility</h2>
        <p>You must be at least [16 / 18] years old to use the Service.</p>
        <p>
          If you are under the age of majority, you may only use the Service with parental or
          guardian consent.
        </p>
        <p>We may refuse access to anyone at our discretion.</p>

        <h2>4. Accounts</h2>
        <p>You must provide accurate and complete information when registering an account.</p>
        <p>You are responsible for maintaining account security.</p>
        <p>Notify us immediately at hello@hwproto.studio of any unauthorised access.</p>
        <p>We may suspend or terminate accounts that violate these Terms.</p>

        <h2>5. Services and Orders</h2>
        <h3>5.1 Service Descriptions</h3>
        <p>We provide hardware prototyping, PCB design, print, and related services.</p>

        <h3>5.2 Quote Requests</h3>
        <p>A quote request is not a binding order.</p>

        <h3>5.3 Orders</h3>
        <p>
          An Order is formed when you submit an order and we issue a written confirmation to your
          email.
        </p>
        <p>We may decline orders at our discretion.</p>

        <h3>5.4 Pricing</h3>
        <p>Prices are shown in Euros and may be inclusive/exclusive of taxes.</p>
        <p>Prices may change until an Order is confirmed.</p>

        <h2>6. Payment</h2>
        <p>Accepted payment methods: Credit Cards, Debit Cards, Bank Transfers, PayPal, cryptocurrencies.</p>
        <p>Payment is due within 30 days of invoice date.</p>
        <p>Future online payments will be handled by a third‑party provider such as Stripe or PayPal.</p>

        <h2>7. Cancellations and Refunds</h2>
        <p>
          Orders may be cancelled within 24 hours unless production has begun. Refunds apply
          where we cannot fulfil the order or where defects cannot be remedied.
        </p>

        <h2>8. Uploaded Content</h2>
        <p>You are responsible for all content you upload.</p>
        <p>You grant us a limited licence to use your content solely to provide the Service.</p>
        <p>Prohibited content includes unlawful, infringing, or harmful materials.</p>

        <h2>9. Intellectual Property</h2>
        <p>
          All HWProto content is protected by Intellectual Property Rights. You may not reproduce or
          modify it without permission.
        </p>

        <h2>10. Acceptable Use</h2>
        <p>You agree not to misuse the Service, violate laws, or disrupt operations.</p>

        <h2>11. Limitation of Liability</h2>
        <p>
          Our total liability is limited to the amount you paid in the previous 12 months or
          [AMOUNT], whichever is greater.
        </p>

        <h2>12. Indemnification</h2>
        <p>
          You agree to indemnify HWProto against claims arising from your use of the Service or your
          Uploaded Content.
        </p>

        <h2>13. Third‑Party Services</h2>
        <p>We are not responsible for third‑party websites or services linked from our platform.</p>

        <h2>14. Export Controls</h2>
        <p>
          Technical data may be subject to export control laws. You are responsible for compliance.
        </p>

        <h2>15. Newsletter and Marketing</h2>
        <p>You may unsubscribe from marketing emails at any time.</p>

        <h2>16. Availability and Modifications</h2>
        <p>We may modify or discontinue the Service at any time.</p>

        <h2>17. Term and Termination</h2>
        <p>We may suspend or terminate access for violations of these Terms.</p>

        <h2>18. Governing Law</h2>
        <p>These Terms are governed by the laws of Greece.</p>

        <h2>19. Dispute Resolution</h2>
        <p>We encourage informal resolution. Otherwise, disputes fall under the courts of Greece.</p>

        <h2>20. Entire Agreement and Severability</h2>
        <p>
          These Terms, together with the Privacy Policy and Cookie Policy, form the entire
          agreement.
        </p>

        <h2>21. Contact</h2>
        <p>HWProto Studio</p>
        <p>Greece</p>
        <p>Email: hello@hwproto.studio</p>

     </div>
    </SiteLayout>
  );
}
