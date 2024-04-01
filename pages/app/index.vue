<script setup>
definePageMeta({
  middleware: ["auth"],
});

const supabase = useSupabaseClient()
const loading = ref(false)
const username = ref('')
const email = ref('')
const pix_key = ref('')
const description = ref('')
const avatar_path = ref('')

const user = useSupabaseUser();

const { data: profile } = await useAsyncData('profile', async () => {
    loading.value = true
    const { data } = await supabase
        .from('profiles')
        .select(`username, pix_key, avatar_url, description`)
        .eq('id', user.value.id)
        .single()

    loading.value = false
    return data
})

// TODO: make a function to update only the profile avatar_path because update all profile is not good for validation is hard

async function updateProfile() {
    try {
        loading.value = true
        const user = useSupabaseUser();
        const updates = {
            id: user.value.id,
            username: username.value,
            pix_key: pix_key.value,
            description: description.value,
            avatar_url: avatar_path.value,
            updated_at: new Date(),
        }
        const { error } = await supabase.from('profiles').upsert(updates)
        if (error) throw error
    } catch (error) {
        alert(error.message)
    } finally {
        loading.value = false
    }
}

async function signOut() {
    try {
        loading.value = true
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        await navigateTo("/login")
    } catch (error) {
        alert(error.message)
    } finally {
        loading.value = false
    }
}


if (profile.value.username) {
    username.value = profile.value.username
    pix_key.value = profile.value.pix_key
    avatar_path.value = profile.value.avatar_url
    description.value = profile.value.description
}

</script><template>
    <form class="form-widget" @submit.prevent="updateProfile">

        <Avatar v-model:path="avatar_path" @upload="updateProfile" :allow-upload="true" :size="10" />

        <div>
            <label for="email">Email (NÃO FICARÁ VISÍVEL NA SUA PÁGINA)</label>
            <input id="email" type="text" :value="user.email" disabled />
        </div>

        <div>
            <label for="username">Username</label>
            <input id="username" placeholder="/username"type="text" v-model="username" />
        </div>

        <div>
            <label for="pixKey">Pix Key</label>
            <input id="pixKey" type="text" placeholder="Sua chave pix aqui para gerar o QR Code" v-model="pix_key" />
        </div>

        <div>
            <label for="description">Descrição</label>
            <textarea placeholder="Mostre uma mensagem para seus pagadores" v-model="description" />
        </div>

        <div>
            <input type="submit" class="button block primary" :value="loading ? 'Salvando...' : 'Salvar'"
                :disabled="loading" />
        </div>

        <div>
            <button type="button" class="button block" @click="signOut">
                Logout
            </button>
        </div>
    </form>
</template>