import { appleAuth } from '@invertase/react-native-apple-authentication'
import auth from '@react-native-firebase/auth'
// Social Sign ins
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import Constants from 'expo-constants'
import { useState } from 'react'
import { TouchableOpacity, View } from 'react-native'

import {
  AppleButton,
  BackIcon,
  Button,
  Column,
  CredeLogo,
  EmailIcon,
  Gap,
  GoogleButton,
  H5Error,
  PrimaryText,
  ScreenContainer,
  ScreenTitle,
} from 'components'

// hooks
import { useAppContext } from 'contexts/AppContext'

import { size } from 'styles/constants'

// utils
import i18n from 'translations/config'

const { s24, s30 } = size
const { t } = i18n

const CreateAccountScreen = () => {
  const { logEvent, navigateAndLog, goToAcceptTermsScreen } = useAppContext()
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isAppleLoading, setIsAppleLoading] = useState(false)
  const [authError, setAuthError] = useState('')

  const goToSignUpWithEmailScreen = () => {
    navigateAndLog('SignUpWithEmailScreen', 'nav_to_signup_w_email_screen')
  }

  // GOOGLE SIGN IN
  const webClientId = Constants.expoConfig.extra.googleWebClientId

  GoogleSignin.configure({
    webClientId,
  })

  async function onGoogleButtonPress() {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      })
      const { idToken } = await GoogleSignin.signIn()
      if (idToken) {
        const googleCredential = auth.GoogleAuthProvider.credential(idToken)
        return auth().signInWithCredential(googleCredential)
      } else {
        setAuthError('Google Sign-In: idToken is null')
        throw Error('Google Sign-In: idToken is null')
      }
    } catch (error) {
      setAuthError('Google Sign-In Error:', error.message)
      throw Error(error.message)
    }
  }

  const signInWithGoogle = async () => {
    setIsGoogleLoading(true)
    try {
      await onGoogleButtonPress()
      setAuthError('')
      logEvent('auth_sign_up_with_google_success')
      return goToAcceptTermsScreen()
    } catch (error) {
      setAuthError(error.message)
      logEvent('auth_sign_up_with_google_failure')
    } finally {
      setIsGoogleLoading(false)
    }
  }

  // APPLE SIGN IN
  // on iOS
  const onAppleButtonPress = async () => {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    })
    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      setAuthError('Apple Sign-In failed - no identify token returned')
      throw new Error('Apple Sign-In failed - no identify token returned')
    }
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user
    )
    if (credentialState === appleAuth.State.AUTHORIZED) {
      // user is authenticated
      // Create a Firebase credential from the response
      const { identityToken, nonce } = appleAuthRequestResponse
      const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce)

      // Sign the user in with the credential
      return auth().signInWithCredential(appleCredential)
    }
  }

  const signInWithApple = async () => {
    setIsAppleLoading(true)
    try {
      await onAppleButtonPress('btn_create_account_with_apple')
      setAuthError('')
      logEvent('auth_sign_up_with_apple_success')
      return goToAcceptTermsScreen()
    } catch (error) {
      logEvent('auth_sign_up_with_apple_failure')
      setAuthError(error.message)
      setIsAppleLoading(false)
    }
  }

  const handleGoBack = () => {
    navigateAndLog('WelcomeScreen', 'nav_to_welcome_screen')
  }

  return (
    <ScreenContainer>
      <Column $justify='flex-start'>
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
          <ScreenTitle>{t('Create an account')}</ScreenTitle>
          <PrimaryText>
            {t('Your account will be used to sign into your wallet.')}
          </PrimaryText>
        </Column>
        <Gap height={s30} />
        {authError?.length > 0 ? <H5Error>{authError}</H5Error> : null}
        <GoogleButton
          onPress={isGoogleLoading ? () => {} : signInWithGoogle}
          isLoading={isGoogleLoading}
        />
        {appleAuth.isSupported && (
          <AppleButton onPress={signInWithApple} isLoading={isAppleLoading} />
        )}
        <Gap height={s24} />
        <Button onPress={goToSignUpWithEmailScreen} icon={<EmailIcon />}>
          {t('Continue with Email & Password')}
        </Button>
      </Column>
    </ScreenContainer>
  )
}

export default CreateAccountScreen
