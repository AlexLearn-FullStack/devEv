import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      // Might wanna remove this later
      {
        protocol: "https",
        hostname: "loremflickr.com",
      },
    ],
  },
};


export default nextConfig;