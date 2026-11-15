<script setup lang="ts">
// auto-import import { useProductStore } from '@/stores/product'
// auto-import import { useI18n } from '#imports'
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { Icon } from '@iconify/vue'
import { watchDebounced } from '@vueuse/core'
import { length } from 'zod'

/*
 * Variables
 */

const { locale, setLocale, locales, t } = useI18n()
const productStore = useProductStore()
const { productList, lastReadErrorMsg, lastWriteErrorMsg, searchKey, serverSearch, hasMore } = storeToRefs(productStore)
const filteredProducts = computed(() => {
  if (productStore.serverSearch) {
    // Many rows: the server filters the products with findbyname,
    // the client does not have all rows to filter on.
    return productList.value
  }
  return productList.value.filter(product =>
    product.productName.toLowerCase().indexOf(searchKey.value.toLowerCase()) !== -1
    || product.description.toLowerCase().indexOf(searchKey.value.toLowerCase()) !== -1
    || (product.price && product.price.toString().indexOf(searchKey.value) !== -1))
})

/*
 * Functions
 */

function refresh(clearErrors: boolean) {
  if (clearErrors) productStore.clearErrors()
  productStore.fetchProducts() // do not wait with await
}

function onChangeLang() {
  productStore.clearErrors()
  setLocale(locale.value)
}

/*
 * Inits
 */

refresh(false) // initial load

// With many rows the search is done on the server (findbyname rest call)
watchDebounced(searchKey, () => {
  if (productStore.serverSearch) {
    productStore.searchProductsByName(searchKey.value)
  }
}, { debounce: 300 })

// When the strategy switches to server-side search, apply the typed search phrase
watch(() => productStore.serverSearch, (serverSearch) => {
  if (serverSearch && searchKey.value !== '') {
    productStore.searchProductsByName(searchKey.value)
  }
}

)

// Infinite scroll: load more rows when the user has scrolled near the bottom
// of the product table. Fires the store's loadMoreProducts, and if more pages
// are available keeps loading until the sentinel moves out of the viewport.
let scrollThrottle: number | null = null
const scrollThreshold = 200 // px from bottom before loading more

onMounted(() => {
  document.getElementById('search-element')?.focus()
})

onUnmounted(() => {
  if (scrollThrottle !== null) {
    window.clearTimeout(scrollThrottle)
    window.removeEventListener('scroll', handleScroll, { passive: true })
  }
})

function handleScroll() {
  // Throttle to ~60Hz to avoid flooding the store
  if (scrollThrottle !== null) {
    window.clearTimeout(scrollThrottle)
  }
  scrollThrottle = window.setTimeout(() => {
    const main = document.getElementById('main') as HTMLElement
    if (!main) return
    const table = main.querySelector('table') as HTMLTableElement
    if (!table) return
    const rect = table.getBoundingClientRect()
    const scrollBottom = rect.bottom + window.scrollY
    const viewportBottom = window.innerHeight + window.scrollY
    // If we're within threshold of the table's bottom, load more
    if (viewportBottom - scrollBottom < scrollThreshold && !productStore.loadingMore) {
      productStore.loadMoreProducts().then(loaded => {
        if (loaded && productStore.hasMore) {
          // Small delay to let rows render before next scroll check
          setTimeout(handleScroll, 50)
        }
      })
    }
  }, 16)
}

window.addEventListener('scroll', handleScroll, { passive: true })

/*
 * Page settings
 */

definePageMeta({
  middleware: 'auth',
  layout: 'vue-crud'
})

</script>

<template>
  <main id="main" class="product-list">
    <div class="form-actions">
      <select v-model="locale" @change="onChangeLang" id="choose-lang" name="language"
        class="form-control language-switcher" :aria-label="t('pages.index.language_selector_label')">
        <option v-for="loc in locales" :key="loc.code" :value="loc.code" :lang="loc.code">
          {{ loc.name ?? loc.code }}
        </option>
      </select>
      <div class="error" v-if="lastReadErrorMsg !== '' || lastWriteErrorMsg !== ''">
        {{ lastWriteErrorMsg }}
        <p v-if="lastReadErrorMsg !== '' && lastWriteErrorMsg !== ''" />
        {{ lastReadErrorMsg }}
      </div>
      <NuxtLink class="btn btn-default" to="/products/new" no-rel>
        <Icon icon="tabler:plus" :title="t('pages.index.add_product_icon_title')" class="plussign" />
        {{ t('pages.index.add_product') }}
      </NuxtLink>
      <button type="button" class="btn refresh" :title="t('pages.index.refresh_button_title')" @click="refresh(true)">
        <Icon flip="horizontal" icon="tabler:refresh" />
      </button>
    </div>
    <div class="filters row">
      <div class="form-group product-search">
        <label for="search-element">{{ serverSearch
          ? t('pages.index.search_label_by_name')
          : t('pages.index.search_label') }}</label>
        <input v-model="searchKey" class="form-control" id="search-element"
          aria-description="t('pages.index.search_description')" requred />
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
            <NuxtLink v-if="product.id >= 0" :to="`/products/${product.id}/edit`" no-rel no-prefetch>{{
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
            <NuxtLink v-if="product.id >= 0" class="btn btn-warning btn-xs" :to="`/products/${product.id}/edit`" no-rel
              no-prefetch>{{ t('pages.index.table.actions.edit') }}</NuxtLink>
            {{ ' ' }}
            <NuxtLink v-if="product.id >= 0" class="btn btn-danger btn-xs" :to="`/products/${product.id}/delete`" no-rel
              no-prefetch>{{ t('pages.index.table.actions.delete') }}</NuxtLink>
          </td>
        </tr>
      </tbody>
      <tfoot id="search-results-footer">
        <tr id="announceResults" aria-live="assertive" aria-atomic="true">
          <td v-if="productList.length === 0 && searchKey === ''" id="noResults" colspan="4">{{
            t('pages.index.results.no_products_available') }}</td>
          <td v-else-if="filteredProducts.length === 0" id="noResults" colspan="4">{{
            t('pages.index.results.no_search_results_found') }}</td>
        </tr>
      </tfoot>
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
  margin-top: -28px;
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
