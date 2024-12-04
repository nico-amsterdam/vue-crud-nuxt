<template>
  <div>
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
   // auto import import { useProductStore } from "~/stores/product";

   const productStore = useProductStore()
   const { addProduct } = productStore
   const { loggedIn } = useUserSession()

   watch(loggedIn, () => {
     if (!loggedIn.value) {
       navigateTo('/auth')
     }
   })
</script>
