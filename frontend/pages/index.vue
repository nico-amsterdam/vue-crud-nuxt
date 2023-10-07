<script setup lang="ts">
   import { ref, computed } from 'vue'
   import { storeToRefs } from 'pinia'
// auto import:   import { useProductStore } from '@stores/product'

   const productStore = useProductStore()
   const { productList } = productStore
   const searchKey = ''

   const filteredProducts = computed(() => {
      return productList.filter(product => product.name.toLowerCase().indexOf(searchKey.toLowerCase()) !== -1)
    })

    definePageMeta({
      layout: "vue-crud"
    })
</script>

<template>
  <section>
    <div class="actions">
      <NuxtLink class="btn btn-default" to="/add-product" no-rel>
        <span class="glyphicon glyphicon-plus"></span>
        Add product
      </NuxtLink>
    </div>
    <div class="filters row">
      <div class="form-group col-sm-3">
        <label for="search-element">Product name</label>
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
          <NuxtLink class="btn btn-warning btn-xs" :to="`/product/${product.id}/edit`" no-rel>{{ product.name }}</NuxtLink>
        </td>
        <td>{{ product.description }}</td>
        <td>
          {{ product.price }}
          <span class="glyphicon glyphicon-euro" aria-hidden="true"></span>
        </td>
        <td>
          <NuxtLink class="btn btn-warning btn-xs" :to="`/product/${product.id}/edit`" no-rel>Edit</NuxtLink>
          <NuxtLink class="btn btn-danger btn-xs" :to="`/product/${product.id}/delete`" no-rel>Delete</NuxtLink>
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

.glyphicon-euro {
  font-size: 12px;
}
</style>
