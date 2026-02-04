<script setup lang="ts">
import { Icon } from '@iconify/vue'
const { t } = useI18n()

const { loggedIn, user, clear } = useUserSession()
</script>

<template>
  <div class="container">
    <header class="page-header">
      <div class="branding">
        <img src="https://vuejs.org/images/logo.png" :alt="t('layouts.vue-crud.logo_alt')" title="Vue logo" class="logo"/>
        <span class="user">
          {{user?.name}}
          <button type="button" v-if="loggedIn" @click="clear" :title="t('layouts.vue-crud.logout_title')" class="btn btn-default logout">
            <Icon icon="tabler:logout" :title="t('layouts.vue-crud.logout_title')" class="exit-run"/>{{ t('layouts.vue-crud.logout_text') }}
          </button>
        </span>
        <h1>{{ t('layouts.vue-crud.page_title') }}</h1>
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
  margin-left: 5px
}

.exit-run {
  margin-right: 10px
}
</style>
