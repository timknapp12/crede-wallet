import auth from '@react-native-firebase/auth'
import { useRef, useState } from 'react'
// components
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native'

import { useGetTerms, useGetWallet } from 'api'

import {
  BackIcon,
  Button,
  Column,
  CredeLogo,
  H5Error,
  Input,
  KeyboardViewContainer,
  Link,
  ScreenTitle,
} from 'components'

// hooks
import { useAppContext } from 'contexts/AppContext'

import { size } from 'styles/constants'

// utils
import i18n from 'translations/config'

import { getEthPublicKey } from 'utils/asyncStorage'

const { s4 } = size
const { t } = i18n

const SignInWithEmailScreen = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    logEvent,
    navigateAndLog,
    goToAcceptTermsScreen,
    currentLanguage,
    navigateToNewStackAndLog,
    theme,
  } = useAppContext()
  const [authError, setAuthError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { mutateAsync: getWallet } = useGetWallet()
  const { mutateAsync: getTerms } = useGetTerms()
  const passwordRef = useRef(null)

  const onNext = () => {
    passwordRef.current.focus()
  }

  const goBackToConfirmationScreen = () => {
    setPassword('')
    navigateAndLog('ConfirmationEmailSentScreen', 'nav_back_to_confirmation_screen')
  }

  const goToForgotPasswordScreen = () => {
    setPassword('')
    navigateAndLog('ForgotPasswordScreen', 'nav_to_forgot_password_screen')
  }

  const verifyEmail = async () => {
    try {
      auth().languageCode = currentLanguage
      await auth().currentUser.sendEmailVerification()
      logEvent('auth_verification_email_sent')
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      setAuthError(error.message)
      logEvent('auth_verification_email_sent_failure')
    }
  }

  const checkUserStatus = async firebaseId => {
    const ethPublicKeyInStorage = await getEthPublicKey(firebaseId)
    let userWallet
    try {
      userWallet = await getWallet()
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
    }
    if (
      !!userWallet?.addresses?.EVM &&
      ethPublicKeyInStorage === userWallet?.addresses?.EVM
    ) {
      setIsLoading(false)
      return navigateToNewStackAndLog(
        'HomeStack',
        'HomeScreen',
        'auth_sign_in_w_email_success'
      )
    } else if (
      userWallet?.addresses?.EVM &&
      userWallet?.addresses?.EVM !== ethPublicKeyInStorage
    ) {
      // user has an account but is on a new device
      setIsLoading(false)
      return navigateToNewStackAndLog(
        'RecoveryStack',
        'SelectRecoveryOptionScreen',
        'auth_nav_recovery_screen_from_sign_in'
      )
    }

    const termsData = await getTerms()
    const areTermsAccepted = termsData?.signed
    if (!areTermsAccepted && !userWallet?.addresses?.EVM) {
      setIsLoading(false)
      return goToAcceptTermsScreen()
    } else {
      setIsLoading(false)
      return navigateToNewStackAndLog(
        'CreateSharesStack',
        'SetUpPinScreen',
        'nav_to_setup_pin_from_sign_in'
      )
    }
  }

  const signIn = () => {
    setIsLoading(true)
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        const user = userCredential.user
        if (user?.emailVerified) {
          const firebaseId = user?.uid
          checkUserStatus(firebaseId)
        } else {
          logEvent('auth_user_not_verified_after_email_sent')
          verifyEmail()
          setIsLoading(false)
          goBackToConfirmationScreen()
          return setAuthError(t('Your email has not yet been verified'))
        }
      })
      .catch(error => {
        if (error.code === 'auth/user-not-found') {
          setIsLoading(false)
          // TODO - consider adding button to reroute user to SIGN UP flow
          return setAuthError(
            t(`That email doesn't exist. Did you mean to sign up rather than sign-in?`)
          )
        }

        if (error.code === 'auth/invalid-email') {
          setIsLoading(false)
          return setAuthError(t('That email address is invalid!'))
        }
        setIsLoading(false)
        logEvent('auth_sign_in_w_email_failure')
        setAuthError(error.message)
      })
  }

  const handleGoBack = () => {
    navigateAndLog('SignInToCredeScreen', 'nav_to_sign_in_to_crede_screen')
  }

  return (
    <KeyboardViewContainer
      style={{ width: '100%', paddingTop: Platform.OS === 'ios' ? 48 : 72 }}
      iosOffset={30}
    >
      <Column $flex={1} $height='100%' $justify='space-between'>
        <Column
          $flex={1}
          $justify='flex-start'
          style={{ paddingLeft: 24, paddingRight: 24 }}
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
          <Column $align='flex-start'>
            <ScreenTitle>{t('Sign in to Crede')}</ScreenTitle>
          </Column>
          <Column $gap='0px' $align='flex-start'>
            <Input
              label={t('Email')}
              value={email}
              onChangeText={text => {
                setEmail(text)
                setAuthError('')
              }}
              autoCapitalize='none'
              keyboardType='email-address'
              autoComplete='email'
              autoFocus
              returnKeyType='next'
              onSubmitEditing={onNext}
            />
          </Column>
          <Column $gap={s4} $align='flex-end'>
            <Input
              label={t('Password')}
              value={password}
              onChangeText={text => {
                setPassword(text)
                setAuthError('')
              }}
              ref={passwordRef}
              textContentType='password'
              autoComplete='password'
              returnKeyType='go'
              onSubmitEditing={signIn}
            />
            <TouchableOpacity onPress={goToForgotPasswordScreen}>
              <Link>{t('Forgot Password?')}</Link>
            </TouchableOpacity>
          </Column>
        </Column>
        <View
          $justify='space-between'
          style={{
            width: '100%',
            padding: 24,
            paddingTop: 16,
            backgroundColor: theme.backgroundDefault,
          }}
        >
          {authError ? <H5Error style={styles.error}>{authError}</H5Error> : <View />}
          <Button
            primary
            onPress={signIn}
            disabled={!email || !password}
            isLoading={isLoading}
          >
            {t('Continue')}
          </Button>
        </View>
      </Column>
    </KeyboardViewContainer>
  )
}

export default SignInWithEmailScreen

const styles = StyleSheet.create({
  error: {
    textAlign: 'center',
    paddingBottom: 16,
  },
  container: {
    width: '100%',
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 48 : 72,
    flex: 1,
  },
})
