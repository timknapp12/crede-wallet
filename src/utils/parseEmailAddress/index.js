const privateAppleAddress = 'privaterelay.appleid.com'

const parseEmailAddress = (email = '') =>
  email?.includes(privateAppleAddress) ? null : email

export default parseEmailAddress
