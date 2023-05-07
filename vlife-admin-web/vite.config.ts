import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import SemiPlugin from "vite-plugin-semi-theme";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@src": resolve(__dirname, "./src"),
      //"~antd": resolve(__dirname, "./node_modules/antd"),
    },
  },
  plugins: [
    react(),
    SemiPlugin({
      // 飞书 semi-theme-universedesign
      //  抖音 semi-theme-doucreator
      // vlife定制款 semi-theme-vlife
      theme: "@semi-bot/semi-theme-universedesign",
      // include :"~@semi-bot/semi-theme-vlife/scss/index.scss"
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        // 支持内联 javascript
        javascriptEnabled: true,
      },
    },
  },
});
