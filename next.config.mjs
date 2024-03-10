/** @type {import('next').NextConfig} */


const imageURl = process.env.IMAGE_URL;

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**"
      }
    ]
  }
};

export default nextConfig;
