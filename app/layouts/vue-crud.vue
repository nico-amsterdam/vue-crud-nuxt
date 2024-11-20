<template>
  <div class="container">
    <header class="page-header">
      <div class="branding">
        <img src="https://vuejs.org/images/logo.png" alt="Logo" title="Home page" class="logo"/>
        <h1>Vue CRUD</h1>
      </div>
    </header>
    <slot />
  </div>
</template>

<style>

.logo {
  width: 50px;
  float: left;
  margin-right: 15px;
}

.btn {
  margin-right: 5px
}
</style>
