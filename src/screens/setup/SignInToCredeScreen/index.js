import { appleAuth } from '@invertase/react-native-apple-authentication'
import auth from '@react-native-firebase/auth'
// Social Sign ins
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import Constants from 'expo-constants'
import { useState } from 'react'
import { TouchableOpacity, View } from 'react-native'

import { useGetTerms, useGetWallet } from 'api'

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

import { useAppContext } from 'contexts/AppContext'

import { size } from 'styles/constants'

import i18n from 'translations/config'

import { getEthPublicKey } from 'utils/asyncStorage'

const { s24, s30 } = size
const { t } = i18n

const SignInToCredeScreen = () => {
  const { logEvent, navigateAndLog, goToAcceptTermsScreen, navigateToNewStackAndLog } =
    useAppContext()
  const [authError, setAuthError] = useState('')
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isAppleLoading, setIsAppleLoading] = useState(false)
  const { mutateAsync: getWallet } = useGetWallet()

  const goToSignInWithEmailScreen = () => {
    navigateAndLog('SignInWithEmailScreen', 'nav_to_signIn_w_email_screen')
  }

  const { mutateAsync: getTerms } = useGetTerms()

  // GOOGLE SIGN IN
  const webClientId = Constants.expoConfig.extra.googleWebClientId

  GoogleSignin.configure({
    webClientId,
  })

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
      setIsGoogleLoading(false)
      return navigateToNewStackAndLog(
        'HomeStack',
        'HomeScreen',
        'nav_to_home_screen_from_sign_in'
      )
    } else if (
      userWallet?.addresses?.EVM &&
      userWallet?.addresses?.EVM !== ethPublicKeyInStorage
    ) {
      // user has an account but is on a new device
      setIsGoogleLoading(false)
      return navigateToNewStackAndLog(
        'RecoveryStack',
        'SelectRecoveryOptionScreen',
        'nav_to_recovery_screen_from_sign_in'
      )
    }

    const termsData = await getTerms()
    const areTermsAccepted = termsData?.signed
    if (!areTermsAccepted && !userWallet?.addresses?.EVM) {
      setIsGoogleLoading(false)
      return goToAcceptTermsScreen()
    } else {
      setIsGoogleLoading(false)
      return navigateToNewStackAndLog(
        'CreateSharesStack',
        'SetUpPinScreen',
        'nav_to_setup_pin_from_sign_in'
      )
    }
  }

  async function onGoogleButtonPress() {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      })
      const { idToken } = await GoogleSignin.signIn()
      if (idToken) {
        const googleCredential = auth.GoogleAuthProvider.credential(idToken)
        return auth()
          .signInWithCredential(googleCredential)
          .then(userCredential => {
            const user = userCredential.user
            const firebaseId = user?.uid
            checkUserStatus(firebaseId)
          })
      } else {
        setAuthError('Google Sign-In: idToken is null')
        setIsGoogleLoading(false)
        throw Error('Google Sign-In: idToken is null')
      }
    } catch (error) {
      setIsGoogleLoading(false)
      setAuthError('Google Sign-In Error:', error.message)
      throw Error(error.message)
    }
  }

  const signInWithGoogle = async () => {
    setIsGoogleLoading(true)
    try {
      await onGoogleButtonPress()
      logEvent('auth_sign_in_with_google_success')
    } catch (error) {
      setAuthError(error.message)
      setIsGoogleLoading(false)
      logEvent('auth_sign_in_with_google_failure')
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
      return auth()
        .signInWithCredential(appleCredential)
        .then(userCredential => {
          const user = userCredential.user
          const firebaseId = user?.uid
          checkUserStatus(firebaseId)
        })
    }
  }

  const signInWithApple = async () => {
    setIsAppleLoading(true)
    try {
      await onAppleButtonPress()
      logEvent('auth_apple_sign_in_success')
    } catch (error) {
      setAuthError(error.message)
      logEvent('auth_apple_sign_in_failure')
      setIsAppleLoading(false)
    }
  }

  const handleGoBack = () => {
    navigateAndLog('WelcomeScreen', 'nav_to_welcome_screen')
  }

  return (
    <ScreenContainer>
      <Column $height='100%' $justify='space-between'>
        <Column>
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
            <PrimaryText>{t('A crypto wallet for your token treasures')}</PrimaryText>
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
          <Button onPress={goToSignInWithEmailScreen} icon={<EmailIcon />}>
            {t('Continue with Email & Password')}
          </Button>
        </Column>
      </Column>
    </ScreenContainer>
  )
}

export default SignInToCredeScreen
