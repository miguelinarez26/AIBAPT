import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Despliegue full-stack en Vercel (SSR + ISR + Middleware habilitados)
  // Se eliminó output: "export" y basePath para compatibilidad con servidor
  trailingSlash: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        // Supabase Storage — bucket público y privado
        protocol: 'https',
        hostname: 'idpjomyvailowoltosaj.supabase.co',
        pathname: '/storage/v1/object/**',
      },
    ],
  },
};

export default nextConfig;
