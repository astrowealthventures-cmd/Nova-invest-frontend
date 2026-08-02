import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function StaticPageLayout({ eyebrow, title, subtitle, children }) {
    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <Navbar />
            <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 border-b border-white/5">
                <div className="absolute inset-0 grid-lines opacity-30" />
                <div className="relative max-w-4xl mx-auto px-6 md:px-10">
                    {eyebrow && (
                        <div className="text-xs uppercase tracking-widest text-[#C8102E] font-mono mb-4">
                            ◆ {eyebrow}
                        </div>
                    )}
                    <h1 className="font-display font-bold text-4xl md:text-6xl tracking-tight">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="mt-6 text-lg text-zinc-400 max-w-2xl leading-relaxed">
                            {subtitle}
                        </p>
                    )}
                </div>
            </section>

            <section className="py-16 md:py-24">
                <div className="max-w-4xl mx-auto px-6 md:px-10">{children}</div>
            </section>

            <Footer />
        </div>
    );
}

export function Prose({ children }) {
    return (
        <div className="prose-legal space-y-6 text-zinc-400 leading-relaxed [&_h2]:font-display [&_h2]:font-bold [&_h2]:text-2xl [&_h2]:text-white [&_h2]:mt-12 [&_h2]:mb-4 [&_p]:mb-4 [&_li]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_strong]:text-white">
            {children}
        </div>
    );
}