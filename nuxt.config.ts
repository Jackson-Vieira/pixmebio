// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/supabase'],
  css: ['@/assets/globals.css'],
  devtools: { enabled: false },
  supabase: {
    redirect: false,
    redirectOptions: {
      login: '/login',
      callback: '/app'
    }
  }
})
