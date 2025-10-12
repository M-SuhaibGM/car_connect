/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com", // ✅ Google profile pictures
            },
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com", // ✅ GitHub profile pictures (optional)
            },
        ],
    },
};

export default nextConfig;
