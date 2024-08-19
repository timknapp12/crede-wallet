import { useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { useEmailPinReset } from 'api'

import {
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
import { useRecoveryContext } from 'contexts/RecoveryContext'

import i18n from 'translations/config'

import { removeTwoRawShares, storeTwoRawShares } from 'utils/asyncStorage'

const { t } = i18n

const EnterNewPinScreen = () => {
  const { theme, firebaseId, navigateAndLog } = useAppContext()
  const { tempStoredShares, setTempStoredShares, setSecurityAnswers, setOldPin } =
    useRecoveryContext()
  const { mutateAsync: sendEmailPinReset } = useEmailPinReset()

  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [error, setError] = useState('')
  const [pinPage, setPinPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

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
      // delete old pin storage
      await removeTwoRawShares(firebaseId)
      // add new pin storage
      await storeTwoRawShares(pin, firebaseId, [
        tempStoredShares?.[0],
        tempStoredShares?.[1],
      ])
      try {
        await sendEmailPinReset()
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to send email:', error)
      }
      // remove sensitive info from context
      setTempStoredShares([])
      setSecurityAnswers([])
      setOldPin('')
      navigateAndLog('WalletConnectedSuccessScreen', 'wallet_connect_success')
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
          <Row>
            <CredeLogo />
          </Row>
          <Column $align='flex-start' $gap='40px'>
            <Column $gap='8px' $align='flex-start'>
              <ScreenTitle>{t('Enter New Pin')}</ScreenTitle>
              <PrimaryText>
                {t(
                  'It is recommended to record the pin in a safe place like a password manager or in a safe.'
                )}
              </PrimaryText>
            </Column>
            {pinPage === 1 ? (
              <Column $gap='4px' $align='flex-start'>
                <PrimaryText style={{ fontSize: 16, fontWeight: 700 }}>
                  {t('New Pin')}
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
                  {t('Re-Enter New Pin')}
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

export default EnterNewPinScreen
