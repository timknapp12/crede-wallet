import { useMutation, useQuery } from '@tanstack/react-query'
import Constants from 'expo-constants'

import { apiRequest } from 'utils/api/request'

// GET get networks
export function useGetNetworks(firebaseId) {
  const env = Constants.expoConfig.extra.env
  const networkType = env === 'prod' ? 'mainnet' : 'testnet'
  const queryKey = ['getNetworks', networkType]

  const queryFn = () =>
    apiRequest({
      url: `networks/${networkType}`,
    })

  return useQuery({
    queryKey,
    queryFn,
    enabled: !!firebaseId,
  })
}

// GET Terms
export function useGetTerms() {
  const versionId = 2
  return useMutation(() => {
    return apiRequest({
      url: `terms-and-conditions/${versionId}`,
      method: 'GET',
    })
  })
}

// POST user has accepted terms - pass back in the version id from "useGetTerms"
export function useSendTerms() {
  return useMutation(
    ({ versionId }) => {
      return apiRequest({
        url: `terms-and-conditions`,
        method: 'POST',
        body: {
          versionId,
        },
      })
    },
    {
      onSuccess: () => {
        // eslint-disable-next-line no-console
        console.log('terms sent success')
      },
    },
    {
      onError: error => {
        throw error
      },
    }
  )
}
