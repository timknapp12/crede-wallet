import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SplashScreen from 'expo-splash-screen'
import * as React from 'react'
import { View } from 'react-native'

import { useGetTerms, useGetWallet } from 'api'

import { useAppContext } from 'contexts/AppContext'

import { getAreSharesCreated, getEthPublicKey } from 'utils/asyncStorage'

const LOADING_SCREEN_TIMEOUT_TIME = 1000

const GetStartedScreen = () => {
  const {
    fbUser,
    navigateAndLog,
    navigateToNewStackAndLog,
    initializing,
    setIsBiometricModalOpen,
  } = useAppContext()
  const { mutateAsync: getWallet } = useGetWallet()
  const { mutateAsync: getTerms } = useGetTerms()

  const [hasRedirected, setHasRedirected] = React.useState(false)

  const goToSignInWithEmailScreen = () => {
    navigateAndLog('SignInWithEmailScreen', 'on_launch_email_not_verified')
  }

  const goToAcceptTermsScreen = () => {
    navigateAndLog('AcceptTermsScreen', 'on_launch_terms_not_accepted')
  }

  const goToCreateSharesStack = () => {
    navigateAndLog('CreateSharesStack', 'on_launch_no_shares_found')
  }

  const goToHomeStack = async firebaseId => {
    const value = await AsyncStorage.getItem(`areBiometricsEnabled${firebaseId}`)
    const biometricResult = value === 'true'
    // eslint-disable-next-line no-undef
    if (biometricResult && !__DEV__) setIsBiometricModalOpen(true)
    navigateAndLog('HomeStack', 'on_launch_nav_to_home')
  }

  const goToWelcomeScreen = () => {
    navigateToNewStackAndLog('LoginStack', 'WelcomeScreen', 'on_launch_no_user_found')
  }

  const goToRecovery = () => {
    navigateToNewStackAndLog(
      'RecoveryStack',
      'SelectRecoveryOptionScreen',
      'on_launch_new_device_detected'
    )
  }

  React.useEffect(() => {
    const redirectUser = async () => {
      if (!initializing && !hasRedirected) {
        if (!fbUser) return await redirectFn(goToWelcomeScreen)
        // if firebase user exists, set that redirect has happened. after this, let other screens handle redirecting
        setHasRedirected(true)
        const isEmailVerified = fbUser?.emailVerified
        if (!isEmailVerified) return await redirectFn(goToSignInWithEmailScreen)
        const firebaseId = fbUser?.uid
        const ethPublicKeyInStorage = await getEthPublicKey(firebaseId)
        let userWallet
        try {
          userWallet = await getWallet()
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e)
        }
        // check if user is on new device
        if (
          userWallet?.addresses?.EVM &&
          userWallet?.addresses?.EVM !== ethPublicKeyInStorage
        )
          return redirectFn(goToRecovery)
        const termsData = await getTerms()
        const areTermsAccepted = termsData?.signed
        if (!areTermsAccepted) return await redirectFn(goToAcceptTermsScreen)
        const areSharesCreated = await getAreSharesCreated(firebaseId)
        if (!areSharesCreated) return await redirectFn(goToCreateSharesStack)
        return await redirectFn(() => goToHomeStack(firebaseId))
      }
    }

    redirectUser()
  }, [fbUser, initializing])

  const redirectFn = redirect => {
    setTimeout(async () => {
      redirect()
      await SplashScreen.hideAsync()
    }, LOADING_SCREEN_TIMEOUT_TIME)
  }

  return (
    <View
      style={{
        height: '100%',
        width: '100%',
        backgroundColor: '#0D0C0C',
      }}
    />
  )
}

export default GetStartedScreen
