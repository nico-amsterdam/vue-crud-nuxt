<script setup lang="ts">
// auto-import import ProductForm from '../components/product-form.vue'
// auto-import import { useProductStore } from '@/stores/product'
// auto-import import { useI18n } from '#imports'

/*
 * Variables
 */

const { t } = useI18n()
const productStore = useProductStore()
const { addProduct, productList } = productStore
const { writing } = storeToRefs(productStore)
const product = ref({ id: null, productName: '', description: '', price: null })
const productAlreadyExists = computed(() => {
  return !writing.value && productList.findIndex(p => p.productName === product.value.productName.trim()) >= 0
})

/*
 * Functions
 */

function createProduct() {
  addProduct(product.value)
  navigateTo('/')
}

/*
 * Page settings
 */

definePageMeta({
  middleware: 'auth',
  layout: 'vue-crud'
})

useHead({ htmlAttrs: { class: 'retro' } })

</script>

<template>
  <section>
    <div v-if="productAlreadyExists" id="errors-add-product" class="error">{{ t('pages.add-product.error.exists') }}
    </div>
    <h2>{{ t('pages.add-product.title') }}</h2>
    <form v-on:submit.prevent="createProduct">
      <ProductForm v-model:the-product="product"></ProductForm>
      <button type="submit" :disabled="writing" class="btn btn-primary">{{
        t('pages.add-product.button.create') }}</button>
      {{ ' ' }}
      <NuxtLink to="/" class="btn btn-default">{{ t('pages.add-product.button.cancel') }}</NuxtLink>
    </form>
  </section>
</template>