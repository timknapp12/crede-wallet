import { decryptShare, encryptShare } from './encryption'

describe('encryptShare and decryptShare', () => {
  test('should encrypt and decrypt shares correctly', async () => {
    const rawShare = 'Hello, CryptoJS!'
    const encryptor = '123456'

    const encryptedShare = await encryptShare(rawShare, encryptor)
    expect(typeof encryptedShare).toBe('string')

    const decryptedShare = await decryptShare(encryptedShare, encryptor)
    expect(decryptedShare).toBe(rawShare)
  })

  test('should catch errors during decryption', async () => {
    const encryptor = '123456'
    const decryptedShare = await decryptShare('invalidFormat', encryptor)
    expect(decryptedShare).toBe('')
  })
})
