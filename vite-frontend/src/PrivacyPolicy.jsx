import { ArrowLeft, Shield, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAF7F9]">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>

        <div className="glass-card rounded-3xl p-8 sm:p-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 shadow-lg">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">
                Privacy <span className="gradient-text">Policy</span>
              </h1>
              <p className="mt-1 text-sm text-gray-400">Last updated: June 2026</p>
            </div>
          </div>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-600">
            <p className="text-lg leading-relaxed">
              At <span className="font-bold text-gray-900">Zinvid</span>, we take your privacy seriously. 
              This policy outlines how we collect, use, and protect your information.
            </p>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">1. Information We Collect</h2>
              <p>
                We collect minimal information necessary to provide our video downloading service:
              </p>
              <ul className="mt-2 space-y-2 pl-5 list-disc">
                <li><strong className="text-gray-800">Account Data:</strong> Email address and name (only if you create an account).</li>
                <li><strong className="text-gray-800">Download History:</strong> URLs you submit for downloading (stored temporarily for processing).</li>
                <li><strong className="text-gray-800">Payment Data:</strong> We do NOT store credit card details. Payments are processed securely by Nagad.</li>
                <li><strong className="text-gray-800">Usage Data:</strong> Anonymous analytics to improve our service.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">2. How We Use Your Data</h2>
              <ul className="space-y-2 pl-5 list-disc">
                <li>To process and deliver your video downloads</li>
                <li>To manage your subscription and payments</li>
                <li>To improve and optimize our service</li>
                <li>To send occasional service-related communications</li>
                <li>To detect and prevent abuse of our platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">3. Data Protection</h2>
              <p>
                We implement industry-standard security measures including:
              </p>
              <ul className="mt-2 space-y-2 pl-5 list-disc">
                <li>256-bit SSL/TLS encryption for all data in transit</li>
                <li>Encrypted password storage using bcrypt</li>
                <li>Regular security audits and penetration testing</li>
                <li>Strict access controls for our team</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">4. Third-Party Services</h2>
              <p>
                We use trusted third-party services for payment processing (Nagad) and 
                content delivery. These providers have their own privacy policies and 
                data handling practices.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">5. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="mt-2 space-y-2 pl-5 list-disc">
                <li>Access your personal data at any time</li>
                <li>Delete your account and associated data</li>
                <li>Export your data in a portable format</li>
                <li>Opt out of non-essential communications</li>
                <li>Request details of how your data is processed</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">6. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy, please contact us at:
                <br />
                <a href="mailto:privacy@zinvid.com" className="text-brand-600 hover:text-brand-700 font-medium">
                  privacy@zinvid.com
                </a>
              </p>
            </section>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-accent-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-500/20 transition-all hover:shadow-xl hover:shadow-brand-500/30 btn-shimmer"
          >
            <Download className="h-4 w-4" />
            Back to Zinvid
          </button>
        </div>
      </div>
    </div>
  );
}
