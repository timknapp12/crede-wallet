import { useMutation, useQuery } from '@tanstack/react-query'

import { apiRequest } from 'utils/api/request'

// create a raw Transaction
export function useCreateRawTransaction() {
  return useMutation(
    ({ chainId, sender, value, toAddress, contractAddress }) => {
      return apiRequest({
        url: 'wallet/transaction/raw/send',
        method: 'POST',
        body: {
          chainId,
          sender,
          value,
          recipient: toAddress,
          ...(contractAddress && { contractAddress }),
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

// send a signed Transaction
export function useSendTransaction() {
  return useMutation(
    ({ chainId, signedTransaction }) => {
      return apiRequest({
        url: 'wallet/transaction/signed',
        method: 'POST',
        body: { chainId: chainId, signedTx: signedTransaction },
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

// GET security questions
export function useGetTxHistory({ chainId, publicAddress, tokenAddress }) {
  const queryKey = ['txHistory', chainId, publicAddress, tokenAddress]

  const queryFn = () =>
    apiRequest({
      url: `wallet/${publicAddress}/transaction-history/${chainId}?tokenAddress=${tokenAddress}`,
    })

  return useQuery({
    queryKey,
    queryFn,
  })
}
