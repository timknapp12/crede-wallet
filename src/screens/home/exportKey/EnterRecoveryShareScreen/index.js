import { useHeaderHeight } from '@react-navigation/elements'
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { View } from 'react-native'

import {
  Button,
  KeyboardViewContainer,
  PrimaryText,
  SmoothPinCodeInput,
  Toast,
} from 'components'

import { useAppContext } from 'contexts/AppContext'

import i18n from 'translations/config'

import { reconstructMnemonic } from 'utils/api/wallet/cryptography'
import { getTwoRawShares } from 'utils/asyncStorage'

const { t } = i18n

const EnterRecoveryShareScreen = () => {
  const headerHeight = useHeaderHeight()
  const { theme, setMnemonic, setEthPrivateKey, firebaseId } = useAppContext()
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
      await setMnemonic(mnemonic)
      await setEthPrivateKey(ethPrivateKey)
      return Promise.resolve()
    } catch (error) {
      setPin('')
      return Promise.reject(error)
    }
  }

  const navigation = useNavigation()

  const onContinue = async () => {
    if (!isFourDigits(pin)) return setError(t('This must be a 4-digit number'))
    setIsLoading(true)
    try {
      await handleRecoverMnemonic()
      navigation.push('RecoveryAlertScreen')
      setPin('')
    } catch (error) {
      setPin('')
      setError(t(error))
    }
    setIsLoading(false)
  }

  const disabled = pin?.length !== 4 || isLoading

  return (
    <KeyboardViewContainer>
      <View
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          marginTop: headerHeight,
        }}
      >
        <View style={{ padding: 24, flex: 1, gap: 24 }}>
          <PrimaryText>
            {t(`In order to export your private key enter your recovery pin.`)}
          </PrimaryText>
          <SmoothPinCodeInput
            value={pin}
            onTextChange={text => setPin(text)}
            autoFocus
            theme={theme}
          />
          {error ? (
            <Toast showToast={!!error} onClose={() => setError('')} variant='error'>
              {error}
            </Toast>
          ) : null}
        </View>
        <View
          style={{
            padding: 24,
            paddingTop: 16,
            backgroundColor: theme.backgroundDefault,
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

export default EnterRecoveryShareScreen
