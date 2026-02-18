<script setup lang="ts">
import { Icon } from '@iconify/vue'

/*
 * Variables
 */

const { locale, t } = useI18n()
const { loggedIn, user, clear } = useUserSession()
const productStore = useProductStore()
const { darkmode } = storeToRefs(productStore)

/*
 * Functions
 */

function toggleDark() {
  darkmode.value = !darkmode.value
}

useHead({
  htmlAttrs: { class: 'retro' },
  bodyAttrs: {
    class: computed(() => {
      return 'container lang-' + locale.value + (darkmode.value ? ' dark' : '')
    })
  },
  link: [{ rel: 'manifest', href: '/manifest.webmanifest' }, { rel: 'apple-touch-icon', href: '/image/icon-192.png' }]
})

</script>

<template>
  <a href="#main" id="skip-link" class="skip-link">{{ t('layouts.vue-crud.skip_link') }}</a>
  <div class="container">
    <header class="page-header">
      <div class="branding">
        <img src="https://vuejs.org/images/logo.png" :alt="t('layouts.vue-crud.vue_logo_alt')" class="logo"/>
        <span class="user">
          {{user?.name}}
          <button type="button" v-if="loggedIn" @click="clear" class="btn btn-default logout">
            <Icon icon="tabler:logout" :title="t('layouts.vue-crud.logout_title')" class="exit-run"/>{{ t('layouts.vue-crud.logout_text') }}
          </button>
        </span>
        <h1>{{ t('layouts.vue-crud.page_title') }}</h1>
        <span class="color-scheme">
          <Icon v-if="!darkmode" aria-hidden="false" role="button" icon="tabler:sun" width="1.5em" :title="t('pages.auth.dark_mode_switch_title')" class="sun"
            @click="toggleDark" />
          <Icon v-if="darkmode" aria-hidden="false" role="button" icon="tabler:moon" width="1.5em" :title="t('pages.auth.dark_mode_switch_title')" class="moon"
            @click="toggleDark" />
        </span>
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

.page-header h1 {
  display: inline-block
}

.color-scheme {
  margin-left: 30px;
  margin-right: 10px
}
</style>
