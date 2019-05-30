<template>
  <section>
    <h2>Delete product {{ product.name }}</h2>
    <form v-on:submit.prevent="deleteProduct">
      <p>The action cannot be undone.</p>
      <button type="submit" class="btn btn-danger">Delete</button>
      <nuxt-link to="/" class="btn btn-default">Cancel</nuxt-link>
    </form>
  </section>
</template>

<script>

export default {
  layout: 'vue-crud',
  data () {
    return {"product": this.$store.state.products.find(product => product.id === this.$route.params.id)};
  },
  methods: {
    deleteProduct (e) {
      this.$store.commit('DELETE_PRODUCT', this.product)
      this.$router.push('/')
    }
  }
}
</script>
