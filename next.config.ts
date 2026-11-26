import type { NextConfig } from "next";

type RemotePattern = NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]>[number];

/**
 * Imágenes subidas desde el panel (Etapa 15): las sirve el backend en
 * `<API>/media/public/*`. Se autoriza solo esa ruta del host de la API para
 * que `next/image` las optimice (tamaño, AVIF/WebP, carga diferida).
 * `NEXT_PUBLIC_MEDIA_BASE_URL` permite otro origen si se mueven a un CDN.
 */
function mediaPattern(base: string | undefined, suffix: string): RemotePattern[] {
  if (!base) return [];
  try {
    const url = new URL(base);
    return [
      {
        protocol: url.protocol.replace(":", "") as "http" | "https",
        hostname: url.hostname,
        port: url.port,
        pathname: `${url.pathname.replace(/\/+$/, "")}${suffix}/**`,
      },
    ];
  } catch {
    return [];
  }
}

// Barrera de despliegue: sin esta variable el sitio de producción quedaría
// llamando a localhost y sin autorizar el dominio de las imágenes.
if (process.env.VERCEL_ENV === "production") {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
  if (!apiUrl.startsWith("https://") || /localhost|127\.0\.0\.1/.test(apiUrl)) {
    throw new Error(
      "NEXT_PUBLIC_API_URL debe apuntar a la API de producción (https) en Vercel, p. ej. https://api.capitalconsulting.com.co/api/v1",
    );
  }
}

const mediaRemotePatterns: RemotePattern[] = [
  ...mediaPattern(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1", "/media/public"),
  ...mediaPattern(process.env.NEXT_PUBLIC_MEDIA_BASE_URL, ""),
];

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.capital.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      ...mediaRemotePatterns,
    ],
    formats: ["image/avif", "image/webp"],
  },

  compress: true,

  poweredByHeader: false,

  trailingSlash: false,

  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },

  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production",
  },

  async redirects() {
    return [
      {
        source: "/contactanos",
        destination: "/contacto",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;