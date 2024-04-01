<script setup>

const supabase = useSupabaseClient()

useHead({
    title: "Login"
})

const loading = ref(false)

const handleLogin = async () => {
    try {
        loading.value = true
        const redirectUrl = `${window.location.origin}/confirm`

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectUrl
            }
        })
        if (error) throw error
    } catch (error) {
        alert(error.message)
    } finally {
        loading.value = false
    }
}
</script>
<template>
    <form class="row flex-center flex login__form" @submit.prevent="handleLogin">
        <div class="col-6">
            <h1 class="header">PIXMEBIO</h1>
            <p class="description">
                Comece agora mesmo com sua conta do Google. Crie seu perfil!
            </p>
            <button 
                :disabled="loading" 
                class="button block"
                type="submit" 
            >
            <img src="../public/google.svg" alt="Google logo" width="28" height="28">
            {{ loading ? 'Entrando...' : 'Entrar com Google' }}
            </button>
        </div>
    </form>
</template>