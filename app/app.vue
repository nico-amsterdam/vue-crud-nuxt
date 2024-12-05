<template>
  <div>
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
   const { loggedIn } = useUserSession()

   watch(loggedIn, () => {
     if (!loggedIn.value) {
       navigateTo('/auth')
     }
   })
</script>
