import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'


// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    server: {
      host: "0.0.0.0",
      hmr: {
        clientPort: 8080,
      },
      port: Number(env.VITE_PORT_FRONT),
      watch: {
        usePolling: true,
      },
    },
    plugins: [
      vue(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
  }
  }
);
