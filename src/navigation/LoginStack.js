import { createNativeStackNavigator } from '@react-navigation/native-stack'

import AcceptTermsScreen from 'screens/setup/AcceptTermsScreen'
import AccountCreatedScreen from 'screens/setup/AccountCreatedScreen'
import ConfirmationEmailSentScreen from 'screens/setup/ConfirmationEmailSentScreen'
import CreateAccountScreen from 'screens/setup/CreateAccountScreen'
import ForgotPasswordScreen from 'screens/setup/ForgotPasswordScreen'
import GetStartedScreen from 'screens/setup/GetStartedScreen'
import ResetPasswordSentScreen from 'screens/setup/ResetPasswordSentScreen'
import SignInToCredeScreen from 'screens/setup/SignInToCredeScreen'
import SignInWithEmailScreen from 'screens/setup/SignInWithEmailScreen'
import SignUpWithEmailScreen from 'screens/setup/SignUpWithEmailScreen'
import WelcomeScreen from 'screens/setup/WelcomeScreen'

const Login = createNativeStackNavigator()

const LoginStack = () => {
  return (
    <Login.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Login.Screen name='GetStartedScreen' component={GetStartedScreen} />
      <Login.Screen name='WelcomeScreen' component={WelcomeScreen} />
      <Login.Screen name='CreateAccountScreen' component={CreateAccountScreen} />
      <Login.Screen name='SignUpWithEmailScreen' component={SignUpWithEmailScreen} />
      <Login.Screen name='SignInToCredeScreen' component={SignInToCredeScreen} />
      <Login.Screen name='AcceptTermsScreen' component={AcceptTermsScreen} />
      <Login.Screen
        name='ConfirmationEmailSentScreen'
        component={ConfirmationEmailSentScreen}
      />
      <Login.Screen name='SignInWithEmailScreen' component={SignInWithEmailScreen} />
      <Login.Screen name='ForgotPasswordScreen' component={ForgotPasswordScreen} />
      <Login.Screen name='ResetPasswordSentScreen' component={ResetPasswordSentScreen} />
      <Login.Screen name='AccountCreatedScreen' component={AccountCreatedScreen} />
    </Login.Navigator>
  )
}

export default LoginStack
