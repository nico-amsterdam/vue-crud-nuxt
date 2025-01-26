<script setup lang="ts">
  import { onMounted } from 'vue'
  defineProps(['theProduct'])

  onMounted(() => {
    document.getElementById('edit-name')?.focus()
  })
</script>

<template>
  <span>
    <div class="form-group">
      <label for="edit-name">Name</label>
      <input class="form-control" id="edit-name" v-model="theProduct.productName" required maxlength="20"/>
    </div>
    <div class="form-group">
      <label for="edit-description">Description</label>
      <textarea class="form-control" id="edit-description" rows="3" v-model="theProduct.description" required maxlength="300"></textarea>
    </div>
    <div class="form-group">
      <label for="edit-price">Price €</label>
      <input type="number" class="form-control" id="edit-price" v-model="theProduct.price" max="99999999999"/>
    </div>
  </span>
</template>
