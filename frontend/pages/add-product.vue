<template>
    <section>
    <h2>Add new product</h2>
    <form v-on:submit.prevent="createProduct">
      <product-form :the-product="product"></product-form>
      <button type="submit" class="btn btn-primary">Create</button>
      <nuxt-link to="/" class="btn btn-default">Cancel</nuxt-link>
    </form>
  </section>
</template>

<script>
 import ProductForm from '../components/product-form.vue'

export default {
  components: { ProductForm },
  layout: 'vue-crud',
  data () {
    return {"product": {id: null, name: '', description: '', price: '', features: []}}
  },
  methods: {
    createProduct (e) {
      // normally use store.commit, but as example, if REST backend is used, call store.dispatch action.
      this.$store.dispatch('addProduct', this.product)
      this.$router.push('/')
    }
  }
}
</script>

