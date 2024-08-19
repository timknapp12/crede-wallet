import encodeAddress from '.'

describe('Encode Address', () => {
  test('Encode 1234567890asdfgh', () => {
    const input = '1234567890asdfgh'

    const output = '123456...dfgh'
    expect(encodeAddress(input)).toBe(output)
  })
  test('Encode 0xnhebrk2P60RngAp59vPlmxwreg', () => {
    const input = '0xnhebrk2P60RngAp59vPlmxwreg'

    const output = '0xnheb...wreg'
    expect(encodeAddress(input)).toBe(output)
  })
})
