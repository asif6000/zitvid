import { ArrowLeft, Download, Heart, Users, Zap, Globe, Star, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const stats = [
  { label: "Active Users", value: "500K+", icon: Users, gradient: "from-brand-500 to-accent-500" },
  { label: "Downloads Served", value: "10M+", icon: Download, gradient: "from-emerald-400 to-teal-500" },
  { label: "Platforms Supported", value: "50+", icon: Globe, gradient: "from-sky-400 to-blue-500" },
  { label: "User Satisfaction", value: "98%", icon: Star, gradient: "from-amber-400 to-orange-500" },
];

const values = [
  {
    title: "Speed First",
    desc: "We optimize every aspect of our service to deliver blazing-fast downloads.",
    icon: Zap,
    gradient: "from-amber-400 to-orange-500",
  },
  {
    title: "Privacy Focused",
    desc: "Your data is yours. We collect the minimum and protect it with enterprise-grade security.",
    icon: Shield,
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    title: "Free for Everyone",
    desc: "Quality video downloading shouldn't cost money. Our free tier is genuinely useful.",
    icon: Heart,
    gradient: "from-rose-400 to-pink-500",
  },
];

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAF7F9]">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>

        <div className="glass-card rounded-3xl p-8 sm:p-12 mb-8">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 shadow-xl mb-6">
              <Download className="h-8 w-8 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              About <span className="gradient-text">Zinvid</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 leading-relaxed">
              We're on a mission to make video downloading simple, fast, and accessible 
              for everyone — no matter where you are or what device you use.
            </p>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-600 leading-relaxed">
              Zinvid was born from a simple frustration: downloading videos from the internet 
              was always a hassle. Pop-up ads, slow speeds, hidden malware, and confusing 
              interfaces made a simple task feel impossible.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed">
              We built Zinvid to solve this. A clean, fast, and reliable video downloader 
              that works with 50+ platforms. No tricks, no spam, just downloads that work.
              Today, millions of users around the world trust Zinvid for their daily 
              downloading needs.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card rounded-2xl p-5 text-center">
              <div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <p className="mt-3 text-2xl font-extrabold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="glass-card rounded-3xl p-8 sm:p-12 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Values</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title} className="text-center p-4">
                <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${v.gradient} shadow-lg`}>
                  <v.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-4 font-bold text-gray-900">{v.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-3xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Millions of Happy Users</h2>
          <p className="text-gray-500 max-w-xl mx-auto mb-6">
            Start downloading your favorite videos today. Free, fast, and secure.
          </p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-accent-500 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-brand-500/20 transition-all hover:shadow-xl hover:shadow-brand-500/30 btn-shimmer"
          >
            <Download className="h-5 w-5" />
            Get Started Free
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          Have questions?{" "}
          <a href="mailto:hello@zinvid.com" className="text-brand-600 hover:text-brand-700 font-medium">
            hello@zinvid.com
          </a>
        </div>
      </div>
    </div>
  );
}
