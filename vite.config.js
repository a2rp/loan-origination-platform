import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    base: "/loan-origination-platform/",
    build: {
        sourcemap: false,
    },
    plugins: [react()],
});