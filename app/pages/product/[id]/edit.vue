<script setup lang="ts">
    import { useRoute } from 'vue-router'

    const { t } = useI18n()

    const productStore = useProductStore()
    const { productList, updateProduct } = productStore
    const route = useRoute()

    // deep-clone the product to prevent that changes are applied directly.
    // Direct manipulation goes wrong when validation error occurs and user cancels.
    // Only change via mutations.
    const product = JSON.parse(JSON.stringify(productList.find(p => '' + p.id === route.params.id) ?? null))
    // Alternative:
    // const product = structuredClone(toRaw(productList.find(p => p.id == route.params.id)));

    function update() {
      updateProduct(product)
      navigateTo('/')
    }

    definePageMeta({
      middleware: 'auth',
      layout: 'vue-crud'
    })

    useHead({ htmlAttrs: { class: 'retro' } })
</script>

<template>
  <section>
    <h2>{{ t('pages.product-id-edit.title') }}</h2>
    <form v-on:submit.prevent="update">
      <ProductForm v-model:the-product="product" v-if="!!product"></ProductForm>
      <button type="submit" class="btn btn-primary" v-if="!!product && product.id >= 0">{{ t('app.button.save') }}</button>
      <NuxtLink to="/" class="btn btn-default">{{ t('pages.product-id-edit.button.cancel') }}</NuxtLink>
    </form>
  </section>
</template>
