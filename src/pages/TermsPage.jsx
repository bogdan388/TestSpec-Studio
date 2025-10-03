import { Link } from 'react-router-dom'

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/" className="text-primary hover:underline mb-6 inline-block">
        ← Back to Home
      </Link>

      <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="prose max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-700">
            By accessing and using TestSpec Studio, you accept and agree to be bound by the terms and provision
            of this agreement.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
          <p className="text-gray-700 mb-4">
            Permission is granted to temporarily use TestSpec Studio for personal and commercial purposes.
            This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose without proper licensing</li>
            <li>Attempt to decompile or reverse engineer any software contained in TestSpec Studio</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Account</h2>
          <p className="text-gray-700 mb-4">
            You are responsible for maintaining the confidentiality of your account and for all activities that
            occur under your account.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data and Privacy</h2>
          <p className="text-gray-700">
            We store your test generation history for 3 days with a maximum of 10 records. By using our service,
            you consent to our data practices as described in our Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Service Availability</h2>
          <p className="text-gray-700">
            We strive to provide reliable service but do not guarantee that TestSpec Studio will be available at
            all times. We reserve the right to modify or discontinue the service at any time.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. AI-Generated Content</h2>
          <p className="text-gray-700">
            Test cases are generated using AI technology. While we strive for accuracy, we make no warranties
            about the completeness, reliability, or accuracy of the generated test cases. Users are responsible
            for reviewing and validating all generated content.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
          <p className="text-gray-700">
            In no event shall TestSpec Studio or its suppliers be liable for any damages (including, without
            limitation, damages for loss of data or profit, or due to business interruption) arising out of the
            use or inability to use the materials on TestSpec Studio.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Fair Use Policy</h2>
          <p className="text-gray-700 mb-4">
            We expect users to use the service reasonably. Excessive use that impacts service availability for
            others may result in rate limiting or account suspension.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Intellectual Property</h2>
          <p className="text-gray-700">
            The test cases you generate are yours to use as you see fit. TestSpec Studio retains ownership of
            the underlying software and AI models.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Termination</h2>
          <p className="text-gray-700">
            We may terminate or suspend your account immediately, without prior notice or liability, for any
            reason whatsoever, including without limitation if you breach the Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Governing Law</h2>
          <p className="text-gray-700">
            These Terms shall be governed and construed in accordance with applicable laws, without regard to
            its conflict of law provisions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to Terms</h2>
          <p className="text-gray-700">
            We reserve the right to modify or replace these Terms at any time. Continued use of the service
            after changes constitutes acceptance of the new Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact</h2>
          <p className="text-gray-700">
            If you have any questions about these Terms, please contact us through our GitHub repository.
          </p>
        </section>
      </div>
    </div>
  )
}
