<template>
<div class="profile__card">
    <div class="profile__info">
        <Avatar :path="profile.avatar_url" :allow-upload="false" width="5rem"/>
        <strong>{{ profile.username }}</strong>
        <p>{{ profile.description }}</p>
    </div>
    <footer>
        <img :src="pix_key_src" alt="Pix QR code" width="250" height="250" />
        <button class="button__copy_qrcode" type="button" @click="handleCopyPix">Copiar código QR</button>
    </footer>
</div>
</template>

<script setup>
import { QrCodePix } from 'qrcode-pix';
import { useClipboard } from '@vueuse/core'

const loading = ref(false)
const pix_key_src = ref('')
const pix_key_base64 = ref('')

const { copy, isSupported } = useClipboard({ pix_key_base64 })
const { params } = useRoute()

const supabase = useSupabaseClient()

const { data: profile } = await useAsyncData('profile', async () => {

    try {
        loading.value = true

        const { data, error } = await supabase
            .from('profiles')
            .select(`username, pix_key, avatar_url, description`)
            .eq('username', params.username)
            .single()
    
        if(error) throw error

        return data

    } catch(err) {
        console.log(err)
    } finally {
        loading.value = false
    }

    loading.value = false
})

if (profile.value.pix_key){
    const {base64, payload} = await createQRCode(profile.value.pix_key)
    pix_key_base64.value = payload
    pix_key_src.value = base64
}

async function createQRCode(pixKey){
    const qrCodePix = QrCodePix({
        version: '01',
        key: pixKey,
        name: "any",
        city: "any",
        value: 1.0
    });
    
    const base64 = await qrCodePix.base64()
    const payload = qrCodePix.payload()

    return { base64, payload }
}

function handleCopyPix(){
   copy(pix_key_base64.value)
}

</script>
<style scoped>

.profile__card {
    margin: 0 auto;
    max-width: 400px;   
    padding: 2rem;
    border-radius: 0.5rem;
}

.profile__info {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
    text-align: center;
}

.profile__info strong {
    font-size: 1.5rem;
}

.profile__info p {
    margin: 0;
    /* trocar a cor e fonte desse p */
}

.profile__card footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
}

.profile__card footer button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
}

</style>