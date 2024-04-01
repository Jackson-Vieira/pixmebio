export default defineNuxtConfig({
  modules: ['@nuxtjs/supabase'],
  css: ['@/assets/globals.css'],
  devtools: { enabled: false },
  supabase: {
    redirect: false,
  }
})
