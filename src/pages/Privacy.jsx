import React from 'react';
import SiteLayout from '@/components/layout/SiteLayout';

export default function Privacy() {
  return (
    <SiteLayout>
      <div className="max-w-4xl mx-auto px-4 py-16 prose">
        <h1>Privacy Policy</h1>
        <p>Last updated: 30/05/2026</p>

        <h2>1. Who We Are</h2>
        <p>
          HWProto Studio, located at Γρεεψε, is the Data Controller for all
          personal data processed through the HWProto Studio platform and website.
        </p>
        <p>
          Contact: <a href="mailto:hello@hwproto.studio">hello@hwproto.studio</a>
        </p>

        <h2>2. Scope of This Policy</h2>
        <p>This Policy applies to website visitors, customers, newsletter subscribers, and users who upload files or create accounts.</p>

        <h2>3. Personal Data We Collect</h2>
        <p>We collect only the data necessary to provide and improve our services, including:</p>
        <ul>
          <li>Contact form details (name, email, message, attachments)</li>
          <li>Newsletter signup information</li>
          <li>Order and transaction data</li>
          <li>Account registration data</li>
          <li>Uploaded files and metadata</li>
          <li>Analytics and usage data</li>
          <li>Server logs for security</li>
        </ul>

        <h2>4. How and Why We Use Your Data</h2>
        <p>We process your data under GDPR Article 6(1) for purposes such as:</p>
        <ul>
          <li>Responding to enquiries</li>
          <li>Processing orders</li>
          <li>Sending transactional emails</li>
          <li>Sending newsletters (with consent)</li>
          <li>Fraud prevention and security</li>
          <li>Legal compliance</li>
          <li>Analytics and service improvement</li>
        </ul>

        <h2>5. Consent and Withdrawal</h2>
        <p>You may withdraw consent at any time by unsubscribing from emails or adjusting cookie preferences.</p>

        <h2>6. Data Retention</h2>
        <p>We retain data only as long as necessary. Specific retention periods must be confirmed by legal counsel.</p>

        <h2>7. Third-Party Processors</h2>
        <p>We use trusted providers such as Firebase, hosting services, email delivery services, analytics tools, and payment processors.</p>

        <h2>8. International Transfers</h2>
        <p>Where data is transferred outside the EEA, we ensure appropriate safeguards such as SCCs or adequacy decisions.</p>

        <h2>9. Analytics and Tracking</h2>
        <p>Analytics tools may collect usage data. Non-essential cookies require your consent.</p>

        <h2>10. Your Rights</h2>
        <p>You have rights under GDPR, including access, rectification, deletion, restriction, portability, and objection.</p>

        <h2>11. Cookies</h2>
        <p>See our Cookie Policy for details.</p>

        <h2>12. Children</h2>
        <p>Our Service is not intended for children under [13/16]. We do not knowingly collect data from children.</p>

        <h2>13. Security</h2>
        <p>We implement appropriate technical and organisational measures to protect your data.</p>

        <h2>14. Changes to This Policy</h2>
        <p>We may update this Policy and will post the updated version on this page.</p>

        <h2>15. Contact Us</h2>
        <p>
          For any privacy-related questions, contact us at{' '}
          <a href="mailto:hello@hwproto.studio">hello@hwproto.studio</a>.
        </p>
      </div>
    </SiteLayout>
  );
}
