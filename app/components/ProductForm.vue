<script setup lang="ts">
  defineProps(['theProduct'])
</script>

<template>
  <span>
    <div class="form-group">
      <label for="edit-name">Name</label>
      <input class="form-control" id="edit-name" v-model="theProduct.productName" required/>
    </div>
    <div class="form-group">
      <label for="edit-description">Description</label>
      <textarea class="form-control" id="edit-description" rows="3" v-model="theProduct.description" required></textarea>
    </div>
    <div class="form-group">
      <label for="edit-price">Price €</label>
      <input type="number" class="form-control" id="edit-price" v-model="theProduct.price"/>
    </div>
  </span>
</template>
