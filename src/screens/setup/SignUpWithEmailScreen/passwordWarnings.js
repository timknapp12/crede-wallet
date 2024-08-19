/* eslint-disable no-useless-escape */
// prettier-ignore
import i18n from 'translations/config';

const { t } = i18n

const getTranslatedWarning = warning => {
  const warningTranslationMap = {
    'This is a top-10 common password': t('This is a top-10 common password'),
    'This is a top-100 common password': t('This is a top-100 common password'),
    'This is a very common password': t('This is a very common password'),
    'This is similar to a commonly used password': t(
      'This is similar to a commonly used password'
    ),
    'A word by itself is easy to guess': t('A word by itself is easy to guess'),
    'Names and surnames by themselves are easy to guess': t(
      'Names and surnames by themselves are easy to guess'
    ),
    'Common names and surnames are easy to guess': t(
      'Common names and surnames are easy to guess'
    ),
    'Straight rows of keys are easy to guess': t(
      'Straight rows of keys are easy to guess'
    ),
    'Short keyboard patterns are easy to guess': t(
      'Short keyboard patterns are easy to guess'
    ),
    'Repeats like "aaa" are easy to guess': t(`Repeats like 'aaa' are easy to guess`),
    'Repeats like "abcabcabc" are only slightly harder to guess than "abc"': t(
      `Repeats like 'abcabcabc' are only slightly harder to guess than 'abc'`
    ),
    'Sequences like abc or 6543 are easy to guess': t(
      'Sequences like abc or 6543 are easy to guess'
    ),
    'Recent years are easy to guess': t('Recent years are easy to guess'),
    'Dates are often easy to guess': t('Dates are often easy to guess'),
  }
  return warningTranslationMap[warning] || warning
}

export default getTranslatedWarning
