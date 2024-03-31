<script setup>

const supabase = useSupabaseClient()

const loading = ref(false)
const email = ref('')
const password = ref('')

const handleLogin = async () => {
    try {
        loading.value = true
        const { error } = await supabase.auth.signInWithPassword({ email: email.value, password: password.value })
        if (error) throw error
        await navigateTo("/app")
    } catch (error) {
        alert(error.message)
    } finally {
        loading.value = false
    }
}
</script>
<template>
    <form class="row flex-center flex" @submit.prevent="handleLogin">
        <div class="col-6 form-widget">
            <h1 class="header">PIXMEBIO</h1>
            <p class="description">
                Faça o login com seu email e senha
            </p>
            <div>
                <label for="email">Email</label>
                <input class="inputField" id="email" type="email" placeholder="Seu email" v-model="email" />
            </div>
            <div>
                <label for="email">Password</label>
                <input class="inputField" id="password" type="password" placeholder="*****" v-model="password" />
            </div>
            <div>
                <input 
                    id="email"
                    :disabled="loading" 
                    class="button block"
                    :value="loading ? 'Entrando...' : 'Entrar'"
                    type="submit" 
                />
            </div>
        </div>
    </form>
</template>