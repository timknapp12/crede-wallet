import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as LocalAuthentication from 'expo-local-authentication'
import { useEffect, useState } from 'react'

import { useAppContext } from 'contexts/AppContext'
import CreateSharesContextProvider from 'contexts/CreateSharesContext'

import BiometricScreen from 'screens/createShares/BiometricScreen'
import BiometricsEnabledScreen from 'screens/createShares/BiometricsEnabledScreen'
import CongratsScreen from 'screens/createShares/CongratsScreen'
import RecoveryMethodSuccessScreen from 'screens/createShares/RecoveryMethodSuccessScreen'
import ChooseRecoveryMethodScreen from 'screens/createShares/RecoverySetup/ChooseRecoveryMethodScreen'
import ReEnterPinScreen from 'screens/createShares/RecoverySetup/ReEnterPinScreen'
import RecoveryIntroScreen from 'screens/createShares/RecoverySetup/RecoveryIntroScreen'
import RecoveryPdfDownloadScreen from 'screens/createShares/RecoverySetup/RecoveryPdfDownloadScreen'
import RecoveryQuestionsReviewScreen from 'screens/createShares/RecoverySetup/RecoveryQuestionsReviewScreen'
import RecoverySecurityQuestions from 'screens/createShares/RecoverySetup/RecoverySecurityQuestions'
import RecoverySuccessScreen from 'screens/createShares/RecoverySetup/RecoverySuccessScreen'
import SecurityQuestionInput from 'screens/createShares/RecoverySetup/SecurityQuestionInput'
import SetUpPinScreen from 'screens/createShares/SetUpPinScreen'
import SetupPinSuccessScreen from 'screens/createShares/SetupPinSuccessScreen'
import CreateOrImportScreen from 'screens/createShares/importWallet/CreateOrImportScreen'
import ImportSeedPhraseScreen from 'screens/createShares/importWallet/ImportSeedPhraseScreen'
import ImportWalletSuccessScreen from 'screens/createShares/importWallet/ImportWalletSuccessScreen'

const CreateShares = createNativeStackNavigator()

const CreateSharesStack = () => {
  const { logEvent } = useAppContext()
  const [showBioScreen, setShowBioScreen] = useState(true)

  const checkBiometrics = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync()
    const enroll = await LocalAuthentication.isEnrolledAsync()
    if (compatible && enroll) {
      logEvent('biometrics_is_supported_on_device')
      return true
    }
    logEvent('biometrics_not_supported_on_device')
    return false
  }

  const check = async () => {
    const showBiometricScreen = await checkBiometrics()
    return setShowBioScreen(showBiometricScreen)
  }

  useEffect(() => {
    check()
  }, [])

  return (
    <CreateSharesContextProvider>
      <CreateShares.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {showBioScreen && (
          <CreateShares.Screen name='BiometricScreen' component={BiometricScreen} />
        )}
        <CreateShares.Screen
          name='CreateOrImportScreen'
          component={CreateOrImportScreen}
        />
        <CreateShares.Screen
          name='BiometricsEnabledScreen'
          component={BiometricsEnabledScreen}
        />
        <CreateShares.Screen
          name='ImportSeedPhraseScreen'
          component={ImportSeedPhraseScreen}
        />
        <CreateShares.Screen
          name='ImportWalletSuccessScreen'
          component={ImportWalletSuccessScreen}
        />
        <CreateShares.Screen name='SetUpPinScreen' component={SetUpPinScreen} />
        <CreateShares.Screen
          name='SetupPinSuccessScreen'
          component={SetupPinSuccessScreen}
        />
        <CreateShares.Screen
          name='RecoveryMethodSuccessScreen'
          component={RecoveryMethodSuccessScreen}
          options={{ gestureEnabled: false }}
        />
        <CreateShares.Screen name='CongratsScreen' component={CongratsScreen} />
        <CreateShares.Screen
          name='ChooseRecoveryMethodScreen'
          component={ChooseRecoveryMethodScreen}
        />
        <CreateShares.Screen name='RecoveryIntroScreen' component={RecoveryIntroScreen} />
        <CreateShares.Screen
          name='RecoveryPdfDownloadScreen'
          component={RecoveryPdfDownloadScreen}
        />
        <CreateShares.Screen
          name='RecoverySecurityQuestions'
          component={RecoverySecurityQuestions}
        />
        <CreateShares.Screen
          name='RecoverySuccessScreen'
          component={RecoverySuccessScreen}
        />
        <CreateShares.Screen
          name='SecurityQuestionInput'
          component={SecurityQuestionInput}
        />
        <CreateShares.Screen
          name='RecoveryQuestionsReviewScreen'
          component={RecoveryQuestionsReviewScreen}
        />
        <CreateShares.Screen name='ReEnterPinScreen' component={ReEnterPinScreen} />
      </CreateShares.Navigator>
    </CreateSharesContextProvider>
  )
}

export default CreateSharesStack
