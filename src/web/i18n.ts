import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

i18n.use(LanguageDetector).use(initReactI18next).init({
  // we init with resources
  resources: {
    en: {
      translations: {
        home: 'home',
        settings: 'settings'
      }
    },
    zh: {
      translations: {
        home: '主页',
        settings: '设置'
      }
    }
  },
  fallbackLng: 'zh',
  debug: true,

  // have a common namespace used around the full app
  ns: ['translations'],
  defaultNS: 'translations',

  keySeparator: false, // we use content as keys

  interpolation: {
    escapeValue: false
  }
}).then()

export default i18n
