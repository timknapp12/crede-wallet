export const injectToWalletBody = data => {
  const {
    externalId,
    encryptedShare,
    rawShare,
    ethPublicAddress,
    btcPublicAddress,
    questionIds = [],
  } = data
  return {
    numShares: 3,
    threshold: 2,
    externalId: externalId,
    shares: [
      {
        CustodianType: 'securityQuestions',
        Share: rawShare,
        CustodyOwner: 'self',
        shareInfo: {
          questionIds: questionIds,
        },
      },
      {
        CustodianType: 'nerd',
        Share: encryptedShare,
        CustodyOwner: 'internal',
      },
    ],
    publicAddresses: {
      EVM: ethPublicAddress,
      BTC: btcPublicAddress,
    },
  }
}
