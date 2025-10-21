import 'react-i18next'
import type common from '../locales/en/common.json'
import type auth from '../locales/en/auth.json'
import type settings from '../locales/en/settings.json'
import type store from '../locales/en/store.json'
import type library from '../locales/en/library.json'
import type game from '../locales/en/game.json'
import type cart from '../locales/en/cart.json'
import type errors from '../locales/en/errors.json'

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: {
      common: typeof common
      auth: typeof auth
      settings: typeof settings
      store: typeof store
      library: typeof library
      game: typeof game
      cart: typeof cart
      errors: typeof errors
    }
  }
}
