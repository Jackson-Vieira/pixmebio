<script setup>
const user = useSupabaseUser()

watch(user, () => {
  if (user.value) {
      return navigateTo('/app')
  }
}, { immediate: true })
</script>

<template>
  <div>Aguardando login...</div>
</template>