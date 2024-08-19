import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import { useCreateWallet, useGetWallet } from 'api'

import {
  BackIcon,
  Button,
  Column,
  CredeLogo,
  KeyboardViewContainer,
  PrimaryText,
  Row,
  ScreenTitle,
  SmoothPinCodeInput,
  Toast,
} from 'components'

import { useAppContext } from 'contexts/AppContext'
import { useCreateSharesContext } from 'contexts/CreateSharesContext'

import i18n from 'translations/config'

import {
  createWallet,
  getRawSharesFromExistingMnemonic,
} from 'utils/api/wallet/cryptography'
import {
  storeAreSharesCreated,
  storeEthPublicKey,
  storeTwoRawShares,
} from 'utils/asyncStorage'

const { t } = i18n

const SetUpPinScreen = () => {
  const {
    navigateAndLog,
    theme,
    setEthPrivateKey,
    mnemonic,
    setMnemonic,
    setEthPublicKey,
    firebaseId,
  } = useAppContext()
  const { mutateAsync: createWalletAsync } = useCreateWallet()
  const { setTempStoredShares, importedMnemonic } = useCreateSharesContext()
  const { mutateAsync: getWallet } = useGetWallet()

  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [error, setError] = useState('')
  const [pinPage, setPinPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const navigation = useNavigation()
  const navigateBack = () => navigation.goBack()

  const handleShares = async () => {
    // in case the user imports their own seed phrase
    const mnemonicArg = importedMnemonic ? importedMnemonic : null
    try {
      const [rawShares, ethKeys, mnemonic] = await createWallet(mnemonicArg)
      setTempStoredShares(rawShares)
      setMnemonic(mnemonic)

      // handle ethKeys
      storeEthPublicKey(ethKeys.ethPublicKey, firebaseId, setEthPublicKey)
      setEthPrivateKey(ethKeys.ethPrivateKey)
      // handle btc ethKeys
      // store shares
      await storeTwoRawShares(pin, firebaseId, [rawShares?.[0], rawShares?.[1]])
      await createWalletAsync({
        externalId: firebaseId,
        ethPublicAddress: ethKeys.ethPublicKey,
        btcPublicAddress: 'test-btc',
      })
    } catch (error) {
      throw new Error(error)
    }
  }

  const storeRawShares = async () => {
    const rawShares = await getRawSharesFromExistingMnemonic(mnemonic)
    await storeTwoRawShares(pin, firebaseId, [rawShares?.[0], rawShares?.[1]])
  }

  const isFourDigits = pin => {
    const pattern = /^\d{4}$/
    return pattern.test(pin)
  }

  const pinDisabled = !isFourDigits(pin)
  const confirmPinDisabled = !isFourDigits(confirmPin)

  const submitPin = async () => {
    setError('')
    if (pin !== confirmPin) {
      setConfirmPin('')
      setError(t('The two pin numbers must match'))
      return
    }
    if (!isFourDigits(pin) || !isFourDigits(confirmPin))
      return setError(t('This must be a 4-digit number'))
    setIsLoading(true)
    try {
      // if wallet is being recovered, don't create a new wallet
      const wallet = await getWallet()
      if (wallet?.addresses?.EVM) {
        await storeRawShares()
      } else {
        await handleShares()
      }
      await storeAreSharesCreated(firebaseId)
      navigateAndLog('SetupPinSuccessScreen', 'pin_setup_success')
    } catch (error) {
      return setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoBack = () => {
    setPin('')
    setConfirmPin('')
    setPinPage(1)
  }

  return (
    <KeyboardViewContainer style={{ paddingTop: 40 }}>
      <View
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            padding: 16,
            gap: 24,
          }}
        >
          <Row $justify='space-between'>
            <TouchableOpacity onPress={pinPage === 1 ? navigateBack : handleGoBack}>
              <BackIcon />
            </TouchableOpacity>
            <CredeLogo />
            <BackIcon color='transparent' />
          </Row>
          <Column $align='flex-start' $gap='40px'>
            <Column $gap='8px' $align='flex-start'>
              <ScreenTitle>{t('Set up Pin')}</ScreenTitle>
              <PrimaryText>{t('Make sure it is a pin you can remember.')}</PrimaryText>
            </Column>
            {pinPage === 1 ? (
              <Column $gap='4px' $align='flex-start'>
                <PrimaryText style={{ fontSize: 16, fontWeight: 700 }}>
                  {t('Pin')}
                </PrimaryText>
                <SmoothPinCodeInput
                  value={pin}
                  onTextChange={code => setPin(code)}
                  autoFocus
                  theme={theme}
                />
              </Column>
            ) : (
              <Column $gap='4px' $align='flex-start'>
                <PrimaryText style={{ fontSize: 16, fontWeight: 700 }}>
                  {t('Re-Enter Pin')}
                </PrimaryText>
                <SmoothPinCodeInput
                  value={confirmPin}
                  onTextChange={code => setConfirmPin(code)}
                  autoFocus
                  theme={theme}
                />
              </Column>
            )}
          </Column>
          {error ? (
            <Toast showToast={!!error} onClose={() => setError('')} variant='error'>
              {error}
            </Toast>
          ) : null}
        </View>
        <View
          style={{
            ...styles.buttonContainer,
            backgroundColor: theme.backgroundMedium,
          }}
        >
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 16,
            }}
          >
            {pinPage === 1 ? (
              <Button primary onPress={() => setPinPage(2)} disabled={pinDisabled}>
                {t('Enter Pin')}
              </Button>
            ) : (
              <>
                <Button style={{ flex: 1 }} onPress={handleGoBack}>
                  {t('Back')}
                </Button>
                <Button
                  style={{ flex: 1 }}
                  primary
                  onPress={submitPin}
                  disabled={confirmPinDisabled}
                  isLoading={isLoading}
                >
                  {t('Submit Pin')}
                </Button>
              </>
            )}
          </View>
        </View>
      </View>
    </KeyboardViewContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  buttonContainer: {
    padding: 24,
    paddingTop: 16,
  },
})

export default SetUpPinScreen
