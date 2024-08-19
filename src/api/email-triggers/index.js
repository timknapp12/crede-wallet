import { useMutation } from '@tanstack/react-query'

import { apiRequest } from 'utils/api/request'

export function useEmailWalletCreation() {
  return useMutation(
    ({ publicAddress }) => {
      return apiRequest({
        url: `email`,
        method: 'POST',
        body: {
          type: 'wallet-creation',
          information: {
            publicAddress: publicAddress,
          },
        },
      })
    },
    {
      onError: error => {
        throw error
      },
    }
  )
}

export function useEmailWalletCreationNoRecovery() {
  return useMutation(
    () => {
      return apiRequest({
        url: `email`,
        method: 'POST',
        body: {
          type: 'wallet-creation-no-recovery-setup',
        },
      })
    },
    {
      onError: error => {
        throw error
      },
    }
  )
}

export function useEmailAcceptTerms() {
  return useMutation(
    ({ versionId }) => {
      return apiRequest({
        url: `email`,
        method: 'POST',
        body: {
          type: 'terms-and-conditions',
          information: {
            versionId: versionId,
          },
        },
      })
    },
    {
      onError: error => {
        throw error
      },
    }
  )
}

export function useEmailWalletRecovery() {
  return useMutation(
    () => {
      return apiRequest({
        url: `email`,
        method: 'POST',
        body: {
          type: 'wallet-recovery',
        },
      })
    },
    {
      onError: error => {
        throw error
      },
    }
  )
}

export function useEmailTransaction() {
  return useMutation(
    ({
      to = '',
      from = '',
      amount = '',
      txLink = '',
      date = '',
      tokenSymbol = '',
      usdValue = '',
      networkName = '',
    }) => {
      return apiRequest({
        url: `email`,
        method: 'POST',
        body: {
          type: 'transaction',
          information: {
            to,
            from,
            amount,
            txLink,
            date,
            tokenSymbol,
            usdValue,
            networkName,
          },
        },
      })
    },
    {
      onError: error => {
        throw error
      },
    }
  )
}

export function useEmailExportKey() {
  return useMutation(
    () => {
      return apiRequest({
        url: `email`,
        method: 'POST',
        body: {
          type: 'export-private-key',
        },
      })
    },
    {
      onError: error => {
        throw error
      },
    }
  )
}

export function useEmailPinReset() {
  return useMutation(
    () => {
      return apiRequest({
        url: `email`,
        method: 'POST',
        body: {
          type: 'pin-reset',
        },
      })
    },
    {
      onError: error => {
        throw error
      },
    }
  )
}
