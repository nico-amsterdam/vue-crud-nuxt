<script setup lang="ts">
 // auto-import import ProductForm from '../components/product-form.vue'
 // auto-import import { useProductStore } from '@stores/product'

    const productStore = useProductStore()
    const { addProduct, productList } = productStore
    const product = ref({id: null, productName: '', description: '', price: null})

    const productAlreadyExists = computed(() => {
      return productList.findIndex(p => p.productName === product.value.productName.trim()) >= 0
    })

    function createProduct () {
      addProduct(product.value)
      navigateTo('/')
    }

    definePageMeta({
      middleware: 'auth',
      layout: 'vue-crud'
    })

    useHead({ link: [{rel: 'stylesheet', href: '/css/bootstrap3-un.css'}] })
</script>

<template>
    <section>
    <div v-if="productAlreadyExists" class="error">Product already exists</div>
    <h2>Add new product</h2>
    <form v-on:submit.prevent="createProduct">
      <ProductForm v-model:the-product="product"></ProductForm>
      <button type="submit" :disabled="productAlreadyExists" class="btn btn-primary">Create</button>
      <NuxtLink to="/" class="btn btn-default">Cancel</NuxtLink>
    </form>
  </section>
</template>