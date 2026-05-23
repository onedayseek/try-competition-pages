import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const getBasePath = () => {
  const explicitBase = process.env.VITE_BASE_PATH || process.env.BASE_PATH;
  if (explicitBase) return explicitBase;

  const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];
  if (!repo) return "/";
  if (repo.endsWith(".github.io")) return "/";
  return `/${repo}/`;
};

export default defineConfig({
  base: getBasePath(),
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": "http://localhost:8787",
    },
  },
});
