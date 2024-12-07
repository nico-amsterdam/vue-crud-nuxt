<script setup lang="ts">
import { Icon } from '@iconify/vue'

const { loggedIn, user, clear } = useUserSession()
</script>

<template>
  <div class="container">
    <header class="page-header">
      <div class="branding">
        <img src="https://vuejs.org/images/logo.png" alt="Logo" title="Home page" class="logo"/>
        <button v-if="loggedIn" @click="clear" :title="user?.name" class="btn btn-default logout">
          <Icon icon="tabler:logout" title="Logout" class="exit-run"/>Logout
        </button>
        <h1>Vue CRUD Nuxt</h1>
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

.logout {
  float:right
}

.exit-run {
  margin-right: 10px
}
</style>
