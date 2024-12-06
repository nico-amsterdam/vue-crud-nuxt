<script setup lang="ts">
 // auto import:   import { useProductStore } from '@stores/product'
   import { ref, computed } from 'vue'
   import { storeToRefs } from 'pinia'
   import { Icon } from '@iconify/vue'

   const productStore = useProductStore()
   const { productList, lastReadErrorMsg, lastWriteErrorMsg } = storeToRefs(productStore)
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

   productStore.fetchProducts() // do not wait with await

   useHead({ link: [{rel: 'stylesheet', href: '/_nuxt/assets/css/bootstrap3-un.css'}] })
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
    </div>
    <div class="filters row">
      <div class="form-group col-sm-3">
        <label for="search-element">Search product</label>
        <input v-model="searchKey" class="form-control" id="search-element" requred/>
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
          <NuxtLink v-if="product.id >= 0" :to="`/product/${product.id}/edit`" no-rel no-prefetch>{{ product.productName }}</NuxtLink>
          <span v-if="product.id < 0">{{ product.productName }}</span>
        </td>
        <td>{{ product.description }}</td>
        <td>
          {{ product.price }} €
        </td>
        <td>
          <NuxtLink v-if="product.id >= 0" class="btn btn-warning btn-xs" :to="`/product/${product.id}/edit`" no-rel no-prefetch>Edit</NuxtLink>
          <NuxtLink v-if="product.id >= 0" class="btn btn-danger btn-xs" :to="`/product/${product.id}/delete`" no-rel no-prefetch>Delete</NuxtLink>
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

.errors {
  color: red
}
</style>
