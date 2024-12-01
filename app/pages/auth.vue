<script setup lang="ts">
import { Icon } from '@iconify/vue'

type ErrorType = {
  message: string
}

const username = ref(''), name = ref(''), darkmode = ref(false)
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
    bodyAttrs: { class: 'auth' }
  , link: [{ rel: 'stylesheet', href: '/_nuxt/assets/css/auth.css' }]
})
</script>

<template>
    <main :class="{ dark: darkmode }">
        <section class="authenticate">
            <header class="row titlebar">
                <h1 class="column">Vue crud Nuxt demo</h1>
                <Icon v-if="!darkmode" icon="tabler:sun" :ssr="true" title="Dark mode swith" class="darkmode" @click="toggleDark"/>
                <Icon v-if="darkmode" icon="tabler:moon" :ssr="true" title="Dark mode swith" class="darkmode" @click="toggleDark"/>
            </header>
            <ul class="errors flash">
                <li v-for="error in errors">
                    {{ error.message }}
                </li>
            </ul>
            <div class="row signup_or_signin">
                <article class="column signup">
                    <h2>Sign Up</h2>
                    <form @submit.prevent="signUp">
                        <div class="input-group">
                            <input type="text" v-model="username" placeholder="Username" id="signup-username" required>
                        </div>
                        <div class="input-group">
                            <input type="text" v-model="name" placeholder="Full Name" id="signup-name" required>
                        </div>
                        <button type="submit">Sign Up</button>
                    </form>
                </article>

                <div class="column divider">
                    <span>or</span>
                </div>

                <article class="column signin">
                    <h2>Sign In</h2>
                    <form @submit.prevent="signIn">
                        <div class="input-group">
                            <input type="text" v-model="username" placeholder="Username" id="signin-username" required>
                        </div>
                        <button type="submit">Sign In</button>
                    </form>
                </article>
            </div>
        </section>
    </main>
</template>
