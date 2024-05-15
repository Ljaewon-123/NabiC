import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import pages from 'vite-plugin-pages';
import Layouts from 'vite-plugin-vue-layouts';

import electron from 'vite-plugin-electron/simple'
import path from 'node:path';

import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // pages({
    //   // dirs: 'src/views'
    // }),
    // Layouts({
    //   layoutsDirs: 'src/mylayouts',
    //   pagesDirs: 'src/pages',
    //   defaultLayout: 'myDefault'
    // }),
    {
      name: 'electron',
      apply(config, { command }) {
        electron({
      
          main: {
            // Shortcut of `build.lib.entry`.
            entry: 'electron/main.ts',
          },
          preload: {
            // Shortcut of `build.rollupOptions.input`.
            // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
            input: path.join(__dirname, 'electron/preload.ts'),
          },
          // Ployfill the Electron and Node.js API for Renderer process.
          // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
          // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
          renderer: process.env.NODE_ENV === 'test'
            // https://github.com/electron-vite/vite-plugin-electron-renderer/issues/78#issuecomment-2053600808
            ? undefined
            : {},
        })
        return command === 'build' 
      }
    },
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Nabi-cloud',
        short_name: 'Cloud',
        description: 'Nabi Cloud',
        theme_color: '#ffffff',
        icons: [
          {
            src: "assets/images/logos/Logo_16.png",
            sizes: "16x16",
            type:"image/png",
            
          },
          {
            src: "assets/images/logos/Logo_32.png",
            sizes: "32x32",
            type:"image/png",
            
          },
          {
            src: "assets/images/logos/Logo_70.png",
            sizes: "70x70",
            type:"image/png",
            
          },
          {
            src: "assets/images/logos/Logo_96.png",
            sizes: "96x96",
            type: "image/png",
            
          },
        ]
      },
      devOptions: {
        enabled: true
      },
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server:{
    host: true
  }
})
