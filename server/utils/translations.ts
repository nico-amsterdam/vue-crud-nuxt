import type { H3Event } from 'h3'

// Static imports for server-only translations
import enTranslations from '../../i18n/server-translations/en.json'
import frTranslations from '../../i18n/server-translations/fr.json'
import deTranslations from '../../i18n/server-translations/de.json'
import esTranslations from '../../i18n/server-translations/es.json'

// Server-only translation utility - static loading
const serverTranslations: Record<string, any> = {
  en: enTranslations,
  fr: frTranslations,
  de: deTranslations,
  es: esTranslations
}

export function getServerTranslation(event: H3Event) {
  // Get locale from header, cookie, or default
  const locale = getHeader(event, 'accept-language')?.split(',')[0]?.substring(0, 2) ||
                getCookie(event, 'i18n_locale') ||
                'en'

  const supportedLocales = ['en', 'fr', 'de', 'es'] as const
  const effectiveLocale = supportedLocales.includes(locale as any) ? locale : 'en'

  // Get translations directly from static imports
  const translations = serverTranslations[effectiveLocale] || serverTranslations['en']

  // Return translation function
  return function t(key: string, params?: Record<string, any>): string {
    let result: any = translations

    if (result && typeof result === 'object' && key in result) {
      result = result[key]
    } else {
      return key // Return key if translation not found
    }

    if (typeof result === 'string' && params) {
      // Simple parameter replacement
      return result.replace(/\{(\w+)\}/g, (match, paramName) => {
        return params[paramName] || match
      })
    }

    return typeof result === 'string' ? result : key
  }
}