import { withSentryConfig } from "@sentry/nextjs";

const nextConfig = {
  devIndicators: false,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/workflows",
        permanent: false,
      }
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: "boris-stanar-ct",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  webpack: {
    automaticVercelMonitors: true,
    treeshake: {
      removeDebugLogging: true,
    },
  }
});