import { useMemo } from "react";

export default function Starfield({ count = 80, className = "" }) {
    const stars = useMemo(
        () =>
            Array.from({ length: count }, (_, i) => ({
                id: i,
                top: Math.random() * 100,
                left: Math.random() * 100,
                size: Math.random() < 0.85 ? 1 : Math.random() < 0.97 ? 2 : 3,
                delay: Math.random() * 6,
                duration: 3 + Math.random() * 4,
            })),
        [count]
    );

    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
            {stars.map((s) => (
                <span
                    key={s.id}
                    className="absolute rounded-full bg-white starfield-twinkle"
                    style={{
                        top: `${s.top}%`,
                        left: `${s.left}%`,
                        width: `${s.size}px`,
                        height: `${s.size}px`,
                        animationDelay: `${s.delay}s`,
                        animationDuration: `${s.duration}s`,
                    }}
                />
            ))}
        </div>
    );
}