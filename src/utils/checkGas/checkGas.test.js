import checkGas from '.'

describe('Check Gas', () => {
  test('returns true for ETH sending ETH', () => {
    const tokenToSend = 'ETH'
    const amountToSend = '10'
    const gasToken = 'ETH'
    const gasFee = 1
    const gasTokenBalance = 12

    expect(checkGas(tokenToSend, amountToSend, gasToken, gasFee, gasTokenBalance)).toBe(
      true
    )
  })
  test('returns false for ETH sending ETH', () => {
    const tokenToSend = 'ETH'
    const amountToSend = '12'
    const gasToken = 'ETH'
    const gasFee = 1
    const gasTokenBalance = 12

    expect(checkGas(tokenToSend, amountToSend, gasToken, gasFee, gasTokenBalance)).toBe(
      false
    )
  })
  test('returns true for ETH sending EON', () => {
    const tokenToSend = 'EON'
    const amountToSend = '12'
    const gasToken = 'ETH'
    const gasFee = 1
    const gasTokenBalance = 2

    expect(checkGas(tokenToSend, amountToSend, gasToken, gasFee, gasTokenBalance)).toBe(
      true
    )
  })
  test('returns false for ETH sending EON', () => {
    const tokenToSend = 'EON'
    const amountToSend = '12'
    const gasToken = 'ETH'
    const gasFee = 2
    const gasTokenBalance = 1

    expect(checkGas(tokenToSend, amountToSend, gasToken, gasFee, gasTokenBalance)).toBe(
      false
    )
  })

  test('returns true for EON sending EON-P', () => {
    const tokenToSend = 'EON-P'
    const amountToSend = '10'
    const gasToken = 'EON'
    const gasFee = 1
    const gasTokenBalance = 12

    expect(checkGas(tokenToSend, amountToSend, gasToken, gasFee, gasTokenBalance)).toBe(
      true
    )
  })
  test('returns false for EON sending EON-P', () => {
    const tokenToSend = 'EON-P'
    const amountToSend = '12'
    const gasToken = 'EON'
    const gasFee = 1
    const gasTokenBalance = 12

    expect(checkGas(tokenToSend, amountToSend, gasToken, gasFee, gasTokenBalance)).toBe(
      false
    )
  })
  test('handles strings for amounts', () => {
    const tokenToSend = 'ETH'
    const amountToSend = '10'
    const gasToken = 'ETH'
    const gasFee = '1'
    const gasTokenBalance = '12'

    expect(checkGas(tokenToSend, amountToSend, gasToken, gasFee, gasTokenBalance)).toBe(
      true
    )
  })
  test('handles numbers for amounts', () => {
    const tokenToSend = 'ETH'
    const amountToSend = 10
    const gasToken = 'ETH'
    const gasFee = 1
    const gasTokenBalance = 12

    expect(checkGas(tokenToSend, amountToSend, gasToken, gasFee, gasTokenBalance)).toBe(
      true
    )
  })
})
