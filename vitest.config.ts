import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      include: ["test/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
      environment: "jsdom",
      coverage: {
        enabled: true,
        provider: "istanbul",
        exclude: ["demo/**"],
      },
    },
  })
);
