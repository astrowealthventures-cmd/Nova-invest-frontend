import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { http } from "@/lib/api";

export default function CryptoTicker() {
  const [ticks, setTicks] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const { data } = await http.get("/market/ticker");
        if (mounted) setTicks(data);
      } catch (_) {}
    };
    load();
    const id = setInterval(load, 15000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  if (!ticks.length) return null;

  return (
    <div
      data-testid="crypto-ticker"
      className="border-y border-white/5 bg-black/40 py-3"
    >
      <Marquee speed={40} gradient={false} pauseOnHover>
        {ticks.map((t, i) => (
          <div
            key={i}
            className="mx-8 flex items-center gap-3 font-mono text-sm"
            data-testid={`ticker-${t.symbol}`}
          >
            <span className="text-zinc-500">{t.symbol}/USD</span>
            <span className="text-white">
              $
              {t.price.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </span>
            <span
              className={
                t.change_24h >= 0 ? "text-[#F0A83E]" : "text-[#FF3B30]"
              }
            >
              {t.change_24h >= 0 ? "▲" : "▼"} {Math.abs(t.change_24h)}%
            </span>
          </div>
        ))}
      </Marquee>
    </div>
  );
}
