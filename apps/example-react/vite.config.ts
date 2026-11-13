import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  css: {
    postcss: {},
  },
  plugins: [tailwindcss(), react()],
  server: {
    port: 5174,
  },
});
