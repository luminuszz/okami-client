/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["jotai-devtools"],
  images: {
    domains: ["okami-storage.s3.amazonaws.com"],
  },

  redirects: () => {
    return [
      {
        source: "/",
        destination: "/works/unread",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
