import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/deployet/",
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        menu: resolve(__dirname, "menu.html"),
        cart: resolve(__dirname, "cart.html"),
        register: resolve(__dirname, "register.html"),
        signin: resolve(__dirname, "signin.html"),
      },
    },
  },
});
