/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Untuk gambar dummy
      },
      {
        protocol: "https",
        hostname: "placehold.co", // <--- TAMBAHKAN INI
      },
      {
        protocol: "https",
        hostname: "mmxdreruzkekdzkyaemq.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
