import type { NextConfig } from "next";

const PRIMARY_HOST = "reservemy.spot";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      // beforeFiles: must run ahead of the filesystem, otherwise "/" resolves
      // to the real root page and this never fires.
      beforeFiles: [
        // On the custom domain, the bare root serves the member spot page.
        // The .vercel.app root still shows the three-lane demo picker.
        {
          source: "/",
          destination: "/m/spot",
          has: [{ type: "host", value: PRIMARY_HOST }],
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
