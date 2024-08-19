import { combine, split } from 'shamir-secret-sharing'

const { TextEncoder } = require('text-encoding')

const toUint8Array = data => new TextEncoder().encode(data)

// Split the secret into shares
export const splitSecret = async (secret, numShares, threshold) => {
  try {
    const secretUint8 = toUint8Array(secret)
    const shares = await split(secretUint8, numShares, threshold)
    return shares
  } catch (error) {
    throw new Error(`Error in split secret: ${error.message}`)
  }
}

// Reconstruct the secret from shares
export const combineShares = async shares => {
  const combinedSecretUint8 = await combine(shares)

  return combinedSecretUint8
}
