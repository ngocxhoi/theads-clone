// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "Threads",
      link: [{ rel: "icon", type: "image/png", href: "/pwa-192x192.png" }],
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1, maximum-scale=1",
    },
  },
  devtools: { enabled: false },
  modules: ["@nuxt/ui", "@pinia/nuxt", "@nuxtjs/supabase", "@vite-pwa/nuxt"],

  runtimeConfig: {
    public: {
      bucketUrl: process.env.BUCKET_URL,
      DATABASE_URL: process.env.DATABASE_URL,
    },
  },

  supabase: {
    redirect: false,
    redirectOptions: {
      login: "/auth",
      callback: "/confirm",
      exclude: [],
    },
  },

  pwa: {
    manifest: {
      name: "Threads Clone",
      short_name: "Threads",
      description: "This is a Threads Web App",
      theme_color: "#000000",
      icons: [
        {
          src: "pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    devOptions: {
      enabled: true,
      type: "module",
    },
  },
});
