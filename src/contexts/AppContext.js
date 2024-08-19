import AsyncStorage from '@react-native-async-storage/async-storage'
import auth from '@react-native-firebase/auth'
import crashlytics from '@react-native-firebase/crashlytics'
import { useNavigation } from '@react-navigation/native'
import { useQueryClient } from '@tanstack/react-query'
import * as Notifications from 'expo-notifications'
import PropTypes from 'prop-types'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { AppState, LogBox, useColorScheme } from 'react-native'
import { ThemeProvider } from 'styled-components'

import { useGetNetworks } from 'api'

import { darkTheme, lightTheme } from 'styles/themes'

import { detectLanguage, initializeI18n } from 'translations/config'

import { getEthPublicKey } from 'utils/asyncStorage'
import fbLogEvent from 'utils/firebase/logging'

import { registerForPushNotificationsAsync } from '../notifications/registerForPushNotifications'

const AppContext = createContext({})

export const useAppContext = () => useContext(AppContext)

LogBox.ignoreLogs([
  `Constants.platform.ios.model has been deprecated in favor of expo-device's Device.modelName property. This API will be removed in SDK 45.`,
])

const LOCAL_STORAGE_COLOR_THEME_KEY = 'localStorageColorThemeKey'

const AppContextProvider = ({ children }) => {
  // theme
  const [colorTheme, setColorTheme] = useState('device') // can set to 'device', 'light', or 'dark'
  const deviceColorScheme = useColorScheme()
  const deviceScheme = deviceColorScheme === 'light' ? lightTheme : darkTheme

  const theme =
    colorTheme === 'device'
      ? deviceScheme
      : colorTheme === 'light'
        ? lightTheme
        : darkTheme

  useEffect(() => {
    const setInitialThemeFromStorage = async () => {
      const localStorageColorTheme = await AsyncStorage.getItem(
        LOCAL_STORAGE_COLOR_THEME_KEY
      )

      if (typeof localStorageColorTheme === 'string') {
        setColorTheme(localStorageColorTheme)
      } else {
        setColorTheme('device')
      }
    }

    setInitialThemeFromStorage()
  }, [])

  const setAndSaveColorTheme = async colorThemeProp => {
    setColorTheme(colorThemeProp)
    await AsyncStorage.setItem(LOCAL_STORAGE_COLOR_THEME_KEY, colorThemeProp)
    await logEvent(`color_theme_set_to_${colorThemeProp}`)
  }

  // device language
  const appState = useRef(AppState.currentState)
  const [appStateVisible, setAppStateVisible] = useState(appState.current)
  const [currentLanguage, setCurrentLanguage] = useState('en')
  const currentCurrency = 'USD'

  // auth
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isAuthLoading, setIsAuthLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [initializing, setInitializing] = useState(true)
  const [fbUser, setFbUser] = useState(null)
  const [token, setToken] = useState('')

  // biometrics
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false)
  const [areBiometricsEnabled, setAreBiometricsEnabled] = useState(false)
  // this is needed because Android leaves the app to access camera so it would trigger the blur w/o this check when scanning a QR Code
  const [dontBlurScreen, setDontBlurScreen] = useState(false)

  const storeAreBiometricsEnabled = async firebaseId => {
    try {
      await AsyncStorage.setItem(`areBiometricsEnabled${firebaseId}`, 'true')
      setAreBiometricsEnabled(true)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('error in storeAreBiometricsEnabled:', e)
    }
  }

  const storeDisableBiometrics = async firebaseId => {
    try {
      await AsyncStorage.setItem(`areBiometricsEnabled${firebaseId}`, 'false')
      setAreBiometricsEnabled(false)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('error in storeDisableBiometrics:', e)
    }
  }

  const getAreBiometricsEnabled = async firebaseId => {
    try {
      const value = await AsyncStorage.getItem(`areBiometricsEnabled${firebaseId}`)
      const result = value === 'true'
      setAreBiometricsEnabled(result)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('error in getAreBiometricsEnabled:', e)
    }
  }
  const firebaseId = fbUser?.uid
  useEffect(() => {
    const firebaseId = fbUser?.uid
    if (!firebaseId) return
    getAreBiometricsEnabled(firebaseId)
  }, [firebaseId])

  const queryClient = useQueryClient()
  const refetch = () => {
    queryClient.invalidateQueries(['getBalance', ethPublicKey])
  }

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // Reinitialize i18n when the app comes to the foreground
        // needed for Android because it doesn't automatically restart the device or app when changing device language
        initializeI18n()
        // refetch token balances when app comes back to the foreground
        refetch()
      }

      appState.current = nextAppState
      setAppStateVisible(appState.current)
      // Check if the app is moving to the background
      if (
        nextAppState.match(/inactive|background/) &&
        areBiometricsEnabled &&
        !dontBlurScreen &&
        // eslint-disable-next-line no-undef
        !__DEV__
      ) {
        setIsBiometricModalOpen(true)
      }
    })

    return () => {
      subscription.remove()
    }
  }, [dontBlurScreen, areBiometricsEnabled])

  useEffect(() => {
    const initialize = async () => {
      const language = await detectLanguage()
      setCurrentLanguage(language)
    }

    initialize()
  }, [appStateVisible])

  // notifications
  const [expoPushToken, setExpoPushToken] = useState('')
  const [notification, setNotification] = useState(false)
  const notificationListener = useRef()
  const responseListener = useRef()

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token))

    notificationListener.current = Notifications.addNotificationReceivedListener(
      notification => {
        setNotification(notification)
      }
    )

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      response => response
    )

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current)
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])

  // analytics / crashlytics
  useEffect(() => {
    crashlytics().log('App mounted.')
  }, [])

  const logEvent = async eventName => {
    await fbLogEvent(eventName)
  }

  const navigation = useNavigation()

  const navigateToNewStackAndLog = (stackName, screenName, eventName) => {
    navigation.navigate(stackName, { screen: screenName })
    logEvent(eventName)
  }

  const navigateAndLog = (screenName, eventName) => {
    navigation.navigate(screenName)
    logEvent(eventName)
  }

  // web3
  const [mnemonic, setMnemonic] = useState('')
  const [ethPrivateKey, setEthPrivateKey] = useState('')
  const [ethPublicKey, setEthPublicKey] = useState('')
  // if wallet is being recovered, skip recoverability setup after setting pin
  const [isRecoveringWallet, setIsRecoveringWallet] = useState(false)

  const getPubEthKeyAsync = async firebaseId => {
    const ethPublicKey = await getEthPublicKey(firebaseId)
    setEthPublicKey(ethPublicKey)
  }

  useEffect(() => {
    const firebaseId = fbUser?.uid
    if (!firebaseId) return
    getPubEthKeyAsync(firebaseId)
  }, [fbUser?.uid])

  const goToAcceptTermsScreen = () => {
    navigateAndLog('AcceptTermsScreen', 'nav_to_accept_terms_screen')
  }

  // Handle user state changes
  const onAuthStateChanged = async user => {
    if (user) {
      const idToken = await user.getIdToken()
      setToken(idToken)
      setFbUser(user)
      setIsAuthenticated(true)
    }
    if (initializing) setInitializing(false)
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
    return subscriber // unsubscribe on unmount
  }, [fbUser])

  const networksQuery = useGetNetworks(firebaseId)
  const networks = networksQuery?.data?.Networks

  // refetch networks once firebaseId exists if initially they were not fetched
  useEffect(() => {
    if (firebaseId && networksQuery.isError) {
      networksQuery.refetch()
    }
  }, [firebaseId, networksQuery.isError, networksQuery.refetch])

  return (
    <AppContext.Provider
      value={{
        theme,
        expoPushToken,
        notification, // this is to handle an incoming notification and display it in the app
        currentLanguage,
        currentCurrency,
        logEvent,
        email,
        setEmail,
        password,
        setPassword,
        isAuthLoading,
        setIsAuthLoading,
        isAuthenticated,
        areBiometricsEnabled,
        storeAreBiometricsEnabled,
        storeDisableBiometrics,
        navigateAndLog,
        goToAcceptTermsScreen,
        colorTheme,
        setAndSaveColorTheme,
        fbUser,
        firebaseId,
        token,
        setToken,
        mnemonic,
        setMnemonic,
        ethPrivateKey,
        setEthPrivateKey,
        ethPublicKey,
        setEthPublicKey,
        navigateToNewStackAndLog,
        isBiometricModalOpen,
        setIsBiometricModalOpen,
        appStateVisible,
        setDontBlurScreen,
        initializing,
        isRecoveringWallet,
        setIsRecoveringWallet,
        networks,
      }}
    >
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </AppContext.Provider>
  )
}

AppContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AppContextProvider
