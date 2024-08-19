import { injectToWalletBody } from './helpers'

const output = {
  numShares: 3,
  threshold: 2,
  externalId: '123456',
  shares: [
    {
      CustodianType: 'securityQuestions',
      Share: '{12",sa, 90, 44, 044, ado}',
      CustodyOwner: 'self',
      shareInfo: {
        questionIds: [1, 2, 3],
      },
    },
    {
      CustodianType: 'nerd',
      Share: '123sdf03938939asdfsd',
      CustodyOwner: 'internal',
    },
  ],
  publicAddresses: {
    EVM: '0xad93jaskDLNiu799jdn04NkLrnca2395n',
    BTC: 'sakldfh89347ufs98as7f98fsa7df',
  },
}

describe('inject in create wallet body', () => {
  test('returns expected output', () => {
    const data = {
      externalId: '123456',
      encryptedShare: '123sdf03938939asdfsd',
      rawShare: '{12",sa, 90, 44, 044, ado}',
      ethPublicAddress: '0xad93jaskDLNiu799jdn04NkLrnca2395n',
      btcPublicAddress: 'sakldfh89347ufs98as7f98fsa7df',
      questionIds: [1, 2, 3],
    }

    expect(injectToWalletBody(data)).toStrictEqual(output)
  })
})
