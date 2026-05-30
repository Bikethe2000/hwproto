import React from 'react';
import SiteLayout from '@/components/layout/SiteLayout';

export default function Cookies() {
  return (
    <SiteLayout>
      <div className="max-w-4xl mx-auto px-4 py-16 prose">
        <h1>Cookie Policy</h1>
        <p>Last updated: 30/05/2026</p>
        <p>Version: 1.0</p>

        <p>
          LEGAL NOTICE: This Cookie Policy is prepared in accordance with Article 5(3) of Directive
          2002/58/EC (ePrivacy Directive) and Regulation (EU) 2016/679 (GDPR). It must be reviewed
          and approved by a qualified legal professional before publication. All [PLACEHOLDER]
          fields must be completed by the operator or their legal counsel.
        </p>

        <h2>1. What Are Cookies?</h2>
        <p>
          Cookies are small text files placed on your device when you visit a website. They help
          websites function, remember preferences, and provide analytics insights. Similar
          technologies such as local storage, session storage, web beacons, and pixel tags operate
          in comparable ways and are covered by this Policy.
        </p>
        <p>
          Under Article 5(3) of the ePrivacy Directive, storing or accessing information on your
          device requires your prior consent unless the cookie is strictly necessary. We respect
          this requirement.
        </p>

        <h2>2. Who Sets Cookies on This Site?</h2>
        <p>
          [LEGAL ENTITY FULL NAME] ("HWProto", "we", "us") operates the HWProto Studio website and
          sets first‑party cookies. We also use third‑party services that may set cookies on our
          behalf or for their own purposes.
        </p>

        <h2>3. Categories of Cookies We Use</h2>

        <h3>3.1 Strictly Necessary Cookies</h3>
        <p>
          These cookies are essential for the website to function. They do not require your consent.
        </p>

        <table>
          <thead>
            <tr>
              <th>Cookie name</th>
              <th>Provider</th>
              <th>Purpose</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>[SESSION_COOKIE_NAME]</td>
              <td>HWProto Studio</td>
              <td>Maintains your session state</td>
              <td>Session</td>
            </tr>
            <tr>
              <td>[AUTH_TOKEN_COOKIE]</td>
              <td>Firebase Auth</td>
              <td>Stores your authentication token</td>
              <td>[Duration]</td>
            </tr>
            <tr>
              <td>[CSRF_TOKEN]</td>
              <td>HWProto Studio</td>
              <td>Protects against CSRF attacks</td>
              <td>Session</td>
            </tr>
            <tr>
              <td>[COOKIE_CONSENT_PREF]</td>
              <td>HWProto Studio</td>
              <td>Stores your cookie consent preferences</td>
              <td>12 months</td>
            </tr>
          </tbody>
        </table>

        <h3>3.2 Performance and Analytics Cookies</h3>
        <p>These cookies help us understand how visitors use our website. They require consent.</p>

        <table>
          <thead>
            <tr>
              <th>Cookie name</th>
              <th>Provider</th>
              <th>Purpose</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>[ANALYTICS_COOKIE_1]</td>
              <td>[Analytics Provider]</td>
              <td>Tracks page views and interactions</td>
              <td>[Duration]</td>
            </tr>
            <tr>
              <td>[ANALYTICS_COOKIE_2]</td>
              <td>[Provider]</td>
              <td>[Purpose]</td>
              <td>[Duration]</td>
            </tr>
          </tbody>
        </table>

        <p>Provider privacy policy: [Link]</p>

        <h3>3.3 Functional Cookies</h3>
        <p>These cookies remember your preferences and require consent.</p>

        <table>
          <thead>
            <tr>
              <th>Cookie name</th>
              <th>Provider</th>
              <th>Purpose</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>[FUNCTIONAL_COOKIE_1]</td>
              <td>HWProto Studio</td>
              <td>[Purpose]</td>
              <td>[Duration]</td>
            </tr>
          </tbody>
        </table>

        <h3>3.4 Marketing and Targeting Cookies</h3>
        <p>We do not currently use marketing cookies. If this changes, we will update this Policy.</p>

        <h2>4. Third‑Party Cookies and Embeds</h2>
        <p>
          Some pages may include third‑party content (e.g., videos, maps). These services may set
          their own cookies.
        </p>

        <table>
          <thead>
            <tr>
              <th>Third‑party service</th>
              <th>Purpose</th>
              <th>Cookie information</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>[e.g., YouTube]</td>
              <td>Embedded video content</td>
              <td>[Link]</td>
            </tr>
            <tr>
              <td>[e.g., Google Maps]</td>
              <td>Embedded maps</td>
              <td>[Link]</td>
            </tr>
          </tbody>
        </table>

        <h2>5. Cookie Consent</h2>
        <p>
          When you first visit our website, a cookie banner allows you to accept, reject, or manage
          cookie categories. Your preferences are stored for 12 months.
        </p>
        <p>You may change your preferences at any time via the "Cookie Settings" link.</p>

        <h2>6. How to Control Cookies via Your Browser</h2>
        <p>You can manage cookies through your browser settings. Links to instructions:</p>
        <ul>
          <li>Google Chrome: https://support.google.com/chrome/answer/95647</li>
          <li>Mozilla Firefox: https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer</li>
          <li>Safari: https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac</li>
          <li>Microsoft Edge: https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09</li>
        </ul>

        <h2>7. Do Not Track</h2>
        <p>
          Some browsers send a "Do Not Track" signal. There is no standard response yet. We will
          update this Policy if a standard is adopted.
        </p>

        <h2>8. Changes to This Cookie Policy</h2>
        <p>
          We may update this Policy to reflect changes in our cookie usage or legal requirements.
          Updates will be posted with a revised "Last updated" date.
        </p>

        <h2>9. More Information</h2>
        <p>
          For more information about how we process personal data, please read our Privacy Policy.
        </p>

        <p>
          For questions about this Cookie Policy, contact:<br />
          HWProto Studio<br />
          Greece<br />
          Email: hello@hwproto.studio
        </p>
      </div>
    </SiteLayout>
  );
}
