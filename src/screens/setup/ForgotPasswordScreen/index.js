import auth from '@react-native-firebase/auth'
import { useState } from 'react'
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native'

import {
  Button,
  Column,
  CredeLogo,
  H5Error,
  Input,
  PrimaryText,
  ScreenContainer,
  ScreenTitle,
} from 'components'

// hooks
import { useAppContext } from 'contexts/AppContext'

import { size } from 'styles/constants'

// utils
import i18n from 'translations/config'

const { s140 } = size
const { t } = i18n

const ForgotPasswordScreen = () => {
  const { navigateAndLog, email, setEmail, currentLanguage, logEvent } = useAppContext()
  const [error, setError] = useState('')

  const goToResetPasswordSentScreen = () => {
    navigateAndLog('ResetPasswordSentScreen', 'nav_to_reset_pw_link_sent_screen')
  }

  const sendResetEmail = async () => {
    try {
      auth().languageCode = currentLanguage
      await auth().sendPasswordResetEmail(email)
      goToResetPasswordSentScreen()
      logEvent('auth_password_link_sent')
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <ScreenContainer>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Column $height='100%' $justify='flex-start'>
          <CredeLogo />
          <Column $align='flex-start'>
            <ScreenTitle>{t('Forgot your password?')}</ScreenTitle>
            <PrimaryText>
              {t(`We’ll send you a reset link if your account exists.`)}
            </PrimaryText>
            <Input
              label={t('Email')}
              value={email}
              onChangeText={text => {
                setEmail(text)
                setError('')
              }}
              autoCapitalize='none'
              keyboardType='email-address'
              autoComplete='email'
              autoFocus={true}
            />
          </Column>
          <Column $height={s140} $justify='space-between'>
            {error ? <H5Error>{error}</H5Error> : <View />}
            <Button primary disabled={!email} onPress={sendResetEmail}>
              {t('Reset Password')}
            </Button>
          </Column>
        </Column>
      </TouchableWithoutFeedback>
    </ScreenContainer>
  )
}

export default ForgotPasswordScreen
