import { ArrowLeft, Download, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DownloadConditions() {
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
              <Download className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">
                Download <span className="gradient-text">Conditions</span>
              </h1>
              <p className="mt-1 text-sm text-gray-400">Guidelines for using Zinvid download service</p>
            </div>
          </div>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-600">
            <div className="rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-4 flex items-start gap-3">
              <Info className="h-5 w-5 flex-shrink-0 text-amber-500 mt-0.5" />
              <p className="text-sm text-amber-800">
                Free users have limited download capabilities. Upgrade to Pro or Premium for unlimited access.
              </p>
            </div>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">1. Free Downloads</h2>
              <p>Free tier users can download videos with the following conditions:</p>
              <ul className="mt-2 space-y-2 pl-5 list-disc">
                <li>Maximum <strong className="text-gray-800">5 downloads per day</strong></li>
                <li>Standard download speed</li>
                <li>Basic quality (up to 480p)</li>
                <li>MP4 format only</li>
                <li>Ads may be displayed before and during downloads</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">2. Pro Downloads</h2>
              <p>Pro subscribers enjoy enhanced download conditions:</p>
              <ul className="mt-2 space-y-2 pl-5 list-disc">
                <li><strong className="text-gray-800">Unlimited downloads</strong> — no daily cap</li>
                <li>High-speed download servers</li>
                <li>HD (1080p) and 4K quality options</li>
                <li>MP3 + MP4 format support</li>
                <li>Priority support</li>
                <li>Reduced ads (may still see occasional ads)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">3. Premium Downloads</h2>
              <p>Premium subscribers get the best download experience:</p>
              <ul className="mt-2 space-y-2 pl-5 list-disc">
                <li><strong className="text-gray-800">Unlimited downloads</strong> with no restrictions</li>
                <li>Fastest download servers available</li>
                <li>Up to 8K resolution support</li>
                <li>All formats: MP3, MP4, AVI, MOV, and more</li>
                <li>Batch download support</li>
                <li><strong className="text-green-600">Completely ad-free</strong> experience</li>
                <li>24/7 priority customer support</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">4. Download Limits & Fair Use</h2>
              <p>
                To ensure fair access for all users, we implement reasonable rate limits and 
                concurrent download restrictions. Automated or scripted downloading is prohibited. 
                Excessive usage may result in temporary suspension.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">5. Supported Platforms</h2>
              <p>
                Zinvid supports video downloads from 50+ platforms including YouTube, Instagram, 
                TikTok, Facebook, Twitter/X, Vimeo, Dailymotion, and many more. Platform availability 
                may vary based on technical compatibility and platform policies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">6. Content Ownership</h2>
              <p>
                Downloaded content remains the property of its original creator or rights holder. 
                Users are responsible for ensuring they have the right to download and use the content. 
                Zinvid does not claim ownership of any downloaded content.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">7. Technical Requirements</h2>
              <ul className="mt-2 space-y-2 pl-5 list-disc">
                <li>A stable internet connection is required</li>
                <li>Some video qualities may require sufficient bandwidth</li>
                <li>Certain platforms may require the video to be publicly accessible</li>
                <li>Download speed depends on your internet connection and server load</li>
              </ul>
            </section>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/#pricing")}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-accent-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-500/20 transition-all hover:shadow-xl hover:shadow-brand-500/30 btn-shimmer"
            >
              Upgrade Plan
            </button>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-6 py-3 text-sm font-bold text-gray-700 transition-all hover:border-brand-200 hover:bg-brand-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
