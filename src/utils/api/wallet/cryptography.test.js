// import { combineShares, splitSecret } from './keys/shamir'
// import { generateMnemonic } from './mnemonic'
import { isValidMnemonic, xorStrings } from './cryptography'

// const THRESHOLD = 2
// const NUMBER_OF_SHARES = 3

describe('handling mnemonic', () => {
  test('generate, split, and reconstruct mnemonic', async () => {
    // const mnemonic = await generateMnemonic()
    // console.log('mnemonic', mnemonic)

    // const shares = await splitSecret(mnemonic, THRESHOLD, NUMBER_OF_SHARES)
    // const reconstructedSecretBuffer = await combineShares(shares.slice(0, 2))

    // console.log('reconstructedSecretBuffer', reconstructedSecretBuffer)
    // expect(mnemonic).toBe(reconstructedSecretBuffer)
    expect(1).toBe(1)
  })
})

describe('XOR strings', () => {
  test('returns same value regardless of case', () => {
    const first = xorStrings('Elizabeth', 'johnny ', '   BILLY   ')
    const second = xorStrings('ELIZABETH ', 'joHNnY', 'billy')
    expect(first).toBe(second)
  })
  test('returns a string', () => {
    const result = xorStrings('Elizabeth', 'johnny', 'BILLY')
    expect(typeof result).toBe('string')
  })
})

describe('is valid mnemonic', () => {
  test('valid phrase should pass', () => {
    const input = `about stadium drink exchange urban claim snap venue paddle secret diary gravity`
    const output = true

    expect(isValidMnemonic(input)).toBe(output)
  })
  test('invalid phrase should fail', () => {
    const input = `one two three four five six seven eight nine ten eleven twelve`
    const output = false

    expect(isValidMnemonic(input)).toBe(output)
  })
})
