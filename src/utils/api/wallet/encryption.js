import CryptoES from 'crypto-es'

const IV_HEX_LENGTH = 32

export const generateRandomIVString = async () => {
  const iv = CryptoES.lib.WordArray.random(16)
  return iv.toString(CryptoES.enc.Hex)
}

export const generateKeyString = async encryptor => {
  const key = CryptoES.SHA3(encryptor, { outputLength: 256 }).toString(CryptoES.enc.Hex)
  return key
}

export const encryptData = async (message, key, iv) => {
  const encrypted = CryptoES.AES.encrypt(message, CryptoES.enc.Hex.parse(key), {
    iv: CryptoES.enc.Hex.parse(iv),
  })

  return encrypted.ciphertext.toString(CryptoES.enc.Hex)
}

export const decryptData = async (cyphertextString, key, iv) => {
  try {
    const decrypted = CryptoES.AES.decrypt(
      {
        ciphertext: CryptoES.enc.Hex.parse(cyphertextString),
      },
      CryptoES.enc.Hex.parse(key),
      {
        iv: CryptoES.enc.Hex.parse(iv),
      }
    )
    return decrypted.toString(CryptoES.enc.Utf8)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Decryption error:', error)
    return '' // Return an empty string on decryption error
  }
}

export const encryptShare = async (rawShare, encryptor) => {
  const iv = await generateRandomIVString()
  const key = await generateKeyString(encryptor)
  try {
    const encryptedShareString = await encryptData(rawShare, key, iv)
    const ivPrependedEncryptedShare = iv + encryptedShareString
    return ivPrependedEncryptedShare
  } catch (error) {
    throw new Error(`Error in encryptShare: ${error.message}`)
  }
}

export const decryptShare = async (encryptedShare, encryptor) => {
  const iv = encryptedShare.substring(0, IV_HEX_LENGTH)
  const cypherTextString = encryptedShare.substring(IV_HEX_LENGTH)
  try {
    const key = await generateKeyString(encryptor)
    const decryptedValue = await decryptData(cypherTextString, key, iv)

    return decryptedValue
  } catch (error) {
    throw new Error(`Error in decrypt value: ${error.message}`)
  }
}
