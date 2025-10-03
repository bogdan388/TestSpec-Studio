import { Link } from 'react-router-dom'

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/" className="text-primary hover:underline mb-6 inline-block">
        ← Back to Home
      </Link>

      <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="prose max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
          <p className="text-gray-700">
            TestSpec Studio ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy
            explains how we collect, use, disclose, and safeguard your information when you use our application.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Personal Information</h3>
          <p className="text-gray-700 mb-4">
            When you sign in with Google, we collect:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Your name</li>
            <li>Your email address</li>
            <li>Your Google profile picture</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">Usage Data</h3>
          <p className="text-gray-700 mb-4">We collect information about your use of the service, including:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Test cases you generate</li>
            <li>User stories you submit</li>
            <li>Timestamps of your activity</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>To provide and maintain our service</li>
            <li>To store your test generation history (kept for 3 days, maximum 10 records)</li>
            <li>To authenticate and authorize your access</li>
            <li>To improve and optimize our service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Storage and Retention</h2>
          <p className="text-gray-700 mb-4">
            Your test generation history is automatically deleted after 3 days. We maintain a maximum of 10
            historical records per user. After 3 days or when you exceed 10 records, the oldest data is
            automatically removed.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. GDPR Compliance (EU Users)</h2>
          <p className="text-gray-700 mb-4">If you are located in the European Economic Area (EEA), you have certain rights regarding your personal data:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li><strong>Right to Access:</strong> You can request a copy of your personal data</li>
            <li><strong>Right to Rectification:</strong> You can request correction of inaccurate data</li>
            <li><strong>Right to Erasure:</strong> You can request deletion of your personal data</li>
            <li><strong>Right to Restrict Processing:</strong> You can request limitation of processing</li>
            <li><strong>Right to Data Portability:</strong> You can request transfer of your data</li>
            <li><strong>Right to Object:</strong> You can object to processing of your data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies and Tracking</h2>
          <p className="text-gray-700">
            We use essential cookies to maintain your login session. We do not use tracking or advertising cookies.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Third-Party Services</h2>
          <p className="text-gray-700 mb-4">We use the following third-party services:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li><strong>Google OAuth:</strong> For authentication</li>
            <li><strong>Supabase:</strong> For data storage and authentication</li>
            <li><strong>Google Gemini AI:</strong> For test case generation</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Data Security</h2>
          <p className="text-gray-700">
            We implement industry-standard security measures to protect your personal information. However, no
            method of transmission over the Internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Your Data Rights</h2>
          <p className="text-gray-700 mb-4">You have the right to:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Access your personal data</li>
            <li>Delete your account and all associated data</li>
            <li>Export your data</li>
            <li>Withdraw consent at any time</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to This Policy</h2>
          <p className="text-gray-700">
            We may update this Privacy Policy from time to time. We will notify you of any changes by updating
            the "Last updated" date at the top of this policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Us</h2>
          <p className="text-gray-700">
            If you have any questions about this Privacy Policy or wish to exercise your data rights, please
            contact us through our GitHub repository.
          </p>
        </section>
      </div>
    </div>
  )
}
