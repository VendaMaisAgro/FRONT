/** @type {import('next').NextConfig} */
module.exports = {
	experimental: {
		serverActions: {
			bodySizeLimit: '5mb',
		},
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'vendamaisagromarket.s3.us-east-2.amazonaws.com',
				port: '',
				pathname: '/**',
			},
		],
	},
	// async rewrites() {
	//   return [
	//     {
	//       // Qualquer chamada a /api/... será proxy para o backend
	//       source: '/api/:path*',
	//       destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/:path*`
	//     }
	//   ];
	// }
};
