const formatCurrency = (
  amount,
  currencyCode = 'USD',
  languageCode = 'en',
  hideCurrencyCode = false
) => {
  const formattedAmount = Number(amount).toLocaleString(languageCode, {
    style: 'currency',
    currency: currencyCode,
    currencyDisplay: 'symbol',
  })

  return hideCurrencyCode ? formattedAmount : `${formattedAmount} ${currencyCode}`
}

export default formatCurrency

export const formatNumber = (amount, languageCode = 'en', toFixed = undefined) => {
  const options = {}
  if (toFixed !== undefined) {
    options.minimumFractionDigits = toFixed
    options.maximumFractionDigits = toFixed
  }
  return Number(amount).toLocaleString(languageCode, options)
}

export const trimZerosFromNumber = (amount, languageCode = 'en', toFixed = 6) => {
  const options = {
    minimumFractionDigits: 0,
    maximumFractionDigits: toFixed,
  }
  let formattedNumber = Number(amount).toLocaleString(languageCode, options)
  const decimalSeparator = (1.1).toLocaleString(languageCode).substring(1, 2)
  const regex = new RegExp(
    `(\\${decimalSeparator}\\d*?[1-9])0+$|\\${decimalSeparator}0*$`
  )
  formattedNumber = formattedNumber.replace(regex, '$1')

  return formattedNumber
}
