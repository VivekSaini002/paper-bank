/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // Allow requests to the Spring Boot backend
  async rewrites() {
    return [];
  },
};

export default nextConfig;
