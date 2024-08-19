import auth from '@react-native-firebase/auth'
import { useState } from 'react'
import { StyleSheet } from 'react-native'

import {
  Button,
  Column,
  CredeLogo,
  H5Error,
  PrimaryText,
  ScreenContainer,
  ScreenTitle,
} from 'components'

import { useAppContext } from 'contexts/AppContext'

import i18n from 'translations/config'

const { t } = i18n

const ConfirmationEmailSentScreen = () => {
  const { navigateAndLog, currentLanguage, logEvent } = useAppContext()
  const [authError, setAuthError] = useState('')
  const goToSignInScreen = () => {
    navigateAndLog('SignInWithEmailScreen', 'nav_to_signin_with_email')
    setAuthError('')
  }
  const [isLoading, setIsLoading] = useState(false)

  const verifyEmail = async () => {
    setIsLoading(true)
    try {
      auth().languageCode = currentLanguage
      await auth().currentUser.sendEmailVerification()
      logEvent('auth_verification_email_sent')
      goToSignInScreen()
    } catch (error) {
      setAuthError(error.message)
      logEvent('auth_verification_email_sent_failure')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ScreenContainer>
      <Column $height='100%' $justify='space-between'>
        <Column>
          <CredeLogo />
          <ScreenTitle>{t('Confirmation sent to your email')}</ScreenTitle>
          <PrimaryText>
            {t(
              'A confirmation link was sent to your email. Once you open it come back to this app and log into your account.'
            )}
          </PrimaryText>
        </Column>
        <Column>
          {authError ? <H5Error style={styles.error}>{authError}</H5Error> : null}
          <Button onPress={verifyEmail} isLoading={isLoading}>
            {t('Resend verification email')}
          </Button>
          <Button primary onPress={goToSignInScreen}>
            {t('Go to Log in')}
          </Button>
        </Column>
      </Column>
    </ScreenContainer>
  )
}

export default ConfirmationEmailSentScreen

const styles = StyleSheet.create({
  error: {
    textAlign: 'center',
  },
})
