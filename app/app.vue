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

   // example replacement for NuxtServerInit
   onServerPrefetch(async () => {
      console.log(process.server)
      addProduct({id: null, name: 'Wire cutters', description: 'Cut the wire', price: 40, features: [{id: 51, name: 'Handy'}, {id:52, name: 'Tool'}]})
   })
</script>
