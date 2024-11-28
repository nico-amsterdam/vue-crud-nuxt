<script setup lang="ts">
    // auto import import { useProductStore } from '@stores/product'
    import { useRoute } from 'vue-router'

    const productStore = useProductStore()
    const { productList } = productStore
    const { updateProduct } = productStore
    const route = useRoute()

    // deep-clone the product to prevent that changes are applied directly.
    // Direct manipulation goes wrong when validation error occurs and user cancels.
    // Only change via mutations.
    const product = JSON.parse(JSON.stringify(productList.find((p) => '' + p.id === route.params.id) ?? null))
    // Alternative:
    // const product = structuredClone(toRaw(productList.find((p) => p.id == route.params.id)));

    function update() {
      updateProduct(product)
      navigateTo('/')
    }

    definePageMeta({
      middleware: 'auth',
      layout: "vue-crud"
    })

    useHead({ link: [{rel: 'stylesheet', href: '/_nuxt/assets/css/bootstrap3-un.css'}] })
</script>

<template>
  <section>
    <h2>Edit product</h2>
    <form v-on:submit.prevent="update">
      <ProductForm v-model:the-product="product" v-if="!!product"></ProductForm>
      <button type="submit" class="btn btn-primary" v-if="!!product">Save</button>
      <NuxtLink to="/" class="btn btn-default">Cancel</NuxtLink>
    </form>
  </section>
</template>
