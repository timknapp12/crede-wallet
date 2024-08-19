import formatCurrency, { formatNumber, trimZerosFromNumber } from '.'

describe('Format Currency', () => {
  test('Shows dollar sign for USD English', () => {
    const amount = 12
    const currencyCode = 'USD'
    const currentLanguage = 'en'

    const output = `$12.00 USD`

    expect(formatCurrency(amount, currencyCode, currentLanguage)).toBe(output)
  })
  test('Converts string to number - shows dollar sign for USD English', () => {
    const amount = '12'
    const currencyCode = 'USD'
    const currentLanguage = 'en'

    const output = `$12.00 USD`

    expect(formatCurrency(amount, currencyCode, currentLanguage)).toBe(output)
  })
  test('Shows euro sign for EUR English', () => {
    const amount = 12
    const currencyCode = 'EUR'
    const currentLanguage = 'en'

    const output = `€12.00 EUR`

    expect(formatCurrency(amount, currencyCode, currentLanguage)).toBe(output)
  })
  test('Shows euro sign for EUR German', () => {
    const amount = 12
    const currencyCode = 'EUR'
    const currentLanguage = 'de'

    const output = `12,00\xa0€ EUR`

    expect(formatCurrency(amount, currencyCode, currentLanguage)).toBe(output)
  })
})

describe('Format Numbers', () => {
  test('convert long string to number with commas in EN', () => {
    const amount = '1234567890'
    const languageCode = 'en'

    const output = '1,234,567,890'
    expect(formatNumber(amount, languageCode)).toBe(output)
  })
  test('convert long string to number with decimals in DE', () => {
    const amount = '1234567890'
    const languageCode = 'de'

    const output = '1.234.567.890'
    expect(formatNumber(amount, languageCode)).toBe(output)
  })
  test('convert long number with decimals in DE', () => {
    const amount = 1234567890
    const languageCode = 'de'

    const output = '1.234.567.890'
    expect(formatNumber(amount, languageCode)).toBe(output)
  })
})

describe('Trim Zeros From Number', () => {
  test('trim trailing zeros from a decimal number in EN locale', () => {
    const amount = 1234.56
    const languageCode = 'en'

    const output = '1,234.56'
    expect(trimZerosFromNumber(amount, languageCode)).toBe(output)
  })

  test('trim trailing zeros and decimal point from an integer in EN locale', () => {
    const amount = 9876.0
    const languageCode = 'en'

    const output = '9,876'
    expect(trimZerosFromNumber(amount, languageCode)).toBe(output)
  })

  test('trim trailing zeros from a decimal number in DE locale', () => {
    const amount = 1234.56
    const languageCode = 'de'

    const output = '1.234,56'
    expect(trimZerosFromNumber(amount, languageCode)).toBe(output)
  })

  test('trim trailing zeros and comma from an integer in DE locale', () => {
    const amount = 9876.0
    const languageCode = 'de'

    const output = '9.876'
    expect(trimZerosFromNumber(amount, languageCode)).toBe(output)
  })

  test('handle a large number with trailing zeros in EN locale', () => {
    const amount = 1234567890.0
    const languageCode = 'en'

    const output = '1,234,567,890'
    expect(trimZerosFromNumber(amount, languageCode)).toBe(output)
  })

  test('process a number without trailing zeros in DE locale', () => {
    const amount = 1234.5678
    const languageCode = 'de'

    const output = '1.234,5678'
    expect(trimZerosFromNumber(amount, languageCode)).toBe(output)
  })
})
