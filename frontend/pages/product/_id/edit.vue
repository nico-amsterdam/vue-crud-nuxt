<template>
  <section>
    <h2>Edit product</h2>
    <form v-on:submit.prevent="updateProduct">
      <product-form :the-product="product"></product-form>
      <button type="submit" class="btn btn-primary">Save</button>
      <nuxt-link to="/" class="btn btn-default">Cancel</nuxt-link>
    </form>
  </section>
</template>

<script>
 import ProductForm from '../../../components/product-form.vue'

export default {
  components: { ProductForm },
  layout: 'vue-crud',
  data () {
    // deep-clone the product (using JSON stringify + parse) to prevent that changes are applied directly.
    // Direct manipulation goes wrong when validation error occurs and user cancels.
    // Only change via mutations.
    return {"product": JSON.parse(JSON.stringify(this.$store.state.products.find(product => product.id === this.$route.params.id)))};
  },
  methods: {
    updateProduct (e) {
      this.$store.commit('UPDATE_PRODUCT', this.product)
      this.$router.push('/')
    }
  }
}
</script>

