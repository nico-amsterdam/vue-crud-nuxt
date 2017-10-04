<template>
  <section>
    <h2>Edit product</h2>
    <form v-on:submit.prevent="updateProduct">
      <div class="form-group">
        <label for="edit-name">Name</label>
        <input class="form-control" id="edit-name" v-model="product.name" required/>
      </div>
      <div class="form-group">
        <label for="edit-description">Description</label>
        <textarea class="form-control" id="edit-description" rows="3" v-model="product.description"></textarea>
      </div>
      <div class="form-group">
        <label for="edit-price">Price <span class="glyphicon glyphicon-euro"></span></label>
        <input type="number" class="form-control" id="edit-price" v-model="product.price"/>
      </div>
      <button type="submit" class="btn btn-primary">Save</button>
      <nuxt-link to="/" class="btn btn-default">Cancel</nuxt-link>
    </form>
  </section>
</template>

<script>

export default {
  layout: 'vue-crud',
  data () {
    return {product: this.$store.state.products.find(product => product.id === this.$route.params.product_id)};
  },
  methods: {
    updateProduct (e) {
      e.preventDefault()
      this.$store.commit('UPDATE_PRODUCT', this.product)
      this.$router.push('/')
    }
  }
}
</script>

