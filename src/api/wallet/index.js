import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query'

import { apiRequest } from 'utils/api/request'

// GET wallet (used as a mutation because we have to call it in the function on signup)
export function useGetWallet() {
  return useMutation(
    () => {
      return apiRequest({
        url: 'wallet',
        method: 'Get',
      })
    },
    {
      onSuccess: () => {
        console.log('get wallet success!!!')
      },
      onError: error => {
        // eslint-disable-next-line no-console
        console.error(error)
      },
    }
  )
}

// GET users recovery method information
export function useGetRecoveryShareInfo({ firebaseId }) {
  const queryKey = ['getRecoveryShareInfo', firebaseId]

  const queryFn = () =>
    apiRequest({
      url: 'wallet/recovery-shares',
    })

  return useQuery({
    queryKey,
    queryFn,
  })
}

// create wallet
export function useCreateWallet() {
  return useMutation(
    ({ externalId, ethPublicAddress, btcPublicAddress }) => {
      return apiRequest({
        url: 'wallet',
        method: 'POST',
        body: {
          externalId,
          publicAddresses: {
            EVM: ethPublicAddress,
            BTC: btcPublicAddress,
          },
        },
      })
    },
    {
      onSuccess: () => {
        console.log('mutation success!!!')
      },
      onError: error => {
        // eslint-disable-next-line no-console
        console.error(error)
      },
    }
  )
}

// create recovery shares
export function useCreateRecoveryShares(firebaseId) {
  const queryClient = useQueryClient()
  return useMutation(
    ({
      externalId,
      securityQuestionsShare,
      securityQuestionIds,
      nerdShare,
      isPdfKit = false,
    }) => {
      const body = {
        externalId,
        shares: [
          isPdfKit
            ? {
                CustodianType: 'pdfKit',
                Share: '',
                CustodyOwner: 'self',
              }
            : {
                CustodianType: 'securityQuestions',
                Share: securityQuestionsShare,
                CustodyOwner: 'self',
                shareInfo: {
                  questionIds: securityQuestionIds,
                },
              },
          {
            CustodianType: 'nerd',
            Share: nerdShare,
            CustodyOwner: 'internal',
          },
          {
            CustodianType: 'phone',
            Share: '',
            CustodyOwner: 'self',
          },
        ],
        threshold: 2,
      }
      return apiRequest({
        url: 'wallet/recovery-shares',
        method: 'POST',
        body,
      })
    },
    {
      onSuccess: () => {
        console.log('mutation success!!!')
        queryClient.invalidateQueries(['getRecoveryShareInfo', firebaseId])
      },
      onError: error => {
        // eslint-disable-next-line no-console
        console.error(error)
      },
    }
  )
}

// GET balance
function getBalance({ publicAddress, chainId, contractAddress }) {
  const queryKey = ['getBalance', publicAddress, chainId, contractAddress]

  let url = `wallet/${publicAddress}/balance/${chainId}`
  if (contractAddress !== 'Native') {
    url += `/${contractAddress}`
  }

  const queryFn = () =>
    apiRequest({
      url,
    })
  return {
    queryKey,
    queryFn,
    ...{ enabled: !!publicAddress && !!chainId && contractAddress !== 'N/A' },
  }
}

// GET Balance - for an individual token
export function useGetBalance({ publicAddress, chainId, contractAddress }) {
  const queryFunctionObj = getBalance({ publicAddress, chainId, contractAddress })
  return useQuery(queryFunctionObj)
}

// GET all balances to total
export function useGetAllBalances({ networks = [], publicAddress }) {
  const queries = networks
    ?.map(network => {
      return network?.tokens?.map(token => {
        return getBalance({
          publicAddress,
          chainId: network.chainId,
          contractAddress: token.contractAddress,
        })
      })
    })
    ?.flat()

  // return useQueries(useMemo(() => queries?.map(query => query), [queries]))
  return useQueries({ queries })
}

// GET security questions
export function useGetSecurityQuestions() {
  const queryKey = ['getSecurityQuestions']

  const queryFn = () =>
    apiRequest({
      url: 'questions',
    })

  return useQuery({
    queryKey,
    queryFn,
  })
}
