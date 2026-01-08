<script setup lang="ts">
import { Icon } from '@iconify/vue'

const { loggedIn, user, clear } = useUserSession()
</script>

<template>
  <div class="container">
    <header class="page-header">
      <div class="branding">
        <img src="https://vuejs.org/images/logo.png" alt="Logo" title="Vue logo" class="logo"/>
        <span class="user">
          {{user?.name}}
          <button v-if="loggedIn" @click="clear" title="Logout" class="btn btn-default logout">
            <Icon icon="tabler:logout" title="Logout" class="exit-run"/>Logout
          </button>
        </span>
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

.branding .user {
  float:right;
}

.logout {
  margin-left: 8px
}

.exit-run {
  margin-right: 10px
}
</style>
