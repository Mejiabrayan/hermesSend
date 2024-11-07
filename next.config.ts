const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pssblqjaacoljduzoiuu.supabase.co',
        port: '',
        pathname: '/storage/v1/s3/object/public/avatar/**',
      }
    ],
  },
};

export default nextConfig;