import { useQueryClient } from '@tanstack/react-query'
import * as WebBrowser from 'expo-web-browser'
import * as React from 'react'
import { View } from 'react-native'

import { useEmailTransaction } from 'api'

import {
  Button,
  Column,
  ExternalLinkIcon,
  FailureIcon,
  PrimaryText,
  ScreenContainer,
  SuccessIcon,
} from 'components'

import { useAppContext } from 'contexts/AppContext'
import { useSendContext } from 'contexts/SendContext'

import i18n from 'translations/config'

const { t } = i18n

const SendConfirmationScreen = () => {
  const { mutateAsync: sendEmailTranscation } = useEmailTransaction()
  const { navigateAndLog, ethPublicKey, logEvent } = useAppContext()
  const {
    isError,
    setIsError,
    setWalletAddress,
    setSelectedAsset,
    amount,
    setAmount,
    tokenAmount,
    scannerLink,
    setSelectedNetwork,
    setTokenAmount,
    setIsSuccess,
    rawTransaction,
    setRawTransaction,
    setScannerLink,
    selectedNetwork,
    selectedAsset,
  } = useSendContext()
  const queryClient = useQueryClient()

  const handleConfirmDone = () => {
    setIsError(false)
    setWalletAddress('')
    setSelectedAsset('')
    setSelectedNetwork('')
    setAmount('')
    setTokenAmount('')
    setIsSuccess(false)
    setRawTransaction({})
    setScannerLink('')

    queryClient.invalidateQueries([
      'getBalance',
      ethPublicKey,
      selectedNetwork.chainId,
      selectedAsset.contractAddress,
    ])

    navigateAndLog('HomeScreen', 'nav_to_home_screen_after_sending')
  }

  const openInWeb = async () => {
    await WebBrowser.openBrowserAsync(scannerLink)
    logEvent('open_to_link_see_tx')
  }

  const sendEmail = async () => {
    const currentDate = new Date()
    const formattedDate = currentDate.toLocaleString(undefined, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    })
    const information = {
      to: rawTransaction?.transaction?.to,
      from: ethPublicKey,
      amount: tokenAmount,
      txLink: scannerLink,
      date: formattedDate,
      tokenSymbol: selectedAsset?.symbol,
      usdValue: amount,
      networkName: selectedNetwork?.name,
    }
    try {
      await sendEmailTranscation(information)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to send email:', error)
    }
  }

  React.useEffect(() => {
    if (
      isError ||
      !ethPublicKey ||
      !rawTransaction ||
      !scannerLink ||
      !selectedAsset ||
      !amount ||
      !selectedNetwork
    )
      return
    sendEmail()
  }, [
    isError,
    ethPublicKey,
    rawTransaction,
    scannerLink,
    selectedAsset,
    amount,
    selectedNetwork,
  ])

  return (
    <ScreenContainer paddingTop='8px' paddingBottom='24px'>
      <Column style={{ justifyContent: 'space-between', flex: 1 }}>
        <View></View>
        <Column style={{ gap: 24 }}>
          {isError ? <FailureIcon /> : <SuccessIcon />}
          <Column style={{ gap: 16 }}>
            <PrimaryText style={{ fontSize: 24, fontWeight: 700 }}>
              {isError ? t('Transaction Failed') : t('Transaction Initiated')}
            </PrimaryText>
            <PrimaryText style={{ fontSize: 14, textAlign: 'center' }}>
              {isError
                ? t('The transaction failed')
                : t('This transaction usually takes less than 10 minutes to finalize.')}
            </PrimaryText>
          </Column>
        </Column>
        <Column style={{ gap: 16 }}>
          {!isError && (
            <Button endIcon={<ExternalLinkIcon />} onPress={openInWeb}>
              {t('Details')}
            </Button>
          )}
          <Button primary onPress={handleConfirmDone}>
            {t('Done')}
          </Button>
        </Column>
      </Column>
    </ScreenContainer>
  )
}

export default SendConfirmationScreen
