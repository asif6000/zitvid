import { ArrowLeft, FileText, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TermsOfService() {
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
              <FileText className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">
                Terms of <span className="gradient-text">Service</span>
              </h1>
              <p className="mt-1 text-sm text-gray-400">Last updated: June 2026</p>
            </div>
          </div>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-600">
            <p className="text-lg leading-relaxed">
              Welcome to <span className="font-bold text-gray-900">Zinvid</span>. By using our service, 
              you agree to the following terms and conditions.
            </p>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing or using Zinvid, you agree to be bound by these Terms of Service. 
                If you do not agree, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">2. Service Description</h2>
              <p>
                Zinvid provides a video downloading service that allows users to download videos 
                from various online platforms. We do not host any copyrighted content on our servers. 
                All downloads are processed in real-time from publicly available URLs.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">3. User Responsibilities</h2>
              <ul className="mt-2 space-y-2 pl-5 list-disc">
                <li>You must be at least 13 years old to use this service</li>
                <li>You agree to use the service only for lawful purposes</li>
                <li>You will not attempt to bypass download limits or restrictions</li>
                <li>You will not use the service to download copyrighted content without permission</li>
                <li>You are responsible for maintaining the confidentiality of your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">4. Subscription & Payments</h2>
              <p>
                Subscription fees are charged in advance on a monthly or yearly basis. 
                Refunds are handled on a case-by-case basis. You may cancel your subscription 
                at any time, and access will continue until the end of the billing period.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">5. Prohibited Uses</h2>
              <ul className="mt-2 space-y-2 pl-5 list-disc">
                <li>Downloading copyrighted material without authorization</li>
                <li>Using automated scripts or bots to access our service</li>
                <li>Attempting to disrupt or overload our servers</li>
                <li>Reselling or redistributing downloaded content</li>
                <li>Using the service for any illegal activity</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">6. Limitation of Liability</h2>
              <p>
                Zinvid is provided "as is" without warranties of any kind. We are not liable for 
                any damages arising from the use or inability to use our service. We reserve the 
                right to modify or discontinue the service at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">7. Changes to Terms</h2>
              <p>
                We may update these terms at any time. Users will be notified of material changes 
                via email or through our website. Continued use after changes constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">8. Contact</h2>
              <p>
                For questions about these terms, contact us at:
                <br />
                <a href="mailto:legal@zinvid.com" className="text-brand-600 hover:text-brand-700 font-medium">
                  legal@zinvid.com
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
