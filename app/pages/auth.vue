<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useMediaQuery } from '@vueuse/core'

const { t } = useI18n()

type ErrorType = {
  message: string
}

const isPreferredDark = useMediaQuery('(prefers-color-scheme: dark)')
const username = ref(''), name = ref(''), darkmode = ref(isPreferredDark.value)
const errors = ref<ErrorType[]>([])
const { fetch } = useUserSession()
const { register, authenticate } = useWebAuthn()

async function signUp() {
  errors.value = []
  await register({
    userName: username.value,
    displayName: name.value
  })
    .then(fetch)
    .then(async () => await navigateTo('/'))
    .catch((error) => {
      errors.value.push({
        message: error.data?.message || error.message
      })
    })
}

async function signIn() {
  errors.value = []
  await authenticate(username.value)
    .then(fetch)
    .then(async () => await navigateTo('/'))
    .catch((error) => {
      errors.value.push({
        message: error.data?.message || error.message
      })
    })
}

function toggleDark() {
  darkmode.value = !darkmode.value
}

useHead({
    htmlAttrs: { class: 'auth' }
  , bodyAttrs: { class: computed(() => {
                          return darkmode.value ? 'dark' : ''
                        })
    }
  , link: [{ rel: 'stylesheet', href: '/css/auth.css' }]
})
</script>

<template>
    <main>
        <section class="authenticate">
            <header class="row titlebar">
                <h1 class="column">{{ t('pages.auth.title') }}</h1>
                <Icon v-if="!darkmode" icon="tabler:sun" :title="t('pages.auth.dark_mode_switch_title')" class="darkmode" @click="toggleDark"/>
                <Icon v-if="darkmode" icon="tabler:moon" :title="t('pages.auth.dark_mode_switch_title')" class="darkmode" @click="toggleDark"/>
            </header>
            <ul class="errors flash">
                <li v-for="error in errors">
                    {{ error.message }}
                </li>
            </ul>
            <div class="row signup_or_signin">
                <article class="column signup">
                    <h2>{{ t('pages.auth.signup.title') }}</h2>
                    <form @submit.prevent="signUp">
                        <div class="input-group">
                            <input type="text" v-model="username" :placeholder="t('pages.auth.signup.username_placeholder')" id="signup-username" required>
                        </div>
                        <div class="input-group">
                            <input type="text" v-model="name" :placeholder="t('pages.auth.signup.fullname_placeholder')" id="signup-name" required>
                        </div>
                        <button type="submit">{{ t('pages.auth.signup.button') }}</button>
                    </form>
                </article>

                <div class="column divider">
                    <span>{{ t('pages.auth.divider.or') }}</span>
                </div>

                <article class="column signin">
                    <h2>{{ t('pages.auth.signin.title') }}</h2>
                    <form @submit.prevent="signIn">
                        <div class="input-group">
                            <input type="text" v-model="username" :placeholder="t('pages.auth.signin.username_placeholder')" id="signin-username" required>
                        </div>
                        <button type="submit">{{ t('pages.auth.signin.button') }}</button>
                    </form>
                </article>
            </div>
        </section>
    </main>
</template>
