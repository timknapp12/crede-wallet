import { createNativeStackNavigator } from '@react-navigation/native-stack'

import RecoveryContextProvider from 'contexts/RecoveryContext'

import RecoverBySeedPhraseScreen from 'screens/recovery/RecoverBySeedPhraseScreen'
import RecoveryByPdfScreen from 'screens/recovery/RecoveryByPdfScreen'
import SecurityAnswersReviewScreen from 'screens/recovery/SecurityAnswersReviewScreen'
import SecurityQuestionsAnswersScreen from 'screens/recovery/SecurityQuestionsAnswersScreen'
import SelectRecoveryOptionScreen from 'screens/recovery/SelectRecoveryOptionScreen'
import WalletConnectedFailedScreen from 'screens/recovery/WalletConnectedFailedScreen'
import WalletConnectedSuccessScreen from 'screens/recovery/WalletConnectedSuccessScreen'
import EnterCurrentPinScreen from 'screens/recovery/resetPin/EnterCurrentPinScreen'
import EnterNewPinScreen from 'screens/recovery/resetPin/EnterNewPinScreen'
import ResetPinOptionsScreen from 'screens/recovery/resetPin/ResetPinOptionsScreen'

const Recovery = createNativeStackNavigator()

const RecoveryStack = () => {
  return (
    <RecoveryContextProvider>
      <Recovery.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Recovery.Screen
          name='SelectRecoveryOptionScreen'
          component={SelectRecoveryOptionScreen}
        />
        <Recovery.Screen
          name='SecurityQuestionsAnswersScreen'
          component={SecurityQuestionsAnswersScreen}
        />
        <Recovery.Screen
          name='SecurityAnswersReviewScreen'
          component={SecurityAnswersReviewScreen}
        />
        <Recovery.Screen
          name='WalletConnectedSuccessScreen'
          component={WalletConnectedSuccessScreen}
        />
        <Recovery.Screen
          name='WalletConnectedFailedScreen'
          component={WalletConnectedFailedScreen}
        />
        <Recovery.Screen
          name='RecoverBySeedPhraseScreen'
          component={RecoverBySeedPhraseScreen}
        />
        <Recovery.Screen name='RecoveryByPdfScreen' component={RecoveryByPdfScreen} />
        <Recovery.Screen name='ResetPinOptionsScreen' component={ResetPinOptionsScreen} />
        <Recovery.Screen name='EnterCurrentPinScreen' component={EnterCurrentPinScreen} />
        <Recovery.Screen name='EnterNewPinScreen' component={EnterNewPinScreen} />
      </Recovery.Navigator>
    </RecoveryContextProvider>
  )
}

export default RecoveryStack
