<script setup lang="ts">
import { Icon } from '@iconify/vue'

useHead({
    bodyAttrs: { class: 'auth' }
  , link: [{ rel: 'stylesheet', href: '/_nuxt/assets/css/auth.css' }]
})
</script>

<template>
    <main>
        <section class="authenticate">
            <header class="row titlebar">
                <h1 class="column">Vue crud Nuxt demo</h1>
                <Icon icon="tabler:sun" :ssr="true" title="Dark mode swith" class="darkmode" />
            </header>
            <div class="row signup_or_signin">
                <article class="column signup">
                    <h2>Sign Up</h2>
                    <form>
                        <div class="input-group">
                            <input type="text" placeholder="Username" required>
                        </div>
                        <div class="input-group">
                            <input type="text" placeholder="Full Name" required>
                        </div>
                        <button type="submit">Sign Up</button>
                    </form>
                </article>

                <div class="column divider">
                    <span>or</span>
                </div>

                <article class="column signin">
                    <h2>Sign In</h2>
                    <form>
                        <div class="input-group">
                            <input type="text" placeholder="Username" required>
                        </div>
                        <button type="submit">Sign In</button>
                    </form>
                </article>
            </div>
        </section>
    </main>
</template>
