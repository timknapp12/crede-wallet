import * as Localization from 'expo-localization'
import i18n from 'i18next'
import 'intl-pluralrules'

export const detectLanguage = async () => {
  try {
    const { languageCode } = await Localization.getLocales()[0]
    return languageCode
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error detecting language:', error)
    return 'en' // Default to English in case of an error
  }
}

// Function to initialize i18n with a specific language
export const initializeI18n = async () => {
  const language = await detectLanguage()

  await i18n.init({
    lng: language,
    fallbackLng: 'en',
    resources: {
      en: {
        translations: require('./en.json'),
      },
      es: {
        translations: require('./es.json'),
      },
      de: {
        translations: require('./de.json'),
      },
    },
    ns: ['translations'],
    defaultNS: 'translations',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  })
}

initializeI18n()

export default i18n
