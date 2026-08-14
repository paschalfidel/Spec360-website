import { Link } from "react-router-dom";

export default function Terms() {
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
            Terms & Conditions
          </h1>

          <p className="mt-4 text-sm text-slate-500">
            Last Updated: 13 August 2026
          </p>
        </div>

        <article className="prose prose-slate max-w-none">
          <p>
            Welcome to <strong>SPEC360 Communication</strong> ("SPEC360",
            "we", "us", or "our").
          </p>

          <p>
            These Terms and Conditions govern your access to and use of the
            SPEC360 website, online store, products, services, payment
            facilities and related features.
          </p>

          <h2>1. About SPEC360</h2>

          <p>
            SPEC360 Communication is a Nigerian technology business providing
            technology products and services.
          </p>

          <h2>2. Website Use</h2>

          <p>
            You agree to use the website only for lawful purposes and must not
            attempt to compromise, disrupt or misuse the website or its
            services.
          </p>

          <h2>3. Products and Product Information</h2>

          <p>
            We make reasonable efforts to ensure that product descriptions,
            photographs, specifications, prices and availability are accurate.
          </p>

          <h2>4. Prices</h2>

          <p>
            All prices are displayed in Nigerian Naira unless otherwise
            stated. Prices may change without prior notice.
          </p>

          <h2>5. Orders</h2>

          <p>
            Orders are subject to product availability, payment verification
            and successful processing.
          </p>

          <h2>6. Payment</h2>

          <p>
            Payments may be processed through Paystack or another payment
            provider made available by SPEC360.
          </p>

          <h2>7. Delivery and Fulfilment</h2>

          <p>
            Delivery times and charges may vary depending on location,
            availability and other circumstances outside our reasonable
            control.
          </p>

          <h2>8. Returns, Refunds and Exchanges</h2>

          <p>
            Eligible products may be returned, repaired, replaced, exchanged
            or refunded depending on the circumstances and applicable law.
          </p>

          <h2>9. Repairs and Technical Services</h2>

          <p>
            Customers should back up important data before submitting devices
            for repair.
          </p>

          <h2>10. Intellectual Property</h2>

          <p>
            SPEC360 branding, website content, graphics, software and other
            original materials are protected by applicable intellectual
            property laws.
          </p>

          <h2>11. Privacy</h2>

          <p>
            Your use of our website is also subject to our{" "}
            <Link
              to="/privacy"
              className="font-medium text-red-600 hover:text-red-700"
            >
              Privacy Policy
            </Link>
            .
          </p>

          <h2>12. Governing Law</h2>

          <p>
            These Terms shall be governed by and interpreted in accordance with
            the laws of the Federal Republic of Nigeria.
          </p>

          <h2>13. Contact Us</h2>

          <p>
            <strong>SPEC360 Communication</strong>
            <br />
            Website: spec360.com.ng
            <br />
            Email: info@spec360.com.ng
            <br />
            Phone/WhatsApp: +234 818 279 9154
          </p>
        </article>
      </section>
    </main>
  );
}