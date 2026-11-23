import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
        condition: {
          all: [
            {
              any: [
                { path: "globals.css" }
              ]
            }
          ]
        }
      },
    },
  },
};

export default nextConfig;