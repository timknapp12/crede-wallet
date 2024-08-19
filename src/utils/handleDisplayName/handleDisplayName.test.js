import { getInitials, removeWhitSpace } from '.'

describe('Handle Display Names', () => {
  describe('Remove White Space', () => {
    test('make John David one word', () => {
      const input = 'John David'
      const output = 'JohnDavid'

      expect(removeWhitSpace(input)).toBe(output)
    })
  })
  describe('Get Initials', () => {
    test('get initials of Joe Schmoe', () => {
      const input = 'Joe Schmoe'
      const output = 'JS'

      expect(getInitials(input)).toBe(output)
    })
    test('get initials of Elizabeth Anne Winkel', () => {
      const input = 'ElizabethAnne Winkel'
      const output = 'EW'

      expect(getInitials(input)).toBe(output)
    })
  })
})
