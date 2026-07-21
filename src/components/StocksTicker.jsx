import { useEffect, useState } from "react";

// 🔑 Get a free key at https://finnhub.io (takes 30 seconds)
const FINNHUB_KEY = "d9fju31r01qu5nheq770d9fju31r01qu5nheq77g";

const STOCKS = [
    { symbol: "TSLA", name: "Tesla", blurb: "EVs, energy storage, and autonomy.", domain: "tesla.com" },
    { symbol: "AAPL", name: "Apple", blurb: "iPhone, Mac, and services giant.", domain: "apple.com" },
    { symbol: "MSFT", name: "Microsoft", blurb: "Cloud, software, and AI leader.", domain: "microsoft.com" },
    { symbol: "NVDA", name: "NVIDIA", blurb: "GPUs powering the AI boom.", domain: "nvidia.com" },
    { symbol: "AMZN", name: "Amazon", blurb: "E-commerce and AWS cloud.", domain: "amazon.com" },
    { symbol: "GOOGL", name: "Alphabet", blurb: "Search, ads, and YouTube.", domain: "abc.xyz" },
    { symbol: "META", name: "Meta", blurb: "Social platforms and VR.", domain: "meta.com" },
    { symbol: "AMD", name: "AMD", blurb: "CPUs and GPUs at scale.", domain: "amd.com" },
    // SpaceX is PRIVATE — not tradable on public markets
    { symbol: "SPACEX", name: "SpaceX", blurb: "Rockets and Starlink. Private company.", domain: "spacex.com", private: true },
];

function Logo({ domain, name }) {
    const [failed, setFailed] = useState(false);
    if (failed) {
        return (
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#C8102E] to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                {name[0]}
            </div>
        );
    }
    return (
        <img
            src={`https://logo.clearbit.com/${domain}?size=40`}
            alt={name}
            className="w-10 h-10 rounded-lg bg-white object-contain p-1"
            onError={() => setFailed(true)}
        />
    );
}

export default function StocksTicker() {
    const [quotes, setQuotes] = useState({});

    useEffect(() => {
        let cancelled = false;
        async function load() {
            const results = await Promise.all(
                STOCKS.filter(s => !s.private).map(async (s) => {
                    try {
                        const r = await fetch(
                            `https://finnhub.io/api/v1/quote?symbol=${s.symbol}&token=${FINNHUB_KEY}`
                        );
                        const j = await r.json();
                        // Finnhub: c = current, pc = previous close, dp = % change
                        return [s.symbol, { price: j.c, prev: j.pc, pct: j.dp }];
                    } catch { return [s.symbol, null]; }
                })
            );
            if (!cancelled) setQuotes(Object.fromEntries(results));
        }
        load();
        const id = setInterval(load, 15000); // refresh every 15s
        return () => { cancelled = true; clearInterval(id); };
    }, []);

    return (
        <section className="py-20 px-6 relative z-10">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-3 text-center">
                    Trade Top Stocks
                </h2>
                <p className="text-white/60 text-center mb-12">
                    Live prices, refreshed every 15 seconds.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {STOCKS.map((s) => {
                        const q = quotes[s.symbol];
                        const change = q?.pct ?? null;
                        const up = change != null && change >= 0;

                        return (
                            <div
                                key={s.symbol}
                                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 hover:border-white/25 hover:bg-white/10 transition"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <Logo domain={s.domain} name={s.name} />
                                    <div>
                                        <div className="text-white font-semibold">{s.symbol}</div>
                                        <div className="text-white/50 text-xs">{s.name}</div>
                                    </div>
                                </div>
                                <p className="text-white/60 text-sm mb-4 leading-snug">{s.blurb}</p>
                                <div className="flex items-end justify-between">
                                    <div className="text-white text-xl font-bold">
                                        {s.private ? "Private" : q?.price ? `$${q.price.toFixed(2)}` : "…"}
                                    </div>
                                    <div className={`text-sm font-medium ${s.private ? "text-white/40" : up ? "text-green-400" : "text-red-400"}`}>
                                        {s.private ? "Not listed" : change != null ? `${up ? "▲" : "▼"} ${Math.abs(change).toFixed(2)}%` : ""}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
