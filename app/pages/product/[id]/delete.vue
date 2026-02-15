<script setup lang="ts">
import { useRoute } from 'vue-router'

/*
 * Variables
 */

const { t } = useI18n()
const productStore = useProductStore()
const { productList, deleteProduct } = productStore
const route = useRoute()
const product = productList.find(p => '' + p.id === route.params.id) ?? null;

/*
 * Functions
 */

function remove() {
  if (product) {
    deleteProduct(product)
  }
  navigateTo('/')
}

/*
* Page settings
*/

definePageMeta({
  middleware: 'auth',
  layout: 'vue-crud'
})

</script>

<template>
  <section>
    <h2>{{ t('pages.product-id-delete.title', { productName: product?.productName ?? "???" }) }}</h2>
    <form v-on:submit.prevent="remove">
      <p>{{ t('pages.product-id-delete.warning') }}</p>
      <button type="submit" class="btn btn-danger" v-if="!!product && product.id >= 0">{{ t('app.button.delete')
      }}</button>
      {{ ' ' }}
      <NuxtLink to="/" class="btn btn-default" @click="productStore.clearErrors()">{{ t('pages.product-id-delete.button.cancel') }}</NuxtLink>
    </form>
  </section>
</template>
