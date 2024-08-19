const checkGas = (tokenToSend, amountToSend, gasToken, gasFee, gasTokenBalance) => {
  const modifiedTokenToSend = tokenToSend.includes('-P')
    ? tokenToSend.replace('-P', '')
    : tokenToSend

  const numToSend = Number(amountToSend)
  const numGas = Number(gasFee)
  const numBalance = Number(gasTokenBalance)

  let total = 0
  if (modifiedTokenToSend === gasToken) {
    total = numToSend + numGas
  } else {
    total = numGas
  }

  const hasSufficientFunds = numBalance >= total
  return hasSufficientFunds
}

export default checkGas
