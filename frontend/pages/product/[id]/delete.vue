<script setup>
    // auto-import import { useProductStore } from '@stores/product'
    import { useRoute } from 'vue-router'

    const productStore = useProductStore()
    const { productList } = productStore
    const { deleteProduct } = productStore
    const route = useRoute()
    const product = productList.find((p) => p.id == route.params.id);

    function remove() {
      deleteProduct(product)
      navigateTo('/')
    }

    definePageMeta({
      layout: "vue-crud"
    })
</script>

<template>
  <section>
    <h2>Delete product {{product?.name}}</h2>
    <form v-on:submit.prevent="remove">
      <p>The action cannot be undone.</p>
      <button type="submit" class="btn btn-danger" v-if="!!product">Delete</button>
      <NuxtLink to="/" class="btn btn-default">Cancel</NuxtLink>
    </form>
  </section>
</template>
