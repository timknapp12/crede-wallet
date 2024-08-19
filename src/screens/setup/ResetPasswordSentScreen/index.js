import auth from '@react-native-firebase/auth'
import { useState } from 'react'
import { View } from 'react-native'

import {
  Button,
  Column,
  CredeLogo,
  H5Error,
  PrimaryText,
  ScreenContainer,
  ScreenTitle,
  Toast,
} from 'components'

// hooks
import { useAppContext } from 'contexts/AppContext'

// utils
import i18n from 'translations/config'

const { t } = i18n

const ResetPasswordSentScreen = () => {
  const { navigateAndLog, email, currentLanguage } = useAppContext()

  const [error, setError] = useState('')
  const [showToast, setShowToast] = useState(false)

  const goToSignInScreen = () => {
    navigateAndLog('SignInWithEmailScreen', 'nav_to_signin_with_email')
  }

  const resendResetEmail = async () => {
    try {
      auth().languageCode = currentLanguage
      await auth().sendPasswordResetEmail(email)
      setShowToast(true)
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <ScreenContainer>
      <Column $height='100%' $justify='space-between'>
        <Column>
          <CredeLogo />
          <ScreenTitle>{t('Check your email')}</ScreenTitle>
          <PrimaryText>
            {t(
              `We’ve emailed you a reset link. If it doesn’t show up check your spam folder.`
            )}
          </PrimaryText>
        </Column>
        <Column>
          {error ? <H5Error>{error}</H5Error> : <View />}
          {showToast && (
            <Toast onClose={() => setShowToast(false)} variant='success'>
              {t('Reset password email sent!')}
            </Toast>
          )}
          <Button onPress={resendResetEmail}>{t('Resend reset link')}</Button>
          <Button primary onPress={goToSignInScreen}>
            {t('Go back to Sign in')}
          </Button>
        </Column>
      </Column>
    </ScreenContainer>
  )
}

export default ResetPasswordSentScreen
