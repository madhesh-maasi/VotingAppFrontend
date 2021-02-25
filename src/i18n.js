
import i18n from 'i18next'
import Backend from 'i18next-xhr-backend'
import { initReactI18next } from 'react-i18next';
//import LanguageDetector from 'i18next-browser-languagedetector';
const Languages = ['en-US', 'swedish']


i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: 'en-US',
    backend: {      
      loadPath: '/assets/i18n/{{ns}}/{{lng}}.json'
    },
    fallbackLng: 'en-US',
    debug: true,
     ns: ['translations'],
    defaultNS: 'translations',
    keySeparator: false,
    interpolation: {
      escapeValue: false,
      formatSeparator: ','
    },
    react: {
      wait: true
    }
  })
	

export default i18n
