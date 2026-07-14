import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#030303]" data-testid="site-footer">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <div className="font-display text-3xl md:text-5xl font-bold tracking-tight leading-none">
              <span className="text-[#F0A83E]">AstroWealthVentures</span>
              <br />
            </div>
            <p className="mt-4 text-zinc-500 text-sm max-w-xs">
              Institutional-grade digital asset investment platform. Regulated, audited, and built for the next decade of wealth.
            </p>
          </div>
          <FooterCol
            title="Product"
            links={[
              ["Investment Plans", "/#plans"],
              ["Markets", "/#stats"],
              ["Dashboard", "/dashboard"],
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              ["About", "#"],
              ["Security", "#"],
              ["Partners", "#"],
            ]}
          />
          <FooterCol
            title="Legal"
            links={[
              ["Terms", "#"],
              ["Privacy", "#"],
              ["Disclosures", "#"],
            ]}
          />
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-zinc-600">
          <div className="font-mono">© {new Date().getFullYear()} NOVA·INVEST — All rights reserved.</div>
          <div className="font-mono">Built on trust. Powered by code.</div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-zinc-500 mb-4 font-mono">{title}</div>
      <ul className="space-y-2 text-sm">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link to={href} className="text-zinc-300 hover:text-[#F0A83E] transition-colors">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
