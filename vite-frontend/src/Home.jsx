import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Download, Search, ChevronDown, Check, Crown, Menu, X,
  SquarePlay, Camera, MessageCircle, Music2, Globe, Shield,
  Zap, Users, Star, TrendingUp, ArrowRight, Loader2,
  LogIn, Sparkles, Clock, Film, Bookmark, Ghost,
  Gamepad2, Headphones, Video, Heart, ExternalLink,
  ListMusic, Rocket, Gift, Lock,
} from "lucide-react";
import { useSiteSettings } from "./SiteSettingsContext.jsx";

const API = import.meta.env.VITE_API_URL || "";

const YouTubeIcon = () => <svg viewBox="0 0 24 24" className="w-full h-full p-0.5 fill-white"><path d="M23.5 6.2c-.3-1.1-1.1-1.9-2.2-2.2C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.3.5C1.6 4.3.8 5.1.5 6.2 0 8 0 12 0 12s0 4 .5 5.8c.3 1.1 1.1 1.9 2.2 2.2 1.8.5 9.3.5 9.3.5s7.5 0 9.3-.5c1.1-.3 1.9-1.1 2.2-2.2.5-1.8.5-5.8.5-5.8s0-4-.5-5.8zM9.5 15.5V8.5l6.2 3.5-6.2 3.5z"/></svg>;
const InstagramIcon = () => <svg viewBox="0 0 24 24" className="w-full h-full p-0.5"><defs><linearGradient id="igP" x1="0" y1="0" x2="24" y2="24"><stop offset="0" stopColor="#f58529"/><stop offset="0.5" stopColor="#dd2a7b"/><stop offset="1" stopColor="#8134af"/></linearGradient></defs><rect x="2" y="2" width="20" height="20" rx="5" fill="url(#igP)"/><circle cx="12" cy="12" r="5" fill="none" stroke="white" strokeWidth="1.8"/><circle cx="17.5" cy="6.5" r="1.5" fill="white"/></svg>;
const TikTokIcon = () => <svg viewBox="0 0 24 24" className="w-full h-full p-0.5 fill-white"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>;
const FacebookIcon = () => <svg viewBox="0 0 24 24" className="w-full h-full p-0.5 fill-white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
const XIcon = () => <svg viewBox="0 0 24 24" className="w-full h-full p-0.5 fill-white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const LinkedInIcon = () => <svg viewBox="0 0 24 24" className="w-full h-full p-0.5 fill-white"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
const PinterestIcon = () => <svg viewBox="0 0 24 24" className="w-full h-full p-0.5 fill-white"><path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/></svg>;
const SnapchatIcon = () => <svg viewBox="0 0 24 24" className="w-full h-full p-0.5 fill-white"><path d="M12.206.793c.99 0 4.347.31 6.093 2.432 1.212 1.471 1.463 3.341.828 5.617-.121.44-.027.669.235.896.343.297 1.016.515 1.61.683.823.232 2.465.696 2.965 1.501.376.603.386 1.29.016 1.889-.48.775-1.69 1.125-2.985 1.125-.483 0-.994-.05-1.451-.116-.165-.024-.322-.058-.464-.075-.176-.021-.304.068-.31.254-.01.286.02.674.076 1.022.155.963.686 1.613 1.473 1.978.574.265 1.306.566 1.481 1.09.164.486-.027.97-.426 1.22-.728.456-1.797.218-2.753-.15-.448-.173-.87-.357-1.15-.357-.07 0-.14.005-.21.017 0 .62.08 1.239.206 1.828.234 1.097.618 2.036 1.27 2.424.638.38 1.521.6 2.472.6.863 0 1.774-.14 2.327-.503.432-.283.593-.618.488-1.277-.053-.337-.17-.532-.309-.71-.136-.175-.177-.33-.147-.529.045-.29.41-.399.746-.442.687-.087 1.404-.629 1.404-1.325 0-.426-.27-.826-.584-1.082-.295-.24-.627-.399-.643-.722-.008-.194.148-.576.275-.858.206-.456.356-.787.406-1.062.006-.033.025-.057.051-.072.592-.347 1.062-.494 1.832-.494.575 0 1.237.087 1.706-.255.305-.222.524-.571.507-.975-.02-.56-.382-1.035-1.083-1.42-1.02-.56-2.408-.89-3.225-1.332-.255-.138-.411-.285-.57-.475-.077-.093-.102-.213-.108-.33-.005-.102.008-.205.021-.307.032-.25.077-.506.077-.77 0-2.237-.766-4.36-2.155-5.977-1.357-1.58-3.24-2.443-5.445-2.492-2.606-.056-4.83 1.09-6.313 3.245-1.32 1.92-1.765 4.119-1.252 6.21.066.27.111.546.14.825.033.322.06.655-.073.909-.098.186-.316.311-.493.413-.742.428-1.896.856-2.58 1.626-.408.46-.51.945-.462 1.383.02.176.11.416.316.664.159.191.35.361.581.487.716.389 1.545.448 2.144.488.268.018.52.035.779.09.28.059.474.293.431.541-.01.057-.02.115-.029.171-.082.489-.137.717-.168.872-.15.747-.253 1.086-.347 1.34-.076.209-.186.307-.276.35-.298.14-.905.027-1.618-.188l-.032-.008c-.244-.072-.517-.156-.78-.236-.74-.225-1.341-.242-1.718.074-.126.106-.22.25-.271.421-.532 1.764 4.083 3.283 9.648 3.283 5.566 0 10.18-1.519 9.648-3.283z"/></svg>;
const RedditIcon = () => <svg viewBox="0 0 24 24" className="w-full h-full p-0.5 fill-white"><path d="M12 0A12 12 0 0012 24 12 12 0 0012 0zM18.92 9.16c.93 0 1.68.75 1.68 1.68 0 .72-.46 1.33-1.09 1.57.04.22.06.44.06.66 0 2.79-3.35 5.05-7.48 5.05s-7.48-2.26-7.48-5.05c0-.22.02-.44.06-.66-.64-.24-1.09-.85-1.09-1.57 0-.93.75-1.68 1.68-1.68.45 0 .85.17 1.15.45 1.08-.76 2.55-1.25 4.18-1.31l.79-3.71c.02-.09.08-.16.17-.19l2.47-.83c.17.33.52.56.92.56.57 0 1.03-.46 1.03-1.03s-.46-1.03-1.03-1.03c-.44 0-.82.28-.96.67l-2.28.77c-.11.04-.22.01-.3-.05-.08-.06-.13-.16-.13-.27l-.64-3c-.04-.17.07-.34.24-.38l1.86-.51c.11.21.33.35.58.35.37 0 .67-.3.67-.67 0-.37-.3-.67-.67-.67-.28 0-.52.17-.62.41l-2.06.57c-.17.05-.34-.04-.4-.2l-.28-.74c-.17-.45-.6-.75-1.09-.75-.65 0-1.18.53-1.18 1.18 0 .14.03.28.08.4l-4.2 4.9c-1.03.73-1.7 1.77-1.85 2.96-.3-.19-.66-.3-1.05-.3-.93 0-1.68.75-1.68 1.68 0 .72.46 1.33 1.09 1.57-.04.22-.06.44-.06.66 0 2.79 3.35 5.05 7.48 5.05s7.48-2.26 7.48-5.05c0-.22-.02-.44-.06-.66.64-.24 1.09-.85 1.09-1.57 0-.93-.75-1.68-1.68-1.68-.36 0-.69.11-.98.3-.67-.52-1.5-.88-2.42-1.03l.72-3.33c.02-.1.09-.19.18-.24l2.03-.82c.16.34.5.58.9.58.37 0 .67-.3.67-.67s-.3-.67-.67-.67c-.23 0-.44.12-.56.3l-2.04.82c-.11.05-.23.03-.32-.04-.09-.07-.14-.17-.15-.29l-.72-3.37c.24-.02.48-.04.72-.04 1.7 0 3.23.51 4.18 1.26.3-.27.7-.44 1.14-.44z"/></svg>;
const TwitchIcon = () => <svg viewBox="0 0 24 24" className="w-full h-full p-0.5 fill-white"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/></svg>;
const SoundCloudIcon = () => <svg viewBox="0 0 24 24" className="w-full h-full p-0.5 fill-white"><path d="M11.56 8.466v8.074a.372.372 0 00.371.371.372.372 0 00.371-.371V8.466a.372.372 0 00-.371-.372.372.372 0 00-.371.372zM8.457 9.056v7.421a.137.137 0 00.137.136.137.137 0 00.136-.136V9.056a.137.137 0 00-.136-.137.137.137 0 00-.137.137zm6.769 1.219v6.202a.372.372 0 00.742 0v-6.202a.372.372 0 10-.742 0zM3.473 10.76v5.654a.24.24 0 00.24.24.24.24 0 00.24-.24V10.76a.24.24 0 00-.24-.24.24.24 0 00-.24.24zm19.646 2.034c-.654-1.822-2.425-3.107-4.434-3.156-.6-.015-1.204.078-1.773.238a.474.474 0 00-.35.462v6.202c0 .132.054.252.14.339a.47.47 0 00.337.146h5.576c1.33.005 2.515-.84 2.913-2.089.18-.563.15-1.154-.09-1.687-.06-.132-.127-.269-.212-.406l-.107-.049zM6.747 8.246v7.484a.24.24 0 00.48 0V8.246a.24.24 0 00-.48 0zm-3.3.819v6.49a.137.137 0 00.273 0V9.065a.137.137 0 00-.273 0zM.125 11.646v2.828a.372.372 0 00.743 0v-2.828a.372.372 0 00-.743 0zm4.388-1.64v5.903a.24.24 0 00.48 0v-5.903a.24.24 0 00-.48 0zm1.881.632v5.107a.137.137 0 00.274 0v-5.107a.137.137 0 00-.274 0zm5.145-2.369v7.558a.137.137 0 00.274 0V8.269a.137.137 0 00-.274 0zm1.395-.18v7.837a.372.372 0 00.743 0V8.089a.372.372 0 00-.743 0z"/></svg>;
const VimeoIcon = () => <svg viewBox="0 0 24 24" className="w-full h-full p-0.5 fill-white"><path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197c1.185-1.044 2.351-2.084 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.493 4.797l-.013.01z"/></svg>;
const DailymotionIcon = () => <svg viewBox="0 0 24 24" className="w-full h-full p-0.5 fill-white"><path d="M13.389 3.801c0-1.543 1.633-2.55 3.025-2.55 1.388 0 3.022 1.007 3.022 2.55V10.2c0 1.542-1.634 2.55-3.022 2.55-1.392 0-3.025-1.008-3.025-2.55Zm-3.033 7.008c0 1.542-1.633 2.55-3.025 2.55-1.388 0-3.022-1.008-3.022-2.55V7.765c0-1.543 1.634-2.55 3.022-2.55 1.392 0 3.025 1.007 3.025 2.55Zm.835-8.242c2.039 0 3.86 1.077 3.86 3.065v12.916c0 4.779-4.375 5.7-8.081 5.7C3.17 24.031 0 22.934 0 18.735l2.633-.328c0 2.066 1.634 2.879 3.504 2.879 1.393 0 3.022-1.233 3.022-2.55v-1.235c-.43.202-.92.308-1.466.308-2.04 0-3.858-1.008-3.858-3.064V7.3c0-2.055 1.818-3.065 3.858-3.065h3.525z"/></svg>;

const platforms = [
  { name: "YouTube", icon: YouTubeIcon, color: "bg-red-500" },
  { name: "Instagram", icon: InstagramIcon, color: "bg-gradient-to-br from-purple-500 to-pink-500" },
  { name: "TikTok", icon: TikTokIcon, color: "bg-black" },
  { name: "Facebook", icon: FacebookIcon, color: "bg-blue-600" },
  { name: "Twitter/X", icon: XIcon, color: "bg-gray-800" },
  { name: "LinkedIn", icon: LinkedInIcon, color: "bg-blue-700" },
  { name: "Pinterest", icon: PinterestIcon, color: "bg-red-600" },
  { name: "Snapchat", icon: SnapchatIcon, color: "bg-yellow-400" },
  { name: "Reddit", icon: RedditIcon, color: "bg-orange-500" },
  { name: "Twitch", icon: TwitchIcon, color: "bg-purple-600" },
  { name: "SoundCloud", icon: SoundCloudIcon, color: "bg-orange-600" },
  { name: "Vimeo", icon: VimeoIcon, color: "bg-blue-500" },
  { name: "Dailymotion", icon: DailymotionIcon, color: "bg-gray-700" },
];

const features = [
  { icon: Zap, title: "Lightning Fast", desc: "High-speed servers for quick downloads", gradient: "from-amber-400 to-orange-500" },
  { icon: Shield, title: "100% Safe", desc: "Secure downloads, no malware or tracking", gradient: "from-emerald-400 to-teal-500" },
  { icon: Globe, title: "50+ Platforms", desc: "YouTube, Instagram, TikTok & more", gradient: "from-sky-400 to-blue-500" },
  { icon: Crown, title: "HD & 4K", desc: "Download in stunning quality up to 4K", gradient: "from-brand-500 to-accent-500" },
];

const plans = [
  {
    name: "Free",
    price: 0,
    currency: "BDT",
    interval: "month",
    gradient: "from-gray-500 to-gray-600",
    popular: false,
    features: ["Basic quality downloads", "5 downloads per day", "Standard speed", "MP4 format only"],
  },
  {
    name: "Pro",
    price: 999,
    currency: "BDT",
    interval: "month",
    gradient: "from-brand-500 to-accent-500",
    popular: true,
    features: ["HD & 4K downloads", "Unlimited downloads", "High-speed servers", "MP3 + MP4 formats", "Priority support"],
  },
  {
    name: "Premium",
    price: 1999,
    currency: "BDT",
    interval: "month",
    gradient: "from-amber-400 to-orange-500",
    popular: false,
    features: ["8K & 4K downloads", "Unlimited downloads", "Fastest servers", "All formats (MP3, MP4, AVI, MOV)", "24/7 priority support", "Batch downloads", "No ads"],
  },
  {
    name: "Pro Yearly",
    price: 7999,
    currency: "BDT",
    interval: "year",
    gradient: "from-emerald-500 to-teal-500",
    popular: false,
    features: ["Everything in Pro", "Save 33% vs monthly", "Bonus: 50GB cloud storage"],
  },
];

const testimonials = [
  { name: "Sarah K.", role: "Content Creator", text: "Zinvid is a lifesaver! I download videos for my content daily and it's incredibly fast.", rating: 5, avatar: "SK" },
  { name: "James R.", role: "Video Editor", text: "The 4K quality is amazing. Best video downloader I've ever used.", rating: 5, avatar: "JR" },
  { name: "Priya M.", role: "Social Media Manager", text: "Handles all platforms flawlessly. Worth every penny for the Pro plan.", rating: 5, avatar: "PM" },
  { name: "Alex T.", role: "Student", text: "Free tier is generous enough for my needs. Great service!", rating: 4, avatar: "AT" },
  { name: "Maria L.", role: "Digital Marketer", text: "Batch downloading saves me hours every week. Highly recommend!", rating: 5, avatar: "ML" },
  { name: "David W.", role: "Freelancer", text: "Clean interface, no annoying ads. Premium is totally worth it.", rating: 5, avatar: "DW" },
];

const faqs = [
  { q: "Is Zinvid free to use?", a: "Yes! We offer a generous free tier with basic features. Upgrade to Pro or Premium for unlimited downloads and higher quality." },
  { q: "What platforms are supported?", a: "We support 50+ platforms including YouTube, Instagram, TikTok, Facebook, Twitter/X, and Vimeo." },
  { q: "Is it safe to download videos?", a: "Absolutely. All downloads are processed securely with no malware, tracking, or data collection." },
  { q: "What video quality is available?", a: "Free users get up to 480p, Pro up to 4K, and Premium up to 8K depending on the source." },
  { q: "How do I cancel my subscription?", a: "You can cancel anytime from your account settings. Access continues until the end of your billing period." },
];

function TrendingCard({ item, index }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="group cursor-pointer rounded-2xl bg-white/70 backdrop-blur-md p-3 shadow-sm ring-1 ring-gray-100/80 transition-all duration-500 hover:shadow-2xl hover:ring-brand-200/50 hover:bg-white/90 animate-fade-in-up"
      style={{
        animationDelay: `${index * 0.06}s`,
        perspective: '800px',
      }}
      onMouseMove={(e) => {
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.02)`;
        el.style.boxShadow = `${x * 20}px ${y * 20}px 40px -12px rgba(147,51,234,0.15)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
        <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} transition-opacity duration-500 ${imgLoaded || imgError ? 'opacity-0' : 'opacity-100'}`} />
        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer" />
        )}
        <img
          src={item.thumbnail}
          alt={item.title}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/25 backdrop-blur-md shadow-lg ring-1 ring-white/30 transition-transform group-hover:scale-110">
            <Download className="h-5 w-5 text-white drop-shadow-md" />
          </div>
        </div>
        <span className="absolute bottom-1.5 right-1.5 rounded-md bg-black/50 backdrop-blur-sm px-1.5 py-0.5 text-[10px] font-medium text-white shadow-sm">
          {item.duration}
        </span>
        {item.isUserDownload && (
          <div className="absolute top-1.5 left-1.5 animate-scale-in">
            <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-600 to-accent-500 px-2 py-0.5 text-[8px] font-bold text-white shadow-lg shadow-brand-500/30">
              <Sparkles className="h-2.5 w-2.5" />
              Your Download
            </div>
          </div>
        )}
      </div>
      <p className="mt-2.5 text-xs font-bold text-gray-900 line-clamp-2 leading-relaxed group-hover:text-brand-700 transition-colors duration-300">{item.title}</p>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" className="h-3 w-3 fill-gray-300 group-hover:fill-brand-400 transition-colors duration-300">
            <path d="M8 5v14l11-7z"/>
          </svg>
          <span className="text-[10px] font-medium text-gray-400 capitalize group-hover:text-gray-600 transition-colors duration-300">{item.platform}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] text-gray-400">{(item.downloads / 1000).toFixed(0)}K</span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [user, setUser] = useState(null);
  const [trending, setTrending] = useState([]);
  const [formatOptions, setFormatOptions] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [fetchMessage, setFetchMessage] = useState("");
  const [showAdModal, setShowAdModal] = useState(false);
  const [adCountdown, setAdCountdown] = useState(8);
  const [pendingFormat, setPendingFormat] = useState(null);
  const [downloadingFormat, setDownloadingFormat] = useState(null);
  const isPro = subscription && subscription.status === "ACTIVE" && (subscription.plan?.price || 0) > 0;

  const userMenuRef = useRef(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const heroRef = useRef(null);
  const [cursorPos, setCursorPos] = useState({ x: 0.5, y: 0.5 });
  const [platformIndex, setPlatformIndex] = useState(0);
  const platformNames = ["YouTube", "Instagram", "TikTok", "Facebook", "Twitter/X"];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlatformIndex((i) => (i + 1) % platformNames.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      setCursorPos({ x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height });
    };
    el.addEventListener("mousemove", handleMove);
    return () => el.removeEventListener("mousemove", handleMove);
  }, []);

  const fetchTrending = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/download/trending`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      setTrending(data.trending || []);
    } catch {}
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try { setUser(JSON.parse(localStorage.getItem("user") || "{}")); } catch {}
      fetch(`${API}/api/subscription/my-subscription`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => setSubscription(data.subscription))
        .catch(() => {});
    }
    fetchTrending();
  }, [fetchTrending]);

  useEffect(() => {
    function handleClick(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (!showAdModal || adCountdown <= 0) return;
    const timer = setInterval(() => {
      setAdCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [showAdModal, adCountdown]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    setFetchMessage("");

    setLoading(true);
    setError("");
    setResult(null);
    setFormatOptions([]);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to process");

      setResult(data);
      if (data.formats?.length > 0) {
        setFormatOptions(data.formats);
      }
      setFetchMessage("Contacting video server...");

      const loadingMsgs = [
        "Contacting video server...",
        "Analyzing video stream...",
        "Extracting available formats...",
        "Almost done...",
      ];
      let msgIdx = 0;
      const msgInterval = setInterval(() => {
        msgIdx = Math.min(msgIdx + 1, loadingMsgs.length - 1);
        setFetchMessage(loadingMsgs[msgIdx]);
      }, 2500);

      const pollInfo = async () => {
        for (let attempt = 0; attempt < 30; attempt++) {
          const delay = attempt < 5 ? 800 : attempt < 15 ? 1200 : 2000;
          await new Promise((r) => setTimeout(r, delay));
          try {
            const infoRes = await fetch(`${API}/api/download/info/${data.downloadId}`);
            const infoData = await infoRes.json();
            if (infoData.formats) {
              setFormatOptions(infoData.formats);
              setResult((prev) => ({ ...prev, ...infoData }));
              clearInterval(msgInterval);
              setFetchMessage("");
              fetchTrending();
              return;
            }
            if (infoData.error) {
              setError(infoData.error);
              clearInterval(msgInterval);
              setFetchMessage("");
              return;
            }
          } catch {}
        }
        clearInterval(msgInterval);
      };
      pollInfo();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const executeDownload = async (fmt) => {
    if (!result) return;
    setDownloadingFormat(fmt.quality + fmt.format);
    const token = localStorage.getItem("token");
    const params = new URLSearchParams({
      quality: fmt.quality,
      format: fmt.format,
      ...(fmt.formatId ? { formatId: fmt.formatId } : {}),
    });
    try {
      const res = await fetch(`${API}/api/download/${result.downloadId}?${params}`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Download failed");
      }
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `zinvid_${fmt.quality}.${fmt.format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      if (!user) incrementGuestDownload();
      fetchTrending();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed");
    } finally {
      setDownloadingFormat(null);
    }
  };

  const freeQualityLimit = 720;
  const guestDownloadLimit = 2;
  const qualityToNumber = (q) => {
    const m = q.match(/^(\d+)p$/);
    return m ? parseInt(m[1]) : q === "MP3" ? 0 : 9999;
  };

  const getGuestDownloadCount = () => {
    try { return parseInt(localStorage.getItem("guestDownloads") || "0"); } catch { return 0; }
  };

  const incrementGuestDownload = () => {
    try { localStorage.setItem("guestDownloads", String(getGuestDownloadCount() + 1)); } catch {}
  };

  const isFormatLocked = (fmt) => {
    if (isPro) return false;
    const num = qualityToNumber(fmt.quality);
    return num > freeQualityLimit;
  };

  const isGuestDownloadBlocked = () => {
    return !user && getGuestDownloadCount() >= guestDownloadLimit;
  };

  const handleDownload = (fmt) => {
    if (!result || !fmt) return;
    if (isFormatLocked(fmt)) {
      setPendingFormat(fmt);
      setShowAdModal(true);
      setAdCountdown(8);
      return;
    }
    if (isGuestDownloadBlocked()) {
      navigate("/auth");
      return;
    }
    executeDownload(fmt);
  };

  const handleAdContinue = () => {
    setShowAdModal(false);
    if (pendingFormat) {
      executeDownload(pendingFormat);
      setPendingFormat(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setUserMenuOpen(false);
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F9]">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100/50 bg-white/70 backdrop-blur-2xl shadow-sm shadow-black/5">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt={settings.siteName || "Zinvid"} className="h-9 w-auto" />
            ) : (
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 shadow-lg shadow-brand-500/20 ring-1 ring-white/20">
                <Download className="h-5 w-5 text-white" />
              </div>
            )}
            <div>
              <span className="text-lg font-extrabold text-gray-900 tracking-tight">
                {settings.siteName || "Zinvid"}
              </span>
              <span className="hidden sm:inline text-[10px] font-medium text-brand-500 bg-brand-100 px-1.5 py-0.5 rounded-full ml-2 align-middle">
                v2.0
              </span>
            </div>
          </div>

          <div className="hidden items-center gap-0.5 md:flex">
            {["Features", "Pricing", "FAQ"].map((item, i) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="group relative rounded-xl px-4 py-2 text-sm font-medium text-gray-500 transition-all hover:text-gray-900"
              >
                {item}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-300 group-hover:w-4/5" />
              </button>
            ))}
            <div className="w-px h-5 bg-gray-200 mx-2" />
            <button
              onClick={() => scrollToSection("pricing")}
              className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 transition-all"
            >
              <Crown className="h-4 w-4" />
              Subscribe
            </button>
            <div className="w-px h-5 bg-gray-200 mx-2" />
            <a href="/download-conditions" className="rounded-xl px-4 py-2 text-sm font-medium text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100/60">
              Conditions
            </a>
            <a href="/about" className="rounded-xl px-4 py-2 text-sm font-medium text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100/60">
              About
            </a>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <>
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-xs font-bold text-white shadow-lg shadow-brand-500/20 transition-all hover:shadow-xl hover:scale-105 active:scale-95 ring-1 ring-white/20"
                >
                  {(user.name || user.email || "U")[0].toUpperCase()}
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-12 w-56 rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-gray-100/80 backdrop-blur-2xl origin-top-right animate-scale-in">
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5 capitalize">{user.role?.toLowerCase() || "User"}</p>
                    </div>
                    <div className="py-1">
                      {user.role === "ADMIN" && (
                        <button onClick={() => navigate("/admin")} className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-gray-600 transition-all hover:bg-brand-50 hover:text-brand-700 group">
                          <Shield className="h-4 w-4 text-gray-400 group-hover:text-brand-500 transition-colors" />
                          <span>Admin Panel</span>
                        </button>
                      )}
                      <button onClick={() => navigate("/download-conditions")} className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-gray-600 transition-all hover:bg-gray-50 hover:text-gray-900 group">
                        <Clock className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                        <span>Download History</span>
                      </button>
                      <hr className="my-1 mx-2 border-gray-50" />
                      <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-red-500 transition-all hover:bg-red-50 group">
                        <LogIn className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => scrollToSection("pricing")}
                className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 shadow-sm transition-all hover:bg-amber-100 hover:scale-105 active:scale-95"
                title="Upgrade Plan"
              >
                <Crown className="h-4 w-4" />
              </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/auth")}
                  className="hidden sm:inline-flex rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/auth")}
                  className="btn-shimmer inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-brand-500/20 transition-all hover:shadow-xl hover:scale-105 active:scale-95"
                >
                  <Download className="h-4 w-4" />
                  <span>Get Started</span>
                </button>
              </div>
            )}
            <button onClick={() => setMenuOpen(true)} className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-50 backdrop-blur-2xl bg-white/95 animate-fade-in">
          <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100/80">
            <div className="flex items-center gap-2.5">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt={settings.siteName || "Zinvid"} className="h-8 w-auto" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-accent-500 shadow-lg">
                  <Download className="h-4 w-4 text-white" />
                </div>
              )}
              <span className="text-lg font-extrabold text-gray-900">{settings.siteName || "Zinvid"}</span>
            </div>
            <button onClick={() => setMenuOpen(false)} className="flex items-center justify-center w-9 h-9 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-5 space-y-1">
            {["Features", "Pricing", "FAQ"].map((item) => (
              <button
                key={item}
                onClick={() => { scrollToSection(item.toLowerCase()); setMenuOpen(false); }}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-brand-50 hover:to-accent-50 hover:text-gray-900 transition-all group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-300 group-hover:bg-brand-500 transition-colors" />
                {item}
              </button>
            ))}
            <hr className="my-3 border-gray-100" />
            <button onClick={() => { scrollToSection("pricing"); setMenuOpen(false); }} className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 transition-all mb-2">
              <Crown className="h-4 w-4 flex-shrink-0" />
              <span>Upgrade Plan</span>
            </button>
            <a href="/download-conditions" className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
              <ExternalLink className="h-4 w-4 text-gray-400" />
              Conditions
            </a>
            <a href="/about" className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
              <ExternalLink className="h-4 w-4 text-gray-400" />
              About
            </a>
            <div className="mt-6">
              {user ? (
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="w-full rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-4 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-red-500/20">
                  Sign Out
                </button>
              ) : (
                <button onClick={() => { setMenuOpen(false); navigate("/auth"); }} className="w-full rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 px-4 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-brand-500/20">
                  <span className="flex items-center justify-center gap-2">
                    <Download className="h-4 w-4" />
                    Get Started Free
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <section ref={heroRef} className="relative min-h-[100vh] flex items-center overflow-hidden pt-24 pb-0 sm:pt-28 sm:pb-0">

        <div className="pointer-events-none absolute inset-0 bg-noise" />

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239333ea' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12] transition-opacity duration-1000"
          style={{
            background: `radial-gradient(800px circle at ${cursorPos.x * 100}% ${cursorPos.y * 100}%, rgba(168,85,247,0.3), rgba(236,72,153,0.15), transparent 60%)`,
          }}
        />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-brand-400/15 blur-[150px] animate-drift-slow" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-accent-400/15 blur-[150px] animate-drift" style={{ animationDelay: '-3s' }} />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-amber-400/10 blur-[120px] animate-glow-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-brand-600/10 blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="pointer-events-none absolute inset-0">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="absolute animate-particle" style={{
              left: `${Math.random() * 100}%`,
              bottom: '-10px',
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 8}s`,
            }}>
              <div className={`w-${(i % 3) + 1} h-${(i % 3) + 1} rounded-full ${i % 3 === 0 ? 'bg-brand-400' : i % 3 === 1 ? 'bg-accent-400' : 'bg-amber-400'}`} style={{ opacity: 0.3 + Math.random() * 0.4 }} />
            </div>
          ))}
        </div>

        <div className="hidden lg:block pointer-events-none absolute inset-0">
          <div className="absolute left-[8%] top-[15%] animate-orbit" style={{ animationDuration: '14s' }}>
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/80 backdrop-blur-xl shadow-xl ring-1 ring-black/5 hover:scale-125 transition-transform duration-500">
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-red-500">
                <path d="M23.5 6.2c-.3-1.1-1.1-1.9-2.2-2.2C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.3.5C1.6 4.3.8 5.1.5 6.2 0 8 0 12 0 12s0 4 .5 5.8c.3 1.1 1.1 1.9 2.2 2.2 1.8.5 9.3.5 9.3.5s7.5 0 9.3-.5c1.1-.3 1.9-1.1 2.2-2.2.5-1.8.5-5.8.5-5.8s0-4-.5-5.8zM9.5 15.5V8.5l6.2 3.5-6.2 3.5z"/>
              </svg>
            </div>
          </div>
          <div className="absolute right-[6%] top-[20%] animate-orbit-reverse" style={{ animationDuration: '18s' }}>
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/80 backdrop-blur-xl shadow-xl ring-1 ring-black/5 hover:scale-125 transition-transform duration-500">
              <svg viewBox="0 0 24 24" className="w-7 h-7">
                <defs><linearGradient id="igGrad1" x1="0" y1="0" x2="24" y2="24"><stop offset="0" stopColor="#f58529"/><stop offset="0.5" stopColor="#dd2a7b"/><stop offset="1" stopColor="#8134af"/></linearGradient></defs>
                <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#igGrad1)"/>
                <circle cx="12" cy="12" r="5" fill="none" stroke="white" strokeWidth="1.5"/>
                <circle cx="17.5" cy="6.5" r="1.5" fill="white"/>
              </svg>
            </div>
          </div>
          <div className="absolute left-[12%] bottom-[25%] animate-orbit-reverse" style={{ animationDuration: '20s' }}>
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/80 backdrop-blur-xl shadow-xl ring-1 ring-black/5 hover:scale-125 transition-transform duration-500">
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-gray-900">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </div>
          </div>
          <div className="absolute right-[10%] bottom-[20%] animate-orbit" style={{ animationDuration: '16s' }}>
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/80 backdrop-blur-xl shadow-xl ring-1 ring-black/5 hover:scale-125 transition-transform duration-500">
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-blue-600">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
          </div>
          <div className="absolute left-[5%] top-[45%] animate-float" style={{ animationDelay: '-1s' }}>
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/70 backdrop-blur-md shadow-lg ring-1 ring-black/5">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-blue-500">
                <path d="M17.9 4.5H6.1C3.8 4.5 2 6.4 2 8.7v6.6c0 2.3 1.8 4.2 4.1 4.2h11.8c2.3 0 4.1-1.9 4.1-4.2V8.7c0-2.3-1.8-4.2-4.1-4.2zM9.5 16V8l6.5 4-6.5 4z"/>
              </svg>
            </div>
          </div>
          <div className="absolute right-[4%] top-[50%] animate-float" style={{ animationDelay: '-3s' }}>
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/70 backdrop-blur-md shadow-lg ring-1 ring-black/5">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-gray-700">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="relative w-full z-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="text-center lg:text-left">

                <div className="animate-fade-in-up">
                  <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500/10 via-accent-500/10 to-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-500/20 backdrop-blur-sm mb-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-gradient" />
                    <Sparkles className="h-3.5 w-3.5 text-brand-500 relative" />
                    <span className="relative">Free video downloader — no sign-up required</span>
                  </div>

                  <h1 className="text-5xl font-black tracking-tight text-gray-900 sm:text-6xl lg:text-7xl leading-[1.05]">
                    <span className="inline-block animate-reveal-text">Download Videos</span>
                    <br className="hidden sm:block" />
                    <span className="inline-block animate-reveal-text" style={{ animationDelay: '0.3s' }}>from{" "}</span>
                    <span className="gradient-text inline-block relative animate-reveal-text" style={{ animationDelay: '0.5s' }}>
                      {platformNames[platformIndex]}
                      <span className="absolute -right-3 bottom-0 w-1.5 h-[85%] bg-brand-500 rounded-full animate-typing-cursor" />
                    </span>
                  </h1>

                  <p className="mx-auto mt-6 max-w-lg text-lg sm:text-xl text-gray-500 leading-relaxed lg:mx-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    Paste any URL. Download in HD, 4K, even 8K. 
                    Fast, free, and works everywhere.
                  </p>
                </div>

                <div className="mt-10 max-w-lg animate-slide-up delay-200 lg:mx-0">
                  <form onSubmit={handleSubmit} className="group relative">
                    <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-brand-400 via-accent-400 to-brand-400 opacity-0 blur-xl transition-all duration-500 group-hover:opacity-80 group-focus-within:opacity-100 animate-tilt-glow" />
                    <div className="relative flex items-center gap-2 rounded-2xl border border-gray-200/80 bg-white/90 backdrop-blur-xl p-1.5 shadow-2xl shadow-brand-500/10 ring-1 ring-gray-200/50 transition-all duration-300 group-hover:shadow-brand-500/25 group-focus-within:ring-brand-400/50 group-focus-within:shadow-brand-500/20 group-focus-within:border-brand-300/50">
                      <div className="flex flex-1 items-center gap-3 px-4">
                        <Search className="h-5 w-5 text-gray-400 transition-all duration-300 group-focus-within:text-brand-500 group-focus-within:scale-110" />
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          placeholder="Paste video URL here..."
                          className="flex-1 border-0 bg-transparent py-3 text-sm outline-none placeholder:text-gray-400"
                          required
                        />
                        <button type="button" onClick={handlePaste} className="text-xs font-semibold text-brand-600 hover:text-brand-700 whitespace-nowrap transition-all hover:scale-105 active:scale-95">
                          <div className="flex items-center gap-1">
                            <div className="w-1 h-3 rounded-full bg-brand-300" />
                            Paste
                          </div>
                        </button>
                      </div>
                      <button
                        type="submit"
                        disabled={loading || !url.trim()}
                        className="btn-shimmer flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 whitespace-nowrap relative overflow-hidden group/btn"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                        {loading ? "Processing..." : "Download"}
                      </button>
                    </div>
                  </form>

                  <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-400 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <span className="flex items-center gap-1.5 group">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                      </span>
                      No account needed
                    </span>
                    <span className="flex items-center gap-1.5 group">
                      <Download className="w-3.5 h-3.5 text-brand-400 transition-transform group-hover:scale-110 group-hover:-translate-y-0.5" />
                      Unlimited free downloads
                    </span>
                    <span className="flex items-center gap-1.5 group">
                      <Shield className="w-3.5 h-3.5 text-emerald-400 transition-transform group-hover:scale-110" />
                      100% safe & secure
                    </span>
                  </div>
                </div>

                {error && (
                  <div className="mt-6 max-w-lg animate-scale-in">
                    <div className="rounded-2xl bg-red-50/90 backdrop-blur-sm border border-red-200/50 p-4 text-sm text-red-600 flex items-center gap-3 shadow-lg shadow-red-500/5">
                      <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center animate-pulse">
                        <X className="w-4 h-4 text-red-500" />
                      </div>
                      {error}
                    </div>
                  </div>
                )}

                {result && (
                  <div className="mt-8 max-w-lg animate-scale-in">
                    <div className="relative group/card">
                      <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-brand-400 via-accent-400 to-brand-400 opacity-0 blur-xl transition-all duration-500 group/card:hover:opacity-80 animate-tilt-glow" />
                      <div className="relative rounded-2xl bg-white/80 backdrop-blur-2xl p-6 shadow-2xl shadow-brand-500/10 ring-1 ring-gray-200/40 overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-green-400/10 to-transparent rounded-bl-full" />
                        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-tr from-brand-400/5 to-transparent rounded-tr-full" />
                        <div className="flex items-center gap-4 mb-6 relative">
                          <div className="relative">
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 blur-md opacity-60 animate-pulse" />
                            <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-500/30 animate-float" style={{ animationDuration: '3s' }}>
                              <Check className="h-6 w-6 text-white" />
                            </div>
                          </div>
                          <div className="text-left flex-1 min-w-0">
                            <p className="font-bold text-gray-900 truncate">{result.title || "Video ready"}</p>
                            <p className="text-xs text-gray-400 capitalize flex items-center gap-1.5 mt-0.5">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
                              </span>
                              {result.platform}
                            </p>
                          </div>
                        </div>
                        {formatOptions.length > 0 ? (
                          <div className="space-y-3 relative">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-1 h-4 rounded-full bg-gradient-to-b from-brand-500 to-accent-500" />
                                <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Select format</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {!user && (
                                  <div className="text-[10px] font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full ring-1 ring-brand-200/50 whitespace-nowrap">
                                    {guestDownloadLimit - getGuestDownloadCount()}/{guestDownloadLimit} free
                                  </div>
                                )}
                                {!isPro && (
                                  <button
                                    onClick={() => user ? scrollToSection("pricing") : navigate("/auth")}
                                    className="relative group/badge overflow-hidden text-[10px] font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-full transition-all hover:scale-105 active:scale-95 ring-1 ring-amber-200/50"
                                  >
                                    <Rocket className="h-3 w-3 inline mr-0.5" />
                                    Pro for 4K
                                  </button>
                                )}
                              </div>
                            </div>
                            {formatOptions.map((fmt, i) => {
                              const locked = isFormatLocked(fmt);
                              const isHighQuality = ["4K", "1440p", "2160p", "8K"].includes(fmt.quality);
                              const is1080p = fmt.quality === "1080p";
                              return (
                                <button
                                  key={i}
                                  onClick={() => { if (!locked) handleDownload(fmt); }}
                                  disabled={locked}
                                  className="group/btn relative flex w-full items-center justify-between rounded-xl border border-gray-100/80 bg-white/50 backdrop-blur-sm p-4 text-left transition-all duration-300 hover:border-brand-200/60 hover:bg-brand-50/80 hover:shadow-lg hover:shadow-brand-500/5 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none disabled:hover:border-gray-100/80 disabled:hover:bg-white/50"
                                  style={{ animationDelay: `${i * 0.06}s` }}
                                >
                                  {locked && (
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gray-400/5 to-gray-400/5 backdrop-blur-[1px]" />
                                  )}
                                  <div className="flex items-center gap-3.5 relative">
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 group-hover/btn:scale-110 group-hover/btn:-translate-y-0.5 ${locked ? 'bg-gray-100' : isHighQuality ? 'bg-gradient-to-br from-amber-100 to-orange-100' : 'bg-gradient-to-br from-brand-100 to-accent-100'}`}>
                                      {locked ? <Lock className={`h-4 w-4 text-gray-400`} /> : downloadingFormat === fmt.quality + fmt.format ? <Loader2 className="h-4 w-4 animate-spin text-brand-600" /> : <Download className={`h-4 w-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 ${isHighQuality ? 'text-amber-600' : 'text-brand-600'}`} />}
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <p className={`text-sm font-bold ${locked ? 'text-gray-400' : 'text-gray-900'}`}>{fmt.quality}</p>
                                        {isHighQuality && !locked && <Sparkles className="h-3 w-3 text-amber-500" />}
                                      </div>
                                      <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                                        <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-gray-100 text-gray-500">{fmt.format.toUpperCase()}</span>
                                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                                        <span>{fmt.size}</span>
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 relative">
                                    {is1080p && !locked && (
                                      <span className="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-200/50 px-2 py-0.5 rounded-full shadow-sm">Popular</span>
                                    )}
                                    {locked ? (
                                      <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-600 to-accent-500 px-3 py-1 text-[9px] font-bold text-white shadow-lg shadow-brand-500/20">
                                        <Crown className="h-2.5 w-2.5" />
                                        Pro
                                      </div>
                                    ) : (
                                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300 group-hover/btn:scale-110 ${isHighQuality ? 'bg-amber-100/50 group-hover/btn:bg-amber-200/50' : 'bg-brand-100/50 group-hover/btn:bg-brand-200/50'}`}>
                                        {downloadingFormat === fmt.quality + fmt.format ? <Loader2 className="h-4 w-4 animate-spin text-brand-600" /> : <Download className={`h-4 w-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 ${isHighQuality ? 'text-amber-600' : 'text-brand-600'}`} />}
                                      </div>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center py-8 relative">
                            <div className="relative">
                              <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
                              <div className="absolute inset-0 h-6 w-6 animate-ping rounded-full bg-brand-400/20" />
                            </div>
                            <span className="ml-3 text-sm text-gray-500 font-medium">{fetchMessage || "Fetching available formats..."}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="hidden lg:flex items-center gap-10 mt-12 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                  {[
                    { value: "50+", label: "Platforms", color: "from-brand-400 to-accent-400", icon: Globe },
                    { value: "10M+", label: "Downloads", color: "from-emerald-400 to-teal-400", icon: Download },
                    { value: "4.9", label: "User Rating", color: "from-amber-400 to-orange-400", icon: Star },
                  ].map((stat, i) => (
                    <div key={stat.label} className="group/card text-center relative">
                      <div className="absolute -inset-3 bg-gradient-to-br from-white/0 via-white/40 to-white/0 rounded-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 blur-xl" />
                      <div className={`text-2xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent relative transition-transform duration-300 group-hover/card:scale-110`}>
                        <stat.icon className="h-5 w-5 inline mr-1.5 opacity-50 group-hover/card:opacity-100 transition-opacity" />
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-400 font-medium mt-0.5 relative">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden lg:block animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="relative perspective-[1000px]">
                  <div className="absolute -inset-6 bg-gradient-to-br from-brand-400/20 via-accent-400/10 to-brand-400/20 rounded-3xl blur-3xl animate-glow-pulse" />
                  <div
                    className="relative transition-transform duration-500 ease-out"
                    onMouseMove={(e) => {
                      const el = e.currentTarget;
                      const rect = el.getBoundingClientRect();
                      const x = (e.clientX - rect.left) / rect.width - 0.5;
                      const y = (e.clientY - rect.top) / rect.height - 0.5;
                      el.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
                    }}
                  >
                    <div className="rounded-3xl bg-white/80 backdrop-blur-2xl shadow-2xl ring-1 ring-gray-200/50 overflow-hidden">
                      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100/80 bg-gradient-to-r from-gray-50/50 to-white/50">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-400" />
                          <div className="w-3 h-3 rounded-full bg-amber-400" />
                          <div className="w-3 h-3 rounded-full bg-green-400" />
                        </div>
                        <div className="flex-1 mx-4">
                          <div className="bg-gray-100/80 rounded-full px-3 py-1.5 text-[10px] text-gray-400 text-center truncate flex items-center justify-center gap-2">
                            <Lock className="h-2.5 w-2.5 text-green-500" />
                            zinvid.com/download
                          </div>
                        </div>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-red-50 to-red-100/50 border border-red-200/30 animate-float" style={{ animationDuration: '5s' }}>
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 shadow-sm">
                            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-red-500">
                              <path d="M23.5 6.2c-.3-1.1-1.1-1.9-2.2-2.2C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.3.5C1.6 4.3.8 5.1.5 6.2 0 8 0 12 0 12s0 4 .5 5.8c.3 1.1 1.1 1.9 2.2 2.2 1.8.5 9.3.5 9.3.5s7.5 0 9.3-.5c1.1-.3 1.9-1.1 2.2-2.2.5-1.8.5-5.8.5-5.8s0-4-.5-5.8zM9.5 15.5V8.5l6.2 3.5-6.2 3.5z"/>
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-gray-900 truncate">Amazing Nature Tour - 4K HDR</div>
                            <div className="text-[10px] text-gray-400 flex items-center gap-2 mt-0.5">
                              <span>YouTube</span>
                              <span className="w-1 h-1 rounded-full bg-gray-300" />
                              <span>12:34</span>
                              <span className="w-1 h-1 rounded-full bg-gray-300" />
                              <span>4.2M views</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50/50 border border-brand-100/50 transition-all duration-300 hover:shadow-md hover:border-brand-200 cursor-default">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
                                <Download className="w-4 h-4 text-brand-600" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-gray-900">4K Ultra HD</div>
                                <div className="text-[10px] text-gray-400 flex items-center gap-1.5">
                                  <span>MP4</span>
                                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                                  <span>342 MB</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200/50 px-2.5 py-1 rounded-full">Pro</span>
                              <div className="w-6 h-6 rounded-lg bg-brand-100 flex items-center justify-center">
                                <ArrowRight className="w-3 h-3 text-brand-600" />
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/80 border border-gray-100 transition-all duration-300 hover:shadow-md hover:border-gray-200 cursor-default">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                                <Download className="w-4 h-4 text-emerald-600" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-gray-900">1080p HD</div>
                                <div className="text-[10px] text-gray-400 flex items-center gap-1.5">
                                  <span>MP4</span>
                                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                                  <span>124 MB</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-semibold text-green-600 bg-green-50 border border-green-200/50 px-2.5 py-1 rounded-full">Free</span>
                              <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center">
                                <ArrowRight className="w-3 h-3 text-gray-400" />
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50/50 border border-orange-100/50 transition-all duration-300 hover:shadow-md hover:border-orange-200 cursor-default">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-100 to-amber-200 flex items-center justify-center">
                                <Music2 className="w-4 h-4 text-orange-600" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-gray-900">MP3 Audio</div>
                                <div className="text-[10px] text-gray-400 flex items-center gap-1.5">
                                  <span>320kbps</span>
                                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                                  <span>8.2 MB</span>
                                </div>
                              </div>
                            </div>
                            <div className="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center">
                              <ArrowRight className="w-3 h-3 text-orange-500" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-gradient-to-r from-brand-400/0 via-brand-400/20 to-brand-400/0 blur-xl animate-glow-pulse" style={{ animationDelay: '1s' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="relative mx-auto mt-16 max-w-4xl px-4 animate-fade-in-up pb-12 sm:pb-16" style={{ animationDelay: '0.8s' }}>
            <div className="flex flex-wrap justify-center gap-3">
              {platforms.slice(0, 8).map((p, i) => (
                <div
                  key={p.name}
                  className="group/platform relative flex items-center gap-2.5 rounded-full bg-white/70 backdrop-blur-md border border-white/60 px-4 py-2 text-xs font-medium text-gray-500 shadow-lg shadow-black/5 transition-all duration-500 hover:shadow-xl hover:shadow-brand-500/15 hover:scale-110 hover:bg-white/90 hover:text-gray-900 hover:border-brand-200/50"
                  style={{
                    animationDelay: `${i * 0.08 + 0.3}s`,
                    transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-400/0 via-brand-400/5 to-accent-400/0 opacity-0 group-hover/platform:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover/platform:opacity-100 transition-all duration-500" style={{ boxShadow: '0 0 20px rgba(168,85,247,0.2), 0 0 40px rgba(168,85,247,0.1)' }} />
                  <div className={`relative h-7 w-7 rounded-full ${p.color} flex items-center justify-center shadow-inner transition-all duration-500 group-hover/platform:scale-110 group-hover/platform:-rotate-12 group-hover/platform:shadow-lg`}>
                    <p.icon />
                  </div>
                  <span className="relative font-semibold tracking-tight">{p.name}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500/10 to-accent-500/10 border border-brand-200/30 px-4 py-2 text-xs font-semibold text-brand-600">
                <span className="flex -space-x-1.5">
                  {["bg-red-500", "bg-gradient-to-br from-purple-500 to-pink-500", "bg-gray-900"].map((c, i) => (
                    <div key={i} className={`w-4 h-4 rounded-full ${c} ring-2 ring-white`} />
                  ))}
                </span>
                +50 more
              </div>
            </div>
          </div>

          <div className="flex justify-center pb-10 animate-fade-in" style={{ animationDelay: '1.5s' }}>
            <div className="flex flex-col items-center gap-2 text-gray-300 group cursor-pointer" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
              <span className="text-[10px] font-medium tracking-widest uppercase group-hover:text-gray-400 transition-colors">Explore</span>
              <div className="relative">
                <ChevronDown className="w-5 h-5 animate-scroll-bounce" />
                <div className="absolute -inset-3 rounded-full bg-brand-400/5 animate-ping" style={{ animationDuration: '2s' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {trending.length > 0 && (
        <section className="py-16 sm:py-24 relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-brand-50/30 via-transparent to-transparent" />
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="absolute animate-particle" style={{
                left: `${5 + (i * 7) % 90}%`,
                bottom: '-10px',
                animationDelay: `${(i * 0.7) % 10}s`,
                animationDuration: `${8 + (i % 5) * 2}s`,
              }}>
                <div className={`w-${(i % 3) + 1} h-${(i % 3) + 1} rounded-full ${i % 3 === 0 ? 'bg-brand-300' : i % 3 === 1 ? 'bg-accent-300' : 'bg-amber-300'}`} style={{ opacity: 0.15 + (i % 4) * 0.08 }} />
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-brand-400/5 blur-[120px] animate-glow-pulse" />
          <div className="pointer-events-none absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full bg-accent-400/5 blur-[100px] animate-float" style={{ animationDelay: '2s' }} />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-brand-100/80 px-3 py-1 text-xs font-semibold text-brand-700 mb-3 ring-1 ring-brand-200/30 backdrop-blur-sm">
                  <TrendingUp className="h-3 w-3" /> Hot right now
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  Trending <span className="gradient-text">Downloads</span>
                </h2>
                <p className="mt-2 text-sm text-gray-500">Most popular downloads on Zinvid</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {trending.slice(0, 12).map((item, i) => (
                <TrendingCard key={item.id} item={item} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 sm:py-20 relative overflow-hidden bg-gradient-to-b from-transparent via-brand-50/20 to-transparent">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-accent-300/10 blur-[100px]" />
          <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-brand-300/10 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-brand-400/10 via-accent-400/10 to-brand-400/10 rounded-3xl blur-2xl" />
                <div className="relative rounded-2xl bg-white/80 backdrop-blur-xl shadow-2xl ring-1 ring-gray-200/50 overflow-hidden">
                  {!isPro && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 shadow-lg">
                        <Crown className="h-6 w-6 text-amber-600" />
                      </div>
                      <p className="mt-3 text-sm font-bold text-gray-900">Pro Feature</p>
                      <p className="mt-1 text-xs text-gray-500 text-center max-w-[200px]">Upgrade to Pro to download entire playlists</p>
                      <button
                        onClick={() => navigate("/auth")}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 px-4 py-2 text-xs font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95"
                      >
                        <Rocket className="h-3 w-3" />
                        Upgrade to Pro
                      </button>
                    </div>
                  )}
                  <div className={`flex items-center gap-3 px-5 py-3.5 border-b border-gray-100/80 bg-gradient-to-r from-brand-50/50 to-accent-50/50 ${!isPro ? "blur-sm" : ""}`}>
                    <ListMusic className="h-5 w-5 text-brand-600" />
                    <span className="text-sm font-bold text-gray-900">Summer Vibes Playlist</span>
                    <span className="ml-auto text-[10px] font-medium text-gray-400">12 videos</span>
                  </div>
                  <div className={`p-4 space-y-2 ${!isPro ? "blur-sm" : ""}`}>
                    {[
                      { title: "Beach Sunset Tour - 4K", dur: "4:32", size: "156 MB" },
                      { title: "Tropical Mix 2024", dur: "3:45", size: "98 MB" },
                      { title: "Ocean Waves Relaxation", dur: "10:15", size: "420 MB" },
                      { title: "Summer Party Highlights", dur: "6:20", size: "245 MB" },
                      { title: "Island Vlog - Day Trip", dur: "8:10", size: "312 MB" },
                    ].map((v, i) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50/80 hover:bg-brand-50/80 transition-colors group/vid">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-200/80 group-hover/vid:bg-brand-200 transition-colors">
                          <SquarePlay className="h-4 w-4 text-gray-500 group-hover/vid:text-brand-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-900 truncate">{v.title}</p>
                          <p className="text-[10px] text-gray-400">{v.dur} • {v.size}</p>
                        </div>
                        <Check className="h-3.5 w-3.5 text-green-500 opacity-0 group-hover/vid:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                  <div className={`px-4 pb-4 ${!isPro ? "blur-sm" : ""}`}>
                    <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 px-4 py-3 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]">
                      <Download className="h-4 w-4" />
                      Download All (12 Videos)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 px-3 py-1 text-xs font-semibold text-amber-700 mb-4">
                <Crown className="h-3 w-3" /> {isPro ? "Available" : "Pro Feature"}
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl leading-tight">
                Download Entire{" "}
                <span className="gradient-text">Playlists</span>
              </h2>
              <p className="mt-4 text-lg text-gray-500 leading-relaxed">
                Save hours of your time. Download complete playlists from YouTube, 
                SoundCloud, and more with a single click.
              </p>
              <div className="mt-6 space-y-4">
                {[
                  { icon: Zap, title: "Bulk Download", desc: "Download all videos in a playlist at once" },
                  { icon: Film, title: "Choose Formats", desc: "Select quality per video — MP4, MP3, or both" },
                  { icon: Clock, title: "Save Time", desc: "No need to download videos one by one" },
                ].map((benefit) => (
                  <div key={benefit.title} className="flex items-start gap-3.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 flex-shrink-0">
                      <benefit.icon className="h-4.5 w-4.5 text-brand-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{benefit.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              {isPro ? (
                <button className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95 btn-shimmer">
                  Try Playlist Download
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={() => navigate("/auth")}
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95 btn-shimmer"
                >
                  <Crown className="h-4 w-4" />
                  Upgrade to Pro — ৳999/mo
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-100/80 px-3 py-1 text-xs font-semibold text-brand-700 mb-3">
              <Star className="h-3 w-3" /> Why us
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose <span className="gradient-text">Zinvid</span>?
            </h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">The fastest, safest, and most reliable way to download videos from any platform.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="glass-card group rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.gradient} shadow-lg transition-transform group-hover:scale-110`}>
                  <f.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-4 font-bold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600/5 via-accent-500/5 to-brand-600/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-brand-400/10 to-accent-400/10 blur-[150px]" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100/80 px-3 py-1 text-xs font-semibold text-amber-700 mb-4">
            <Gift className="h-3 w-3" /> Limited Time Offer
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
            Unlock <span className="gradient-text">Pro Features</span>
            <br />
            For Just ৳999/month
          </h2>

          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Upgrade to Pro and get unlimited downloads, 4K quality, batch processing, 
            playlist downloads, and priority support.
          </p>

          <div className="mt-10 grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { icon: Crown, title: "4K & 8K Quality", desc: "Crystal clear downloads" },
              { icon: Zap, title: "Unlimited Speed", desc: "No throttling, max speed" },
              { icon: ListMusic, title: "Batch & Playlist", desc: "Download entire playlists" },
            ].map((p) => (
              <div key={p.title} className="rounded-2xl bg-white/70 backdrop-blur-sm p-5 ring-1 ring-gray-200/50 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 hover:bg-white">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-accent-400 shadow-lg mx-auto">
                  <p.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-gray-900">{p.title}</h3>
                <p className="text-xs text-gray-400 mt-1">{p.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                const token = localStorage.getItem("token");
                token ? navigate("/checkout?plan=pro") : navigate("/auth");
              }}
              className="btn-shimmer inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 px-8 py-3.5 text-base font-bold text-white shadow-2xl shadow-brand-500/30 transition-all hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <Rocket className="h-5 w-5" />
              Upgrade to Pro — ৳999/mo
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-8 py-3.5 text-base font-semibold text-gray-600 transition-all hover:bg-gray-50 hover:border-gray-300"
            >
              Compare Plans
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-green-500" /> Cancel anytime
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-green-500" /> No hidden fees
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-green-500" /> 14-day money back
            </span>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-16 sm:py-20 bg-gradient-to-b from-transparent via-brand-50/30 to-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Simple <span className="gradient-text">Pricing</span>
            </h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">Choose the plan that fits your needs. Upgrade anytime.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 mx-auto">
            {plans.map((plan) => (
              <div key={plan.name} className={`relative rounded-3xl bg-white p-6 sm:p-8 shadow-xl ring-1 transition-all duration-300 hover:-translate-y-1 ${plan.popular ? "ring-2 ring-brand-500 scale-105 shadow-2xl" : "ring-gray-100"}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-600 to-accent-500 px-4 py-1 text-xs font-bold text-white shadow-lg">
                    Most Popular
                  </div>
                )}
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${plan.gradient} shadow-lg`}>
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                   <span className="text-4xl font-extrabold text-gray-900">৳{plan.price}</span>
                  <span className="text-sm text-gray-400">/{plan.interval}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => {
                    const token = localStorage.getItem("token");
                    if (token) {
                      navigate(`/checkout?plan=${plan.name.toLowerCase()}`);
                    } else {
                      navigate("/auth");
                    }
                  }}
                  className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl ${
                    plan.popular
                      ? "bg-gradient-to-r from-brand-600 to-accent-500"
                      : "bg-gradient-to-r from-gray-700 to-gray-800"
                  }`}
                >
                  {plan.price === 0 ? "Get Started Free" : "Subscribe Now"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-2xl bg-white ring-1 ring-gray-100 overflow-hidden transition-all">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="flex w-full items-center justify-between p-4 sm:p-5 text-left"
                >
                  <span className="text-sm font-semibold text-gray-900 pr-4">{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 flex-shrink-0 text-gray-400 transition-transform ${activeFaq === i ? "rotate-180" : ""}`} />
                </button>
                {activeFaq === i && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              What Our <span className="gradient-text">Users Say</span>
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="glass-card rounded-2xl p-5 transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-accent-500 text-xs font-bold text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">"{t.text}"</p>
                <div className="mt-3 flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative border-t border-gray-100/80 bg-white/50 backdrop-blur-3xl overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-brand-300/5 blur-[100px]" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-accent-300/5 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-16 md:pb-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3 mb-4">
                {settings.logoUrl ? (
                  <img src={settings.logoUrl} alt={settings.siteName || "Zinvid"} className="h-10 w-auto" />
                ) : (
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 shadow-lg shadow-brand-500/20 ring-1 ring-white/20">
                    <Download className="h-5 w-5 text-white" />
                  </div>
                )}
                <div>
                  <span className="text-base font-extrabold text-gray-900 tracking-tight">{settings.siteName || "Zinvid"}</span>
                  <span className="block text-[10px] font-medium text-brand-500">v2.0</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                Download videos from 50+ platforms. Fast, free, and secure. No account required.
              </p>
              <div className="flex items-center gap-3 mt-5">
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 hover:bg-red-100 transition-all hover:scale-110 hover:shadow-lg hover:shadow-red-200/50 group">
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ boxShadow: '0 0 15px rgba(255,0,0,0.15), 0 0 30px rgba(255,0,0,0.05)' }} />
                  <svg viewBox="0 0 24 24" className="relative h-4 w-4 fill-red-500 group-hover:scale-110 transition-transform">
                    <path d="M23.5 6.2c-.3-1.1-1.1-1.9-2.2-2.2C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.3.5C1.6 4.3.8 5.1.5 6.2 0 8 0 12 0 12s0 4 .5 5.8c.3 1.1 1.1 1.9 2.2 2.2 1.8.5 9.3.5 9.3.5s7.5 0 9.3-.5c1.1-.3 1.9-1.1 2.2-2.2.5-1.8.5-5.8.5-5.8s0-4-.5-5.8zM9.5 15.5V8.5l6.2 3.5-6.2 3.5z"/>
                  </svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-pink-50 hover:bg-pink-100 transition-all hover:scale-110 hover:shadow-lg hover:shadow-pink-200/50 group">
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ boxShadow: '0 0 15px rgba(221,42,123,0.15), 0 0 30px rgba(221,42,123,0.05)' }} />
                  <svg viewBox="0 0 24 24" className="relative h-4 w-4 group-hover:scale-110 transition-transform">
                    <defs><linearGradient id="igGrad" x1="0" y1="0" x2="24" y2="24"><stop offset="0" stopColor="#f58529"/><stop offset="0.5" stopColor="#dd2a7b"/><stop offset="1" stopColor="#8134af"/></linearGradient></defs>
                    <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#igGrad)"/>
                    <circle cx="12" cy="12" r="5" fill="none" stroke="white" strokeWidth="1.5"/>
                    <circle cx="17.5" cy="6.5" r="1.5" fill="white"/>
                  </svg>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 hover:bg-blue-100 transition-all hover:scale-110 hover:shadow-lg hover:shadow-blue-200/50 group">
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ boxShadow: '0 0 15px rgba(59,130,246,0.15), 0 0 30px rgba(59,130,246,0.05)' }} />
                  <svg viewBox="0 0 24 24" className="relative h-4 w-4 fill-blue-600 group-hover:scale-110 transition-transform">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-all hover:scale-110 hover:shadow-lg hover:shadow-gray-300/50 group">
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ boxShadow: '0 0 15px rgba(0,0,0,0.1), 0 0 30px rgba(0,0,0,0.05)' }} />
                  <svg viewBox="0 0 24 24" className="relative h-4 w-4 fill-gray-900 group-hover:scale-110 transition-transform">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">Product</h4>
              <div className="space-y-3">
                {["Features", "Pricing", "FAQ"].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="block text-sm text-gray-400 hover:text-gray-900 transition-colors duration-200 font-medium"
                  >
                    {item}
                  </button>
                ))}
                <a href="/download-conditions" className="block text-sm text-gray-400 hover:text-gray-900 transition-colors duration-200 font-medium">
                  Download Conditions
                </a>
              </div>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">Company</h4>
              <div className="space-y-3">
                {["About", "Privacy Policy", "Terms of Service", "Contact Us"].map((item) => (
                  <a
                    key={item}
                    href={item === "Contact Us" ? "mailto:hello@zinvid.com" : `/${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="block text-sm text-gray-400 hover:text-gray-900 transition-colors duration-200 font-medium"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">Stay Updated</h4>
              <p className="text-sm text-gray-400 mb-4">Get the latest features and platform updates.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-brand-400/30 focus:border-brand-400 placeholder:text-gray-300"
                />
                <button className="flex items-center justify-center rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-500/20 transition-all hover:shadow-xl hover:scale-105 active:scale-95 whitespace-nowrap">
                  <Sparkles className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-4 mt-5 text-xs text-gray-400">
                <a href="/privacy" className="hover:text-gray-600 transition-colors">Privacy</a>
                <span>•</span>
                <a href="/terms" className="hover:text-gray-600 transition-colors">Terms</a>
                <span>•</span>
                <a href="mailto:hello@zinvid.com" className="hover:text-gray-600 transition-colors">Support</a>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100/80">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-gray-400">
                &copy; {new Date().getFullYear()} {settings.siteName || "Zinvid"}. All rights reserved.
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-300">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  All systems operational
                </span>
                <span className="hidden sm:inline">|</span>
                <span className="hidden sm:inline">Made with <span className="text-red-400">&hearts;</span> for creators</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-2xl border-t border-gray-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] safe-bottom">
        <div className="flex items-center justify-around h-14">
          {[
            { label: "Home", icon: Download, action: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
            { label: "Features", icon: Zap, action: () => scrollToSection("features") },
            { label: "Pricing", icon: Crown, action: () => scrollToSection("pricing") },
            { label: "FAQ", icon: MessageCircle, action: () => scrollToSection("faq") },
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-gray-400 hover:text-brand-600 transition-colors active:scale-95"
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[9px] font-semibold">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {showAdModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative mx-4 w-full max-w-lg animate-fade-in">
            <div className="rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl ring-1 ring-gray-200/50 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100">
                    <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                  </div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Advertisement</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-6 items-center rounded-full bg-amber-50 px-2.5 text-[10px] font-bold text-amber-700">
                    {adCountdown > 0 ? `${adCountdown}s` : "Ready"}
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-8 ring-1 ring-gray-200/50">
                  {(settings.monetag_adCode || settings.adsterra_adCode) ? (
                    <div
                      className="w-full text-xs"
                      dangerouslySetInnerHTML={{ __html: settings.monetag_adCode || settings.adsterra_adCode }}
                    />
                  ) : (
                    <>
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-accent-100">
                        <Sparkles className="h-7 w-7 text-brand-600" />
                      </div>
                      <p className="mt-4 text-sm font-bold text-gray-800">Support Zinvid</p>
                      <p className="mt-1 text-xs text-gray-400 text-center max-w-xs">
                        Please wait while we load content. Your download will start automatically.
                      </p>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50/80">
                <p className="text-[10px] text-gray-400">
                  {adCountdown > 0 ? "Please wait..." : "You may continue"}
                </p>
                <button
                  onClick={handleAdContinue}
                  disabled={adCountdown > 0}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 px-4 py-2 text-xs font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {adCountdown > 0 ? `Continue in ${adCountdown}s` : "Continue to Download"}
                  <Download className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!user && (
        <div className="fixed bottom-6 right-6 z-40 animate-slide-up">
          <button
            onClick={() => navigate("/auth")}
            className="group flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-brand-600 to-accent-500 px-5 py-3 text-sm font-bold text-white shadow-2xl shadow-brand-500/30 transition-all hover:shadow-xl hover:scale-105 active:scale-95 btn-shimmer"
          >
            <Rocket className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
            <span>Upgrade to Pro</span>
            <span className="text-[10px] text-white/70 bg-white/15 rounded-full px-2 py-0.5">৳999</span>
          </button>
        </div>
      )}
    </div>
  );
}
