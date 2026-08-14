import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <div className="mb-10">
          <Link
            to="/"
            className="text-sm font-medium text-red-600 hover:text-red-700"
          >
            ← Back to SPEC360
          </Link>

          <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-5xl">
            Privacy Policy
          </h1>

          <p className="mt-4 text-sm text-slate-500">
            Last Updated: 13 August 2026
          </p>
        </div>

        <article className="prose prose-slate max-w-none">
          <p>
            SPEC360 Communication ("SPEC360", "we", "us", or "our") respects
            your privacy and is committed to protecting your personal
            information.
          </p>

          <h2>1. Information We Collect</h2>

          <p>
            Depending on how you interact with us, we may collect information
            such as your name, email address, telephone number, delivery
            information, order information and transaction information.
          </p>

          <h2>2. How We Use Your Information</h2>

          <p>
            We may use your information to process orders, verify payments,
            provide services, respond to enquiries, provide customer support,
            prevent fraud, maintain security and comply with legal obligations.
          </p>

          <h2>3. Payment Providers</h2>

          <p>
            Payments may be processed through Paystack or another third-party
            payment provider. SPEC360 does not intentionally store complete
            card details on its own servers.
          </p>

          <h2>4. Cookies</h2>

          <p>
            Our website may use cookies and similar technologies to maintain
            functionality, remember preferences, understand website usage and
            improve user experience.
          </p>

          <h2>5. Information Sharing</h2>

          <p>
            We may share information where necessary with payment processors,
            delivery providers, hosting providers, analytics providers,
            technology providers, professional advisers and relevant
            authorities.
          </p>

          <h2>6. Data Security</h2>

          <p>
            We take reasonable technical and organisational measures to protect
            personal information against unauthorised access, disclosure,
            accidental loss, destruction, alteration and misuse.
          </p>

          <h2>7. Data Retention</h2>

          <p>
            We retain personal information only for as long as reasonably
            necessary for legitimate business, contractual, legal and
            regulatory purposes.
          </p>

          <h2>8. Your Rights</h2>

          <p>
            Subject to applicable law, you may have rights to access, correct,
            delete, restrict or object to certain processing of your personal
            information.
          </p>

          <h2>9. Marketing</h2>

          <p>
            Where permitted, we may send information about products,
            promotions and services. You may opt out of marketing
            communications at any time.
          </p>

          <h2>10. Third-Party Websites</h2>

          <p>
            Our website may contain links to third-party websites. We are not
            responsible for their independent privacy practices.
          </p>

          <h2>11. Changes to this Policy</h2>

          <p>
            We may update this Privacy Policy periodically. The Last Updated
            date will be changed whenever material updates are made.
          </p>

          <h2>12. Contact Us</h2>

          <p>
            <strong>SPEC360 Communication</strong>
            <br />
            Website: spec360.com.ng
            <br />
            Privacy Email: info@spec360.com.ng
            <br />
            General Email: info@spec360.com.ng
            <br />
            Phone/WhatsApp: +234 818 279 9154
          </p>

          <p>
            For more information about our terms, see our{" "}
            <Link
              to="/terms"
              className="font-medium text-red-600 hover:text-red-700"
            >
              Terms & Conditions
            </Link>
            .
          </p>
        </article>
      </section>
    </main>
  );
}