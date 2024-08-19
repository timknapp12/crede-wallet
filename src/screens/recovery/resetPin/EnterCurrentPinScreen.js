import { useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import {
  BackIcon,
  Button,
  Column,
  CredeLogo,
  KeyboardViewContainer,
  PrimaryText,
  ScreenTitle,
  SmoothPinCodeInput,
  Toast,
} from 'components'

import { useAppContext } from 'contexts/AppContext'
import { useRecoveryContext } from 'contexts/RecoveryContext'

import i18n from 'translations/config'

import { getTwoRawShares } from 'utils/asyncStorage'

const { t } = i18n

const EnterCurrentPinScreen = () => {
  const { navigateAndLog, theme, firebaseId } = useAppContext()
  const { setTempStoredShares, setOldPin } = useRecoveryContext()

  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const isFourDigits = pin => {
    const pattern = /^\d{4}$/
    return pattern.test(pin)
  }

  const pinDisabled = !isFourDigits(pin)

  const handleSubmitCurrentPin = async () => {
    setError('')
    if (!isFourDigits(pin)) return setError(t('This must be a 4-digit number'))
    setIsLoading(true)
    try {
      const shares = await getTwoRawShares(pin, firebaseId)
      setOldPin(pin)
      setTempStoredShares(shares)
      navigateAndLog('EnterNewPinScreen', 'nav_to_setup_new_pin')
    } catch (error) {
      setPin('')
      return setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoBack = () => {
    setPin('')
    navigateAndLog('ResetPinOptionsScreen', 'nav_back_to_reset_pin_options_screen')
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
          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <TouchableOpacity onPress={handleGoBack}>
              <BackIcon />
            </TouchableOpacity>
            <CredeLogo />
            {/* add invisible icon same width as back icon to make logo sit in center */}
            <BackIcon color='transparent' />
          </View>
          <Column $align='flex-start' $gap='40px'>
            <Column $gap='8px' $align='flex-start'>
              <ScreenTitle>{t('Enter Current Pin')}</ScreenTitle>
              <PrimaryText>
                {t('The pin you set up when creating your wallet.')}
              </PrimaryText>
            </Column>
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
            backgroundColor: theme.backgroundDefault,
          }}
        >
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 16,
            }}
          >
            <Button
              primary
              onPress={handleSubmitCurrentPin}
              isLoading={isLoading}
              disabled={pinDisabled}
            >
              {t('Reset Pin')}
            </Button>
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

export default EnterCurrentPinScreen
