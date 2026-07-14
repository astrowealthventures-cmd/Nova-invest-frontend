import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CryptoTicker from "@/components/CryptoTicker";
import {
  ShieldCheck,
  TrendUp,
  Lightning,
  Vault,
  ChartLineUp,
  Globe,
  ArrowRight,
  Check,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { http, money } from "@/lib/api";

const HERO_BG =
  "https://images.pexels.com/photos/14240656/pexels-photo-14240656.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

const AVATARS = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=srgb&fm=jpg&q=85&w=200",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=srgb&fm=jpg&q=85&w=200",
  "https://images.pexels.com/photos/26872232/pexels-photo-26872232.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
];

export default function Landing() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    http.get("/plans").then(({ data }) => setPlans(data)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar transparent />

      {/* Hero */}
      <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-40" />
        <img
          src={HERO_BG}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/40 to-[#050505]" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-10 pt-10 md:pt-20">
          <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-mono text-zinc-300 mb-8 animate-in">
            <span className="w-1.5 h-1.5 bg-[#F0A83E] rounded-full pulse-glow" />
            LIVE · $2.4B under management
          </div>

          <h1 className="font-display font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95] max-w-5xl animate-in">
            Wealth, engineered
            <br />
            for the <span className="text-[#F0A83E]">next decade.</span>
          </h1>

          <p className="mt-8 text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed animate-in">
            Algorithmic yield strategies, on-chain transparency, institutional
            custody. Deposit crypto, watch it compound — daily.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4 animate-in">
            <Link
              to="/signup"
              data-testid="hero-cta-signup"
              className="group inline-flex items-center gap-2 bg-[#F0A83E] text-black font-semibold px-6 py-4 hover:bg-[#FFBC5C] transition-colors glow-btn"
            >
              Open account
              <ArrowRight
                size={18}
                weight="bold"
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <a
              href="#plans"
              data-testid="hero-cta-plans"
              className="inline-flex items-center gap-2 border border-white/15 hover:border-white/40 px-6 py-4 transition-colors"
            >
              Explore plans
            </a>
          </div>

          {/* stat grid */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 border border-white/5">
            {[
              ["$2.4B", "Assets under mgmt"],
              ["48K+", "Active investors"],
              ["4.9/5", "Trust rating"],
              ["99.99%", "Uptime"],
            ].map(([v, l]) => (
              <div key={l} className="bg-[#050505] p-6 md:p-8">
                <div className="font-mono text-3xl md:text-4xl font-bold">{v}</div>
                <div className="text-xs uppercase tracking-widest text-zinc-500 mt-2">
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div id="stats">
        <CryptoTicker />
      </div>

      {/* Features */}
      <section id="features" className="py-24 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-widest text-[#F0A83E] font-mono mb-4">
              ◆ Built different
            </div>
            <h2 className="font-display font-bold text-4xl md:text-6xl tracking-tight">
              The infrastructure of{" "}
              <span className="text-zinc-500">modern wealth.</span>
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-6 gap-4">
            <FeatureCard
              className="md:col-span-3 md:row-span-2"
              icon={<Vault size={32} weight="duotone" />}
              title="Institutional custody"
              body="Assets segregated in Fireblocks-secured cold storage. Multi-sig withdrawals, insured up to $250M by Lloyd's of London."
              big
            />
            <FeatureCard
              className="md:col-span-3"
              icon={<Lightning size={28} weight="duotone" />}
              title="Instant deposits"
              body="BTC, ETH, USDT confirmed in minutes. Zero platform fees."
            />
            <FeatureCard
              className="md:col-span-3"
              icon={<TrendUp size={28} weight="duotone" />}
              title="Compounding yields"
              body="Daily ROI up to 3.4% — auto-reinvested or withdrawn on demand."
            />
            <FeatureCard
              className="md:col-span-2"
              icon={<ShieldCheck size={28} weight="duotone" />}
              title="SOC-2 audited"
            />
            <FeatureCard
              className="md:col-span-2"
              icon={<Globe size={28} weight="duotone" />}
              title="180+ countries"
            />
            <FeatureCard
              className="md:col-span-2"
              icon={<ChartLineUp size={28} weight="duotone" />}
              title="Real-time analytics"
            />
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="py-24 md:py-32 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <div className="text-xs uppercase tracking-widest text-[#F0A83E] font-mono mb-4">
                ◆ Investment tiers
              </div>
              <h2 className="font-display font-bold text-4xl md:text-6xl tracking-tight">
                Pick your <span className="text-[#F0A83E]">strategy.</span>
              </h2>
            </div>
            <p className="text-zinc-400 max-w-md">
              Four tiers designed for every investor — from first-timers to
              institutional whales. Withdraw anytime after your lock period.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((p) => (
              <div
                key={p.id}
                data-testid={`landing-plan-${p.id}`}
                className={`relative p-8 hairline bg-[#0A0A0A] transition-colors ${
                  p.highlight
                    ? "border-[#F0A83E] shadow-[0_0_60px_-15px_rgba(0,200,5,0.5)]"
                    : ""
                }`}
              >
                {p.highlight && (
                  <div className="absolute -top-3 left-8 bg-[#F0A83E] text-black text-xs font-mono font-bold px-2 py-1">
                    MOST POPULAR
                  </div>
                )}
                <div className="font-display text-2xl font-bold">{p.name}</div>
                <div className="text-xs text-zinc-500 mt-1">{p.tagline}</div>

                <div className="mt-8 flex items-baseline gap-1">
                  <span className="font-display font-bold text-5xl text-[#F0A83E]">
                    {p.daily_roi}%
                  </span>
                  <span className="text-zinc-500 text-sm">/ day</span>
                </div>

                <div className="mt-8 space-y-3 text-sm">
                  <Row label="Minimum" value={money(p.min_deposit)} />
                  <Row label="Maximum" value={money(p.max_deposit)} />
                  <Row label="Duration" value={`${p.duration_days} days`} />
                  <Row
                    label="Total ROI"
                    value={`${(p.daily_roi * p.duration_days).toFixed(1)}%`}
                    accent
                  />
                </div>

                <Link
                  to="/signup"
                  data-testid={`landing-plan-${p.id}-cta`}
                  className={`mt-8 block text-center py-3 font-semibold transition-colors ${
                    p.highlight
                      ? "bg-[#F0A83E] text-black hover:bg-[#FFBC5C]"
                      : "border border-white/15 hover:border-white/40"
                  }`}
                >
                  Start earning
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 md:py-32 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-xs uppercase tracking-widest text-[#F0A83E] font-mono mb-4">
            ◆ Trusted worldwide
          </div>
          <h2 className="font-display font-bold text-4xl md:text-6xl tracking-tight mb-16">
            Voices from the <span className="text-zinc-500">portfolio.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                quote:
                  "Doubled my savings in 8 months. The daily payouts hit my wallet like clockwork.",
                name: "Marcus Chen",
                role: "Software Architect",
                img: AVATARS[0],
              },
              {
                quote:
                  "Finally a platform that treats retail investors like institutions. The transparency is unmatched.",
                name: "Priya Sharma",
                role: "Portfolio Manager",
                img: AVATARS[1],
              },
              {
                quote:
                  "Been in crypto since '17. Nova is the first platform I'd trust with size. Real yields, real custody.",
                name: "Andre Kowalski",
                role: "Family Office",
                img: AVATARS[2],
              },
            ].map((t, i) => (
              <div key={i} className="p-8 hairline bg-[#0A0A0A]">
                <div className="text-[#F0A83E] font-display text-4xl leading-none">"</div>
                <p className="mt-4 text-zinc-300 leading-relaxed">{t.quote}</p>
                <div className="mt-8 flex items-center gap-3">
                  <img src={t.img} alt="" className="w-10 h-10 object-cover" />
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-zinc-500 font-mono">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 md:py-48 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F0A83E]/10 via-transparent to-transparent" />
        <div className="relative max-w-5xl mx-auto px-6 md:px-10 text-center">
          <h2 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95]">
            Start building
            <br />
            <span className="text-[#F0A83E]">wealth today.</span>
          </h2>
          <p className="mt-8 text-lg text-zinc-400 max-w-xl mx-auto">
            Open your Nova account in 60 seconds. No minimum. No paperwork.
          </p>
          <Link
            to="/signup"
            data-testid="footer-cta-signup"
            className="mt-10 inline-flex items-center gap-2 bg-[#F0A83E] text-black font-semibold px-8 py-5 hover:bg-[#FFBC5C] transition-colors glow-btn text-lg"
          >
            Create free account
            <ArrowRight size={20} weight="bold" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, body, className = "", big = false }) {
  return (
    <div
      className={`hairline bg-[#0A0A0A] p-8 flex flex-col transition-colors group ${className}`}
    >
      <div className="text-[#F0A83E] mb-6 group-hover:scale-110 transition-transform origin-left">
        {icon}
      </div>
      <div className={`font-display font-bold ${big ? "text-3xl" : "text-xl"} tracking-tight`}>
        {title}
      </div>
      {body && (
        <p className={`text-zinc-400 mt-3 leading-relaxed ${big ? "text-base" : "text-sm"}`}>
          {body}
        </p>
      )}
    </div>
  );
}

function Row({ label, value, accent }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-zinc-500">{label}</span>
      <span
        className={`font-mono font-semibold ${accent ? "text-[#F0A83E]" : "text-white"}`}
      >
        {value}
      </span>
    </div>
  );
}
