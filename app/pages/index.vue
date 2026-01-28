<script setup lang="ts">
// auto import:   import { useProductStore } from '@/stores/product'
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { Icon } from '@iconify/vue'

const productStore = useProductStore()
const { productList, lastReadErrorMsg, lastWriteErrorMsg, reading } = storeToRefs(productStore)
const searchKey = ref('')

const filteredProducts = computed(() => {
  return productList.value.filter(product =>
    product.productName.toLowerCase().indexOf(searchKey.value.toLowerCase()) !== -1
    || product.description.toLowerCase().indexOf(searchKey.value.toLowerCase()) !== -1)
})

definePageMeta({
  middleware: 'auth',
  layout: 'vue-crud'
})

onMounted(() => {
  document.getElementById('search-element')?.focus()
})

function refresh() {
  if (!reading.value) productStore.fetchProducts() // do not wait with await
}

refresh() // initial load

useHead({
  htmlAttrs: { class: 'retro' },
  link: [{ rel: 'manifest', href: '/manifest.webmanifest' }, { rel: 'apple-touch-icon', href: '/image/icon-192.png' }]
})
</script>

<template>
  <section>
    <div class="errors">
      {{ lastWriteErrorMsg }}
      <p />
      {{ lastReadErrorMsg }}
    </div>
    <div class="actions">
      <NuxtLink class="btn btn-default" to="/add-product" no-rel>
        <Icon icon="tabler:plus" title="+" class="plussign" />
        Add product
      </NuxtLink>
      <button type="button" class="btn refresh" title="Refresh" @click="refresh">
        <Icon flip="horizontal" icon="tabler:refresh" />
      </button>
    </div>
    <div class="filters row">
      <div class="form-group col-sm-3">
        <label for="search-element">Search product</label>
        <input v-model="searchKey" class="form-control" id="search-element" requred />
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Price</th>
          <th class="col-sm-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in filteredProducts">
          <td>
            <NuxtLink v-if="product.id >= 0" :to="`/product/${product.id}/edit`" no-rel no-prefetch>{{
              product.productName }}</NuxtLink>
            <span v-if="product.id < 0">{{ product.productName }}</span>
          </td>
          <td>
            {{ product.description }}
          </td>
          <td>
            {{ product.price }} €
          </td>
          <td>
            <NuxtLink v-if="product.id >= 0" class="btn btn-warning btn-xs" :to="`/product/${product.id}/edit`" no-rel
              no-prefetch>Edit</NuxtLink>
            <NuxtLink v-if="product.id >= 0" class="btn btn-danger btn-xs" :to="`/product/${product.id}/delete`" no-rel
              no-prefetch>Delete</NuxtLink>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style>
.form-group {
  max-width: 500px;
}

.actions {
  padding: 10px 0;
}

.plussign {
  vertical-align: bottom;
  font-size: 24px
}

.refresh {
  float: right;
  background: none;
  border: none;
  padding: 0;
}

.btn.refresh:active {
  box-shadow: none
}

.refresh svg {
  font-size: 24px;
  margin: 5px 5px 0 5px;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

.refresh:active svg {
  color: lightblue;
  animation: spin 500ms linear 1;
}

.refresh:not(:active) svg {
  /* keep color for 0.5 seconds */
  transition: color 500ms step-end;
}
</style>
