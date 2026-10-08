import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Todas las reservas pasan por el filtro (/aplicar). Redirección temporal (307): se puede revertir sin dejar nada cacheado.
  async redirects() {
    return [{ source: "/agendar", destination: "/aplicar", permanent: false }];
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
