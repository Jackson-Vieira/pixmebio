<script setup>
import { QrCodePix } from 'qrcode-pix';

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
const pix_qrcode_src = ref('')

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


async function createQRCode(pixKey){
    const qrCodePix = QrCodePix({
        version: '01',
        key: pixKey, // PIX KEY
        name: "any",
        city: "any",
        value: 1.0
    });
    
    return await qrCodePix.base64()
}

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

// TODO: PUT THIS LOGIC IN A METHOD AND REUSE IN POPULATE USER DATA
watch(pix_key, async (newPixKey, _) => {
    if(newPixKey){
        // TODO: make a loading state while the new qrcode is updating (perfumaria)
        pix_qrcode_src.value = await createQRCode(newPixKey)
    }
})

if (profile.value.username) {
    username.value = profile.value.username
    pix_key.value = profile.value.pix_key
    avatar_path.value = profile.value.avatar_url
    description.value = profile.value.description
    email.value = user.email
}

</script><template>
    <form class="form-widget" @submit.prevent="updateProfile">

        <Avatar v-model:path="avatar_path" @upload="updateProfile" :allow-upload="true" :size="10" />

        <div>
            <label for="email">Email (NÃO FICARÁ VISÍVEL NA SUA PÁGINA)</label>
            <input id="email" type="text" v-model="email" disabled />
        </div>

        <div>
            <label for="username">Username</label>
            <input id="username" placeholder="/seusuario"type="text" v-model="username" />
        </div>

        <div>
            <label for="pixKey">Pix Key</label>
            <input id="pixKey" type="text" v-model="pix_key" />
        </div>

        <div>
            <label for="description">Descrição</label>
            <textarea placeholder="Escreva um pouco sobre você aqui" v-model="description" />
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