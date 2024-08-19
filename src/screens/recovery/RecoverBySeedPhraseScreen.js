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
  SecondaryText,
} from 'components'

import { useAppContext } from 'contexts/AppContext'
import { useRecoveryContext } from 'contexts/RecoveryContext'

import i18n from 'translations/config'

import {
  getEthKeys,
  getRawSharesFromExistingMnemonic,
} from 'utils/api/wallet/cryptography'
import { resetFailedRecoveryAttempts, storeEthPublicKey } from 'utils/asyncStorage'

const { t } = i18n

const RecoverBySeedPhraseScreen = () => {
  const {
    theme,
    navigateAndLog,
    setEthPublicKey,
    setMnemonic,
    setEthPrivateKey,
    firebaseId,
    setIsRecoveringWallet,
    logEvent,
  } = useAppContext()
  const { isResetPinFlow, setTempStoredShares } = useRecoveryContext()
  const { mutateAsync: getWallet } = useGetWallet()
  const { mutateAsync: sendEmailWalletRecovery } = useEmailWalletRecovery()
  const [enteredMnemonic, setEnteredMnemonic] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmitMnemonic = async () => {
    setIsLoading(true)
    try {
      const mnemonicLowercase = enteredMnemonic?.toLowerCase()
      const { ethPrivateKey, ethPublicKey } = getEthKeys(mnemonicLowercase)
      const wallet = await getWallet()

      if (ethPublicKey === wallet?.addresses?.EVM) {
        if (!isResetPinFlow) {
          storeEthPublicKey(ethPublicKey, firebaseId, setEthPublicKey)
          setEthPrivateKey(ethPrivateKey)
          setMnemonic(mnemonicLowercase)
          setIsRecoveringWallet(true)
          try {
            await sendEmailWalletRecovery()
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to send email:', error)
          }
          navigateAndLog(
            'WalletConnectedSuccessScreen',
            'recovery_by_seed_phrase_success'
          )
        } else {
          const rawShares = await getRawSharesFromExistingMnemonic(mnemonicLowercase)
          setTempStoredShares(rawShares)

          await resetFailedRecoveryAttempts(firebaseId)
          navigateAndLog('EnterNewPinScreen', 'nav_to_enter_new_pin_success_screen')
        }
      } else {
        navigateAndLog('WalletConnectedFailedScreen', 'recovery_by_seed_phrase_failed')
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
      navigateAndLog('WalletConnectedFailedScreen', 'recovery_by_seed_phrase_failed')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCopiedText = async () => {
    const text = await Clipboard.getStringAsync()
    logEvent('paste_seed_phrase_from_clipboard')
    setEnteredMnemonic(text)
  }

  const handleGoBack = () =>
    isResetPinFlow
      ? navigateAndLog('ResetPinOptionsScreen', 'nav_back_to_select_pin_option')
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
              <H2>{t('Enter 12 Word Seed Phrase')}</H2>
              <Column $gap='4px' $align='flex-start'>
                <View
                  style={{
                    ...styles.inputView,
                    borderColor: theme.textDisabled,
                    backgroundColor: theme.backgroundDefault,
                  }}
                >
                  <TextInput
                    value={enteredMnemonic}
                    onChangeText={mnemonicValue => {
                      setEnteredMnemonic(mnemonicValue)
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
                <SecondaryText style={{ fontSize: 12 }}>
                  {t('Separate each word with a space.')}
                </SecondaryText>
              </Column>
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
            disabled={!enteredMnemonic}
            onPress={handleSubmitMnemonic}
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

export default RecoverBySeedPhraseScreen
