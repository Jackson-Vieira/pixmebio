<script setup lang="ts">
import { QrCodePix } from 'qrcode-pix';

const supabase = useSupabaseClient()


const loading = ref(false)
const username = ref('')
// const website = ref('')
const pixKey = ref('')
const avatar_path = ref('')
const pix_qrcode_src = ref('')

const user = useSupabaseUser();

const { data: profile } = await useAsyncData('profile', async () => {
    loading.value = true
    const { data } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user.value.id)
        .single()

    loading.value = false
    return data
})


async function createQRCode(pixKey: string){
    const qrCodePix = QrCodePix({
        version: '01',
        key: pixKey, // PIX KEY
        name: "any",
        city: "any",
        value: 1.0
    });
    
    return await qrCodePix.base64()
}



if (profile.value.username) {
    username.value = profile.value.username
    // website.value = profile.value.website
    avatar_path.value = profile.value.avatar_url
}

async function updateProfile() {
    try {
        loading.value = true
        const user = useSupabaseUser();
        const updates = {
            id: user.value.id,
            username: username.value,
            // website: website.value,
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
    } catch (error) {
        alert(error.message)
    } finally {
        loading.value = false
    }
}


watch(pixKey, async (newPixKey, _) => {
    if(newPixKey){
        pix_qrcode_src.value = await createQRCode(newPixKey)
    }
})

</script><template>
    <form class="form-widget" @submit.prevent="updateProfile">

        <Avatar v-model:path="avatar_path" @upload="updateProfile" :size="10" />

        <img v-if="pixKey" :src="pix_qrcode_src" alt="Red dot" />

        <div>
            <label for="email">Email (NÃO FICARÁ VISÍVEL NA SUA PÁGINA)</label>
            <input id="email" type="text" :value="user.email" disabled />
        </div>
        <div>
            <label for="username">Username</label>
            <input id="username" type="text" v-model="username" />
        </div>

        <div>
            <label for="pixKey">Pix Key</label>
            <input id="pixKey" type="url" v-model="pixKey" />
        </div>

        <div>
            <label for="description">Descrição</label>
            <textarea placeholder="Escreva um pouco sobre você aqui" />
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