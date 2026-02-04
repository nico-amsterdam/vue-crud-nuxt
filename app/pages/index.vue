<script setup lang="ts">
// auto-import import { useProductStore } from '@/stores/product'
// auto-import import { useI18n } from '#imports'
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { Icon } from '@iconify/vue'

const { locale, setLocale, locales, t } = useI18n()

const productStore = useProductStore()
const { productList, lastReadErrorMsg, lastWriteErrorMsg, reading } = storeToRefs(productStore)
const searchKey = ref('')

const filteredProducts = computed(() => {
  return productList.value.filter(product =>
    product.productName.toLowerCase().indexOf(searchKey.value.toLowerCase()) !== -1
    || product.description.toLowerCase().indexOf(searchKey.value.toLowerCase()) !== -1)
})

definePageMeta({
  middleware: 'auth',
  layout: 'vue-crud'
})

onMounted(() => {
  document.getElementById('search-element')?.focus()
})

function refresh() {
  if (!reading.value) productStore.fetchProducts() // do not wait with await
}

function onChangeLange() {
  setLocale(locale.value)
}

refresh() // initial load

useHead({
  htmlAttrs: { class: 'retro' },
  bodyAttrs: {
    class: computed(() => {
      return 'lang-' + locale.value
    })
  },
  link: [{ rel: 'manifest', href: '/manifest.webmanifest' }, { rel: 'apple-touch-icon', href: '/image/icon-192.png' }]
})
</script>

<template>
  <main class="product-list">
    <div class="errors">
      {{ lastWriteErrorMsg }}
      <p />
      {{ lastReadErrorMsg }}
    </div>
    <div class="form-actions">
      <select v-model="locale" @change="onChangeLange" id="choose-lang" name="language"
        class="form-control language-switcher" :aria-label="t('pages.index.language_selector_label')">
        <option v-for="loc in locales" :key="loc.code" :value="loc.code" :lang="loc.code">
          {{ loc.name ?? loc.code }}
        </option>
      </select>
      <NuxtLink class="btn btn-default" to="/add-product" no-rel>
        <Icon icon="tabler:plus" :title="t('pages.index.add_product_icon_title')" class="plussign" />
        {{ t('pages.index.add_product') }}
      </NuxtLink>
      <button type="button" class="btn refresh" :title="t('pages.index.refresh_button_title')" @click="refresh">
        <Icon flip="horizontal" icon="tabler:refresh" />
      </button>
    </div>
    <div class="filters row">
      <div class="form-group product-search">
        <label for="search-element">{{ t('pages.index.search_label') }}</label>
        <input v-model="searchKey" class="form-control" id="search-element" requred />
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">{{ t('pages.index.table.header.name') }}</th>
          <th scope="col">{{ t('pages.index.table.header.description') }}</th>
          <th scope="col" class="price">{{ t('pages.index.table.header.price') }}</th>
          <th scope="col" class="table-actions">{{ t('pages.index.table.header.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in filteredProducts">
          <td>
            <NuxtLink v-if="product.id >= 0" :to="`/product/${product.id}/edit`" no-rel no-prefetch>{{
              product.productName }}</NuxtLink>
            <span v-if="product.id < 0">{{ product.productName }}</span>
          </td>
          <td>
            {{ product.description }}
          </td>
          <td class="price">
            {{ product.price }} €
          </td>
          <td class="table-actions">
            <NuxtLink v-if="product.id >= 0" class="btn btn-warning btn-xs" :to="`/product/${product.id}/edit`" no-rel
              no-prefetch>{{ t('pages.index.table.actions.edit') }}</NuxtLink>
            <NuxtLink v-if="product.id >= 0" class="btn btn-danger btn-xs" :to="`/product/${product.id}/delete`" no-rel
              no-prefetch>{{ t('pages.index.table.actions.delete') }}</NuxtLink>
          </td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<style>
/* Skip link for accessibility - WCAG 2.4.1 Bypass Blocks */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px 16px;
  z-index: 10000;
  text-decoration: none;
  font-weight: bold;
  font-size: 14px;
  transition: top 0.2s ease-in-out
}

.skip-link:focus {
  top: 0;
  outline: 2px solid #fff;
  outline-offset: 2px
}

.form-group {
  max-width: 500px
}

.form-actions {
  padding: 10px 0
}

.plussign {
  vertical-align: bottom;
  font-size: 24px
}

.refresh {
  float: right;
  background: none;
  border: none;
  padding: 0
}

.form-actions .language-switcher {
  width: auto;
  margin-top: -48px;
  float: right
}

.btn.refresh:active {
  box-shadow: none
}

.refresh svg {
  font-size: 24px;
  margin: 5px 5px 0 5px
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

.refresh:active svg {
  color: lightblue;
  animation: spin 500ms linear 1
}

.refresh:not(:active) svg {
  /* keep color for 0.5 seconds */
  transition: color 500ms step-end
}

@media (min-width: 992px) {

  body .product-list .table .price {
    padding-right: 28px;
    width: 130px
  }
}

@media (min-width: 1200px) {

  body .product-list .table .price {
    padding-right: 58px;
    width: 160px
  }
}

.lang-en .table-actions {
  width: 112px
}

.lang-es .table-actions {
  width: 132px
}

.product-list .table .price {
  width: 102px;
  text-align: right
}
</style>
