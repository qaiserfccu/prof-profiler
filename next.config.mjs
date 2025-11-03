/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['172.30.55.154'],
  images: {
    remotePatterns: [],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

export default nextConfig;