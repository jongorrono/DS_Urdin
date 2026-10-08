import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/entry.js",
      name: "SideprojectsIsland",
      formats: ["iife"],
      fileName: () => "sideprojects-island.js"
    },
    // ⬇️ The important line:
    outDir: "../../JonGoweb/js/islands",
    emptyOutDir: false
  }
});
