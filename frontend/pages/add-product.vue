<template>
    <section>
    <h2>Add new product</h2>
    <form v-on:submit.prevent="createProduct">
      <div class="form-group">
        <label for="add-name">Name</label>
        <input class="form-control" id="add-name" v-model="product.name" required/>
      </div>
      <div class="form-group">
        <label for="add-description">Description</label>
        <textarea class="form-control" id="add-description" rows="10" v-model="product.description"></textarea>
      </div>
      <div class="form-group">
        <label for="add-price">Price <span class="glyphicon glyphicon-euro"></span></label>
        <input type="number" class="form-control" id="add-price" v-model="product.price"/>
      </div>
      <button type="submit" class="btn btn-primary">Create</button>
      <nuxt-link to="/" class="btn btn-default">Cancel</nuxt-link>
    </form>
  </section>
</template>

<script>

export default {
  layout: 'vue-crud',
  data () {
    return {product: {id: null, name: '', description: '', price: '', features: []}}
  },
  methods: {
    createProduct (e) {
      this.$store.commit('ADD_PRODUCT', this.product)
      this.$router.push('/')
    }
  }
}
</script>

