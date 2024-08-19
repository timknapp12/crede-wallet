import { useState } from 'react'
import { StyleSheet, View } from 'react-native'

import {
  Button,
  H5Error,
  KeyboardViewContainer,
  PrimaryText,
  ScreenTitle,
  SmoothPinCodeInput,
} from 'components'

import { useAppContext } from 'contexts/AppContext'
import { useCreateSharesContext } from 'contexts/CreateSharesContext'

import i18n from 'translations/config'

import {
  getRawSharesFromExistingMnemonic,
  reconstructMnemonic,
} from 'utils/api/wallet/cryptography'
import { getTwoRawShares } from 'utils/asyncStorage'

const { t } = i18n

const ReEnterPinScreen = () => {
  const { navigateAndLog, theme, setMnemonic, setEthPrivateKey, firebaseId } =
    useAppContext()
  const { setTempStoredShares } = useCreateSharesContext()

  const [error, setError] = useState('')
  const [pin, setPin] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const isFourDigits = pin => {
    const pattern = /^\d{4}$/
    return pattern.test(pin)
  }

  const handleRecoverMnemonic = async () => {
    try {
      const shares = await getTwoRawShares(pin, firebaseId)
      const { mnemonic, ethPrivateKey } = await reconstructMnemonic(shares)
      const rawShares = await getRawSharesFromExistingMnemonic(mnemonic)
      await setMnemonic(mnemonic)
      await setEthPrivateKey(ethPrivateKey)
      await setTempStoredShares(rawShares)
      return Promise.resolve()
    } catch (error) {
      setPin('')
      return Promise.reject(error)
    }
  }

  const onContinue = async () => {
    if (!isFourDigits(pin)) return setError(t('This must be a 4-digit number'))
    setIsLoading(true)
    try {
      await handleRecoverMnemonic()
      navigateAndLog('ChooseRecoveryMethodScreen', 'nav_to_recovery_flow')
      setPin('')
    } catch (error) {
      setPin('')
      setError(t(error))
    }
    setIsLoading(false)
  }

  const disabled = pin?.length !== 4 || isLoading

  return (
    <KeyboardViewContainer style={{ padding: 24, paddingTop: 48 }}>
      <View
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flex: 1, gap: 24 }}>
          <ScreenTitle>{t('Enter Pin')}</ScreenTitle>
          <PrimaryText>{t(`In order to set up recovery enter your pin.`)}</PrimaryText>
          <SmoothPinCodeInput
            value={pin}
            onTextChange={text => setPin(text)}
            autoFocus
            theme={theme}
          />
          {error ? <H5Error>{error}</H5Error> : null}
        </View>
        <View
          style={{
            ...styles.buttonContainer,
          }}
        >
          <Button primary disabled={disabled} onPress={onContinue} isLoading={isLoading}>
            {t('Continue')}
          </Button>
        </View>
      </View>
    </KeyboardViewContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 48,
  },
  buttonContainer: {
    paddingBottom: 24,
    paddingTop: 16,
  },
})

export default ReEnterPinScreen
