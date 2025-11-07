import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: process.env.BUCKET_HOSTNAME as string,
				port: '',
				pathname: '/**',
			},
		],
	},
};

export default nextConfig;
