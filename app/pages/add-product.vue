<script setup lang="ts">
 // auto-import import ProductForm from '../components/product-form.vue'
 // auto-import import { useProductStore } from '@stores/product'
   
    const productStore = useProductStore()
    const { addProduct } = productStore
    let   product = {id: null, name: '', description: '', price: null, features: []}

    function createProduct () {
      addProduct(product)
      navigateTo('/')
    }

    definePageMeta({
      layout: "vue-crud"
    })

</script>

<template>
    <section>
    <h2>Add new product</h2>
    <form v-on:submit.prevent="createProduct">
      <ProductForm v-model:the-product="product"></ProductForm>
      <button type="submit" class="btn btn-primary">Create</button>
      <NuxtLink to="/" class="btn btn-default">Cancel</NuxtLink>
    </form>
  </section>
</template>
