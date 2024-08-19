const encodeAddress = address => {
  const splitArray = address.split('')
  const firstSix = splitArray.slice(0, 6).join('')
  const lastFour = splitArray.slice(address?.length - 4).join('')
  const encodedAddress = `${firstSix}...${lastFour}`

  return encodedAddress
}

export default encodeAddress
