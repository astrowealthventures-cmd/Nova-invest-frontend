export default function BrandMark({ className = "w-7 h-7" }) {
  return (
    <img
      src="/astro-logo.svg"
      alt="AstroWealthVentures"
      className={`${className} object-contain`}
      loading="lazy"
      decoding="async"
    />
  );
}
