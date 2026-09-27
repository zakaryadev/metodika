import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Статик экспорт: `npm run build` дан сўнг `out/` папкаси ҳосил бўлади.
   * Уни Vercel, Netlify, GitHub Pages ёки оддий хостингга жойлаштириш мумкин.
   */
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
