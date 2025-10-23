import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
      images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

const pwaConfig = withPWA({
  dest: 'public', // Destination directory for PWA files
  register: true, // Register the service worker
  skipWaiting: true, // Skip waiting for service worker activation
  
});

// export default nextConfig;
export default pwaConfig(nextConfig);
