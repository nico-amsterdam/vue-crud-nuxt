<template>
  <span>
    <div class="form-group">
      <label for="edit-name">Name</label>
      <input class="form-control" id="edit-name" v-model="theProduct.name" required/>
    </div>
    <div class="form-group">
      <label for="edit-description">Description</label>
      <textarea class="form-control" id="edit-description" rows="3" v-model="theProduct.description"></textarea>
    </div>
    <div class="form-group">
      <label for="edit-price">Price <span class="glyphicon glyphicon-euro"></span></label>
      <input type="number" class="form-control" id="edit-price" v-model="theProduct.price"/>
    </div>
  </span>
</template>

<script>
  export default {
     name: 'ProductForm',
    props: ['theProduct']
  }
</script>
