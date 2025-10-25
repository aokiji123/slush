import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translation files
import enCommon from '../locales/en/common.json'
import enAuth from '../locales/en/auth.json'
import enSettings from '../locales/en/settings.json'
import enStore from '../locales/en/store.json'
import enLibrary from '../locales/en/library.json'
import enGame from '../locales/en/game.json'
import enCart from '../locales/en/cart.json'
import enErrors from '../locales/en/errors.json'
import enChat from '../locales/en/chat.json'

import ukCommon from '../locales/uk/common.json'
import ukAuth from '../locales/uk/auth.json'
import ukSettings from '../locales/uk/settings.json'
import ukStore from '../locales/uk/store.json'
import ukLibrary from '../locales/uk/library.json'
import ukGame from '../locales/uk/game.json'
import ukCart from '../locales/uk/cart.json'
import ukErrors from '../locales/uk/errors.json'
import ukChat from '../locales/uk/chat.json'

const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    settings: enSettings,
    store: enStore,
    library: enLibrary,
    game: enGame,
    cart: enCart,
    errors: enErrors,
    chat: enChat,
  },
  uk: {
    common: ukCommon,
    auth: ukAuth,
    settings: ukSettings,
    store: ukStore,
    library: ukLibrary,
    game: ukGame,
    cart: ukCart,
    errors: ukErrors,
    chat: ukChat,
  },
}

// Clear any unsupported language from localStorage
const storedLang = localStorage.getItem('i18nextLng')
if (storedLang && !['en', 'uk'].includes(storedLang)) {
  localStorage.removeItem('i18nextLng')
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'uk',
    supportedLngs: ['en', 'uk'],
    debug: process.env.NODE_ENV === 'development',
    
    // Language detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    
    // Namespace configuration
    defaultNS: 'common',
    ns: ['common', 'auth', 'settings', 'store', 'library', 'game', 'cart', 'errors', 'chat'],
    
    // Enable namespace fallback
    fallbackNS: 'common',
    
    // Force fallback to supported language
    load: 'languageOnly',
    
    // Interpolation options
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    // React specific options
    react: {
      useSuspense: true,
    },
  })

export default i18n
