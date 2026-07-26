import type { NextConfig } from "next";

const PRIMARY_HOST = "reservemy.spot";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // On the custom domain, the bare root serves the member spot page.
      // The .vercel.app root still shows the three-lane demo picker.
      {
        source: "/",
        destination: "/m/spot",
        has: [{ type: "host", value: PRIMARY_HOST }],
      },
    ];
  },
};

export default nextConfig;
