import parseEmailAddress from '.'

describe('parse email adddress', () => {
  test('returns normal address', () => {
    const input = 'credewallet@gmail.com'
    const output = 'credewallet@gmail.com'

    expect(parseEmailAddress(input)).toBe(output)
  })
  test('returns null for private email address', () => {
    const input = 'mnvhe4905m@privaterelay.appleid.com'
    const output = null

    expect(parseEmailAddress(input)).toBe(output)
  })
  test('returns null for null', () => {
    const input = null
    const output = null

    expect(parseEmailAddress(input)).toBe(output)
  })
  test('returns empty string', () => {
    const input = ''
    const output = ''

    expect(parseEmailAddress(input)).toBe(output)
  })
})
