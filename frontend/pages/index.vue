<template>
  <section>
    <div class="actions">
      <nuxt-link class="btn btn-default" :to="{path: '/add-product'}">
        <span class="glyphicon glyphicon-plus"></span>
        Add product
      </nuxt-link>
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
          <nuxt-link :to="{name: 'product-id-edit', params: {id: product.id}}">{{ product.name }}</nuxt-link>
        </td>
        <td>{{ product.description }}</td>
        <td>
          {{ product.price }}
          <span class="glyphicon glyphicon-euro" aria-hidden="true"></span>
        </td>
        <td>
          <nuxt-link class="btn btn-warning btn-xs" :to="{name: 'product-id-edit', params: {id: product.id}}">Edit</nuxt-link>
          <nuxt-link class="btn btn-danger btn-xs" :to="{name: 'product-id-delete', params: {id: product.id}}">Delete</nuxt-link>
        </td>
      </tr>
      </tbody>
    </table>
  </section>
</template>

<script>

export default {
  layout: 'vue-crud',
  data () {
    return { searchKey: '', products: this.$store.state.products }
  },
  computed : {
    filteredProducts () {
      return this.products.filter(product => product.name.toLowerCase().indexOf(this.searchKey.toLowerCase()) !== -1)
    }
  }
}
</script>

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
