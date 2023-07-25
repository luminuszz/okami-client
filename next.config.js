/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["jotai-devtools"],
  images: {
    domains: ["okami-storage.s3.amazonaws.com"],
  },
};

module.exports = nextConfig;
