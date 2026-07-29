import { defineConfig } from "@solidjs/start/config";
import UnoCSS from "unocss/vite";
import { VitePWA } from "vite-plugin-pwa";

const ATLASKIT_PACKAGES = [
  "@atlaskit/pragmatic-drag-and-drop",
  "@atlaskit/pragmatic-drag-and-drop-hitbox",
];

export default defineConfig({
  vite: {
    plugins: [
      UnoCSS(),
      VitePWA({
        registerType: "prompt",
        injectRegister: false,
        strategies: "generateSW",
        manifest: false,
        includeAssets: [
          "favicon-primary.svg",
          "favicon-dark.svg",
          "favicon-light.svg",
          "web-app-manifest-192x192.png",
          "web-app-manifest-512x512.png",
        ],
        workbox: {
          globPatterns: ["**/*.{js,css,html,svg,png,ico,woff,woff2}"],
          clientsClaim: true,
          navigateFallback: null,
          runtimeCaching: [
            {
              urlPattern: /^https?:\/\/.*\/api\/documents\/list/,
              handler: "NetworkFirst",
              options: {
                cacheName: "doc-tree",
                networkTimeoutSeconds: 3,
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24, // 1 day
                },
              },
            },
            {
              urlPattern: /^https?:\/\/.*\/api\/documents\/content/,
              handler: "NetworkFirst",
              options: {
                cacheName: "doc-content",
                networkTimeoutSeconds: 3,
                expiration: {
                  maxEntries: 200,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
                },
              },
            },
            {
              urlPattern: /^https?:\/\/.*\/api\/attachments\//,
              handler: "CacheFirst",
              options: {
                cacheName: "attachments",
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
                },
              },
            },
            {
              urlPattern: /^https?:\/\/.*\/auth\//,
              handler: "NetworkOnly",
            },
            {
              urlPattern: /^https?:\/\/.*\/api\//,
              handler: "NetworkOnly",
            },
          ],
        },
      }),
    ],
    ssr: {
      noExternal: ATLASKIT_PACKAGES,
    },
  },
  server: {
    externals: {
      inline: ATLASKIT_PACKAGES,
    },
    routeRules: {
      "/_build/sw.js": {
        headers: {
          "Service-Worker-Allowed": "/",
        },
      },
    },
  },
});
