import { ethers } from 'ethers'
import PropTypes from 'prop-types'
import * as React from 'react'
import { StyleSheet, View } from 'react-native'

import { useGetBalance, useSendTransaction } from 'api'

import {
  Button,
  Column,
  H5Error,
  Line,
  PrimaryText,
  Row,
  ScreenContainer,
  SecondaryText,
} from 'components'

import { useAppContext } from 'contexts/AppContext'
import { useSendContext } from 'contexts/SendContext'

import i18n from 'translations/config'

import { signEthTransaction } from 'utils/api/wallet/cryptography'
import checkGas from 'utils/checkGas'
import formatCurrency, { trimZerosFromNumber } from 'utils/formatCurrency'

import ConfirmPinModal from './ConfirmPinModal'
import LoadingSendModal from './LoadingSendModal'

const { t } = i18n

const PreviewSendScreen = () => {
  const { theme, navigateAndLog, ethPublicKey, currentLanguage, currentCurrency } =
    useAppContext()
  const {
    selectedAsset,
    amount,
    tokenAmount,
    walletAddress,
    rawTransaction,
    selectedNetwork,
    setScannerLink,
    setIsError,
  } = useSendContext()

  const isNativeToken = selectedAsset?.contractAddress === 'Native'
  // this is for calculating the gas fee. always comes in native token on the chain. (for all erc20's will be ETH)
  const chainNativeTokenBalanceQuery = useGetBalance({
    publicAddress: ethPublicKey,
    chainId: selectedNetwork.chainId,
    contractAddress: 'Native',
  })
  const gasTokenBalance = chainNativeTokenBalanceQuery?.data?.balance || 0

  const chainNativeTokenPrice =
    chainNativeTokenBalanceQuery?.data?.price?.tokenUSDPrice || 0
  const showDollarAmount = !!chainNativeTokenPrice

  const { mutateAsync: sendTransaction } = useSendTransaction()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isPinModalOpen, setIsPinModalOpen] = React.useState(false)
  const [isLoadingModalOpen, setIsLoadingModalOpen] = React.useState(false)

  const gasFeeInWei = rawTransaction?.estimatedFees
  const nativeChainToken = selectedNetwork?.tokens?.find(
    token => token?.contractAddress === 'Native'
  )

  const gasFeeInToken = ethers.utils.formatUnits(gasFeeInWei, nativeChainToken?.decimals)
  const gasFeeInDollars = chainNativeTokenPrice * gasFeeInToken

  async function handleSendTransaction(ethPrivateKey) {
    setIsPinModalOpen(false)
    setIsLoading(true)
    setIsLoadingModalOpen(true)
    try {
      const signedTransaction = await signEthTransaction(rawTransaction, ethPrivateKey)
      const transactionResponse = await sendTransaction({
        chainId: selectedNetwork.chainId,
        signedTransaction: signedTransaction,
      })
      setScannerLink(transactionResponse.scannerLink)
      setTimeout(() => {
        setIsLoadingModalOpen(false)
        navigateAndLog('SendConfirmationScreen', `send_${selectedAsset?.name}_success`)
      }, 5000)
    } catch (e) {
      setIsError(true)
      setIsLoading(false)
      setIsLoadingModalOpen(false)
      navigateAndLog('SendConfirmationScreen', `send_${selectedAsset?.name}_failure`)
    } finally {
      setIsLoading(false)
    }
  }

  const hasSufficientFunds = checkGas(
    selectedAsset?.symbol,
    tokenAmount,
    selectedNetwork?.symbol,
    gasFeeInToken,
    gasTokenBalance
  )
  const disabled = !hasSufficientFunds

  return (
    <ScreenContainer paddingTop='8px' paddingBottom='24px'>
      <Column style={styles.containerColumn}>
        <Column style={{ gap: 40 }}>
          <Column style={styles.columnSection}>
            <Row style={styles.rowContainer}>
              <SecondaryText style={{ flex: 1, fontSize: 14 }}>{t('Send')}</SecondaryText>
              <SecondaryText style={{ flex: 3, fontSize: 14 }}>
                {selectedAsset?.name}
              </SecondaryText>
            </Row>
            <Line />
            <Row style={styles.rowContainer}>
              <SecondaryText style={{ flex: 1, fontSize: 14 }}>{t('To')}</SecondaryText>
              <SecondaryText style={{ flex: 3, fontSize: 14 }}>
                {walletAddress}
              </SecondaryText>
            </Row>
            <Line />
            <Row style={styles.rowContainer}>
              <SecondaryText style={{ flex: 1, fontSize: 14 }}>
                {t('Network')}
              </SecondaryText>
              <SecondaryText style={{ flex: 3, fontSize: 14 }}>
                {selectedNetwork?.name}
              </SecondaryText>
            </Row>
          </Column>
          <Column style={styles.columnSection}>
            <Row
              style={{
                ...styles.rowContainer,
                justifyContent: 'space-between',
              }}
            >
              <SecondaryText style={{ fontSize: 14 }}>{t('Amount')}</SecondaryText>
              <View style={styles.innerInnerBottomContainer}>
                {showDollarAmount && (
                  <PrimaryText style={{ fontWeight: 700, fontSize: 14 }}>
                    {formatCurrency(amount, currentCurrency, currentLanguage)}
                  </PrimaryText>
                )}
                <View style={{ ...styles.viewInnerContainer, gap: 6 }}>
                  <SecondaryText
                    style={{
                      fontSize: 14,
                      ...(!showDollarAmount && { fontWeight: 700 }),
                    }}
                  >
                    {tokenAmount}
                  </SecondaryText>
                  <SecondaryText
                    style={{
                      fontSize: 14,
                      ...(!showDollarAmount && { fontWeight: 700 }),
                    }}
                  >
                    {selectedAsset?.symbol}
                  </SecondaryText>
                </View>
              </View>
            </Row>
            <Line />
            <Row
              style={{
                ...styles.rowContainer,
                justifyContent: 'space-between',
              }}
            >
              <SecondaryText style={{ fontSize: 14 }}>{t('Gas Fee')}</SecondaryText>
              <View style={styles.innerInnerBottomContainer}>
                {showDollarAmount && (
                  <PrimaryText style={{ fontWeight: 700, fontSize: 14 }}>
                    {formatCurrency(gasFeeInDollars, currentCurrency, currentLanguage)}
                  </PrimaryText>
                )}
                <View style={{ ...styles.viewInnerContainer, gap: 6 }}>
                  <SecondaryText
                    style={{
                      fontSize: 14,
                      ...(!showDollarAmount && { fontWeight: 700 }),
                    }}
                  >
                    {gasFeeInToken}
                  </SecondaryText>
                  <SecondaryText
                    style={{
                      fontSize: 14,
                      ...(!showDollarAmount && { fontWeight: 700 }),
                    }}
                  >
                    {nativeChainToken?.symbol}
                  </SecondaryText>
                </View>
                {!hasSufficientFunds && (
                  <H5Error style={styles.gasError}>
                    {t('Insufficient funds for gas fee')}
                  </H5Error>
                )}
              </View>
            </Row>
            <Line />
            <Row
              style={{
                ...styles.rowContainer,
                justifyContent: 'space-between',
              }}
            >
              <SecondaryText>{t('TOTAL')}</SecondaryText>
              <View style={styles.innerInnerBottomContainer}>
                {showDollarAmount && (
                  <PrimaryText style={{ fontWeight: 700, color: theme.danger }}>
                    {formatCurrency(
                      Number(amount) + gasFeeInDollars,
                      currentCurrency,
                      currentLanguage
                    )}
                  </PrimaryText>
                )}
                <View
                  style={{
                    ...styles.viewInnerContainer,
                    gap: 6,
                  }}
                >
                  <SecondaryText style={{ fontWeight: 700, color: theme.danger }}>
                    {isNativeToken
                      ? trimZerosFromNumber(
                          Number(tokenAmount) + Number(gasFeeInToken),
                          currentLanguage
                        )
                      : trimZerosFromNumber(tokenAmount, currentLanguage)}
                  </SecondaryText>
                  <SecondaryText style={{ fontWeight: 700, color: theme.danger }}>
                    {selectedAsset?.symbol}
                  </SecondaryText>
                </View>
              </View>
            </Row>
          </Column>
        </Column>
        <Column style={{ gap: 16 }}>
          <PrimaryText style={{ fontSize: 14 }}>
            {t(
              'Sending assets is a permanent action. Make sure you send to the right address on the right network.'
            )}
          </PrimaryText>
          <Button
            danger
            disabled={disabled}
            onPress={() => setIsPinModalOpen(true)}
            isLoading={isLoading}
          >
            {t('Send')}
          </Button>
        </Column>
      </Column>
      {isPinModalOpen && (
        <ConfirmPinModal
          isOpen={isPinModalOpen}
          onClose={() => setIsPinModalOpen(false)}
          handleSendTransaction={handleSendTransaction}
        />
      )}
      <LoadingSendModal isOpen={isLoadingModalOpen} />
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  containerColumn: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 32,
  },
  columnSection: {
    gap: 8,
  },
  viewInnerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  innerBottomContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  innerInnerBottomContainer: {
    gap: 4,
    alignItems: 'flex-end',
  },
  rowContainer: {
    paddingBottom: 4,
    paddingTop: 4,
    alignItems: 'flex-start',
  },
  gasError: {
    fontWeight: 400,
  },
})

PreviewSendScreen.propTypes = {
  route: PropTypes.object.isRequired,
}

export default PreviewSendScreen
