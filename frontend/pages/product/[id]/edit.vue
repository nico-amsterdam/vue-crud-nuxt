<script setup>
    import { ref } from 'vue'
    import { storeToRefs } from 'pinia'
    // auto import import { useProductStore } from '@stores/product'
    import { useRoute } from 'vue-router'

    const productStore = useProductStore()
    const { productList } = storeToRefs(productStore)
    const { updateProduct } = productStore
    const route = useRoute()
    const product = ref(productList.find(product => product.id === route.params.id));
    // deep-clone the product (using JSON stringify + parse) to prevent that changes are applied directly.
    // Direct manipulation goes wrong when validation error occurs and user cancels.
    // Only change via mutations.
    // return {"product": JSON.parse(JSON.stringify(this.$store.state.products.find(product //=> product.id === this.$route.params.id)))};

    function update(e) {
      updateProduct(product)
      navigateTo('/')
    }

    definePageMeta({
      layout: "vue-crud",
    })
</script>

<template>
  <section>
    <h2>Edit product</h2>
    <form v-on:submit.prevent="update">
      <ProductForm v-model:the-product="product"></ProductForm>
      <button type="submit" class="btn btn-primary">Save</button>
      <NuxtLink to="/" class="btn btn-default">Cancel</NuxtLink>
    </form>
  </section>
</template>