import * as Clipboard from 'expo-clipboard'
import * as React from 'react'
import { Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'

import { useEmailWalletRecovery, useGetWallet } from 'api'

import {
  BackIcon,
  Button,
  Column,
  CredeLogo,
  H2,
  KeyboardViewContainer,
} from 'components'

import { useAppContext } from 'contexts/AppContext'
import { useRecoveryContext } from 'contexts/RecoveryContext'

import i18n from 'translations/config'

import {
  getEthKeys,
  getRawSharesFromExistingMnemonic,
  reconstructMnemonic,
} from 'utils/api/wallet/cryptography'
import {
  getIsRecoveryBlocked,
  incrementFailedRecoverAttempts,
  resetFailedRecoveryAttempts,
  storeEthPublicKey,
} from 'utils/asyncStorage'

const { t } = i18n

const RecoveryByPdfScreen = () => {
  const {
    theme,
    navigateAndLog,
    setEthPublicKey,
    setMnemonic,
    setEthPrivateKey,
    firebaseId,
    setIsRecoveringWallet,
  } = useAppContext()
  const { nerdShareObj, setRecoveryFailedMessage, isResetPinFlow, setTempStoredShares } =
    useRecoveryContext()
  const { mutateAsync: getWallet } = useGetWallet()
  const { mutateAsync: sendEmailWalletRecovery } = useEmailWalletRecovery()
  const [enteredKey, setEnteredKey] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmitPdfKey = async () => {
    setIsLoading(true)
    const { isBlocked, errorMessage } = await getIsRecoveryBlocked(firebaseId)
    if (!isBlocked) {
      // get mnemonic, get public key from mnemonic, check against users wallet, store shares, redirect to set pin screen
      try {
        // remove spaces from stringified share
        const enteredKeyNoSpaces = enteredKey.replace(/\s+/g, '')

        const parsedShare = JSON.parse(enteredKeyNoSpaces)
        const parsedNerdShare = JSON.parse(nerdShareObj?.share)

        const rawEnteredShare = Object.values(parsedShare)
        const rawNerdShare = Object.values(parsedNerdShare)

        const { mnemonic } = await reconstructMnemonic([rawNerdShare, rawEnteredShare])

        const mnemonicLowercase = mnemonic?.toLowerCase()
        const { ethPrivateKey, ethPublicKey } = getEthKeys(mnemonicLowercase)
        const wallet = await getWallet()

        if (ethPublicKey === wallet?.addresses?.EVM) {
          if (!isResetPinFlow) {
            storeEthPublicKey(ethPublicKey, firebaseId, setEthPublicKey)
            setEthPrivateKey(ethPrivateKey)
            setMnemonic(mnemonicLowercase)
            setIsRecoveringWallet(true)

            await resetFailedRecoveryAttempts(firebaseId)
            try {
              await sendEmailWalletRecovery()
            } catch (error) {
              // eslint-disable-next-line no-console
              console.error('Failed to send email:', error)
            }
            navigateAndLog('WalletConnectedSuccessScreen', 'recovery_by_pdf_success')
          } else {
            const rawShares = await getRawSharesFromExistingMnemonic(mnemonic)
            setTempStoredShares(rawShares)

            await resetFailedRecoveryAttempts(firebaseId)
            navigateAndLog('EnterNewPinScreen', 'nav_to_enter_new_pin_screen')
          }
        } else {
          await incrementFailedAttempts()
          navigateAndLog('WalletConnectedFailedScreen', 'recovery_by_pdf_failed')
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e)
        await incrementFailedAttempts()
        navigateAndLog('WalletConnectedFailedScreen', 'recovery_by_pdf_failed')
      } finally {
        setIsLoading(false)
      }
    } else {
      setRecoveryFailedMessage(errorMessage)
      navigateAndLog('WalletConnectedFailedScreen', 'recovery_by_pdf_failed')
    }
  }

  const incrementFailedAttempts = async () => {
    // pdf recovery key was incorrect
    const failedAttemptMessage = await incrementFailedRecoverAttempts(firebaseId)
    setRecoveryFailedMessage(failedAttemptMessage)
  }

  const fetchCopiedText = async () => {
    const text = await Clipboard.getStringAsync()
    setEnteredKey(text)
  }

  const handleGoBack = () =>
    isResetPinFlow
      ? navigateAndLog('ResetPinOptionsScreen', 'nav_back_to_resett_pin_option')
      : navigateAndLog('SelectRecoveryOptionScreen', 'nav_back_to_select_recovery_option')

  return (
    <KeyboardViewContainer>
      <View
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <View style={styles.inner}>
          <Column style={{ gap: 24 }}>
            <View
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <TouchableOpacity onPress={isLoading ? () => {} : handleGoBack}>
                <BackIcon />
              </TouchableOpacity>
              <CredeLogo />
              {/* add invisible icon same width as back icon to make logo sit in center */}
              <BackIcon color='transparent' />
            </View>
            <Column style={{ gap: 16 }} $align='flex-start'>
              <H2>{t('Enter PDF Recovery Key')}</H2>
              <View
                style={{
                  ...styles.inputView,
                  borderColor: theme.textDisabled,
                  backgroundColor: theme.backgroundDefault,
                }}
              >
                <TextInput
                  value={enteredKey}
                  onChangeText={mnemonicValue => {
                    setEnteredKey(mnemonicValue)
                  }}
                  returnKeyType='default'
                  autoFocus
                  style={{
                    color: theme.textDefault,
                    width: '100%',
                  }}
                  placeholderTextColor={theme.textDisabled}
                  multiline
                  numberOfLines={Platform.OS === 'ios' ? null : 4}
                  minHeight={Platform.OS === 'ios' ? 80 : null}
                  textAlignVertical='top'
                />
              </View>
            </Column>
            <Button onPress={fetchCopiedText}>{t('Paste From Clipboard')}</Button>
          </Column>
        </View>
        <View
          style={{
            ...styles.buttonContainer,
            backgroundColor: theme.backgroundDefault,
          }}
        >
          <Button
            primary
            disabled={!enteredKey}
            onPress={handleSubmitPdfKey}
            isLoading={isLoading}
          >
            {t('Submit')}
          </Button>
        </View>
      </View>
    </KeyboardViewContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputView: {
    borderWidth: 1,
    borderRadius: 8,
    width: '100%',
    padding: 12,
  },
  inner: {
    padding: 24,
    paddingTop: 48,
    flex: 1,
  },
  buttonContainer: {
    padding: 24,
    paddingTop: 16,
  },
})

export default RecoveryByPdfScreen
