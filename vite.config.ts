import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	build: {
		rollupOptions: {
			input: {
				// "index" is just the key – the file itself is still named "index.html"
				index: "./index.html",
				contentScript: "src/contentScipt.ts",
				"service-worker": "src/service-worker.ts",
			},
			output: {
				entryFileNames: "[name].js",
			},
		},
	},
});
