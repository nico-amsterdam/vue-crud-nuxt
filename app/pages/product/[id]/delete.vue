<script setup lang="ts">
    // auto-import import { useProductStore } from '@stores/product'
    import { useRoute } from 'vue-router'

    const productStore = useProductStore()
    const { productList, deleteProduct } = productStore
    const route = useRoute()
    const product = productList.find(p => '' + p.id === route.params.id) ?? null;

    function remove() {
      if (product) {
         deleteProduct(product)
      }
      navigateTo('/')
    }

    definePageMeta({
      middleware: 'auth',
      layout: 'vue-crud'
    })

    useHead({ link: [{rel: 'stylesheet', href: '/_nuxt/assets/css/bootstrap3-un.css'}] })
</script>

<template>
  <section>
    <h2>Delete product {{product?.productName}}</h2>
    <form v-on:submit.prevent="remove">
      <p>The action cannot be undone.</p>
      <button type="submit" class="btn btn-danger" v-if="!!product && product.id >= 0">Delete</button>
      <NuxtLink to="/" class="btn btn-default">Cancel</NuxtLink>
    </form>
  </section>
</template>
