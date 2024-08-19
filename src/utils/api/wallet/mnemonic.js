import bip39 from '@ruvasik/bip39-expo'
import * as Crypto from 'expo-crypto'

export const generateMnemonic = async () => {
  try {
    let isValid = false
    let mnemonic = ''

    while (!isValid) {
      const entropyBuffer = await generateEntropy()
      mnemonic = bip39.entropyToMnemonic(entropyBuffer)
      isValid = bip39.validateMnemonic(mnemonic)
    }
    return mnemonic
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error generating mnemonic:', error)
    throw error
  }
}

export const isValidMnemonic = mnemonic => {
  return bip39.validateMnemonic(mnemonic)
}

const generateEntropy = async () => {
  const byteCount = 16
  const entropyArray = await Crypto.getRandomBytesAsync(byteCount)
  return entropyArray
}
