import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { useAppContext } from 'contexts/AppContext'
import HomeContextProvider from 'contexts/HomeContext'
import SendContextProvider from 'contexts/SendContext'

import AppearanceScreen from 'screens/home/AppearanceScreen'
import HomeScreen from 'screens/home/HomeScreen'
import HomeTokenBalanceScreen from 'screens/home/HomeTokenBalanceScreen'
import TransactionDetailsScreen from 'screens/home/HomeTokenBalanceScreen/TransactionDetailsScreen'
import ManageBiometricScreen from 'screens/home/ManageBiometricScreen'
import ProfileScreen from 'screens/home/ProfileScreen'
import TermsScreen from 'screens/home/TermsScreen'
import DisplayKeyScreen from 'screens/home/exportKey/DisplayKeyScreen'
import EnterRecoveryShareScreen from 'screens/home/exportKey/EnterRecoveryShareScreen'
import RecoveryAlertScreen from 'screens/home/exportKey/RecoveryAlertScreen'
import NetworkDetailsScreen from 'screens/home/networks/NetworkDetailsScreen'
import ReceiveTokenScreen from 'screens/home/receive/ReceiveTokenScreen'
import ReceiveTokenSelectNetworkScreen from 'screens/home/receive/ReceiveTokenSelectNetworkScreen'
import EnterWalletScreen from 'screens/home/send/EnterWalletScreen'
import PreviewSendScreen from 'screens/home/send/PreviewSendScreen'
import ScanWalletScreen from 'screens/home/send/ScanWalletScreen'
import SelectAssetScreen from 'screens/home/send/SelectAssetScreen'
import SendAmountScreen from 'screens/home/send/SendAmountScreen'
import SendConfirmationScreen from 'screens/home/send/SendConfirmationScreen'

import i18n from 'translations/config'

import BiometricModal from '../components/BiometricModal'
import LogoTitle from './LogoTitle'

const { t } = i18n

const Home = createNativeStackNavigator()

const HomeStack = () => {
  const { theme } = useAppContext()

  return (
    <HomeContextProvider>
      <SendContextProvider>
        <Home.Navigator
          screenOptions={{
            headerTransparent: true,
            headerShadowVisible: false,
            headerTitleAlign: 'center',
            headerTitleStyle: {
              color: theme.textDefault,
              fontWeight: 'bold',
              fontSize: 18,
            },
            headerBackTitleVisible: false,
            headerTintColor: theme.textDefault,
          }}
        >
          <Home.Screen
            name='HomeScreen'
            component={HomeScreen}
            options={{ gestureEnabled: false, headerShown: false }}
          />
          <Home.Screen
            name='HomeTokenBalanceScreen'
            component={HomeTokenBalanceScreen}
            options={({ route }) => ({
              headerTitle: props => <LogoTitle route={route} {...props} />,
            })}
          />
          <Home.Screen
            name='TransactionDetailsScreen'
            component={TransactionDetailsScreen}
            options={{ title: t('Transaction Details') }}
          />
          <Home.Screen name='ProfileScreen' component={ProfileScreen} />
          <Home.Screen
            name='NetworkDetailsScreen'
            component={NetworkDetailsScreen}
            options={({ route }) => ({
              headerTitle: props => <LogoTitle route={route} {...props} />,
            })}
          />
          <Home.Screen
            name='AppearanceScreen'
            component={AppearanceScreen}
            options={{ title: t('Appearance') }}
          />
          <Home.Screen
            name='TermsScreen'
            component={TermsScreen}
            options={{ title: t('Terms and Services') }}
          />
          <Home.Screen
            name='ManageBiometricScreen'
            component={ManageBiometricScreen}
            options={({ route }) => ({
              headerTitle: props => <LogoTitle route={route} {...props} />,
            })}
          />
          <Home.Screen
            name='EnterRecoveryShareScreen'
            component={EnterRecoveryShareScreen}
            options={{ title: t('Export Private Key') }}
          />
          <Home.Screen
            name='RecoveryAlertScreen'
            component={RecoveryAlertScreen}
            options={{ title: t('Alert') }}
          />
          <Home.Screen
            name='DisplayKeyScreen'
            component={DisplayKeyScreen}
            options={{ title: t('Private Key') }}
          />
          <Home.Screen
            name='SelectAssetScreen'
            component={SelectAssetScreen}
            options={{ title: t('Select Token to Send') }}
          />
          <Home.Screen
            name='ScanWalletScreen'
            component={ScanWalletScreen}
            options={{ title: t('Scan Wallet Address') }}
          />
          <Home.Screen
            name='EnterWalletScreen'
            component={EnterWalletScreen}
            options={{ title: t('Enter Wallet Address') }}
          />
          <Home.Screen
            name='SendAmountScreen'
            component={SendAmountScreen}
            options={{ title: t('Amount to Send') }}
          />
          <Home.Screen
            name='PreviewSendScreen'
            component={PreviewSendScreen}
            options={{ title: t('Preview Transaction') }}
          />
          <Home.Screen
            name='SendConfirmationScreen'
            component={SendConfirmationScreen}
            options={{ title: t('Confirmation'), headerBackVisible: false }}
          />
          <Home.Screen
            name='ReceiveTokenSelectNetworkScreen'
            component={ReceiveTokenSelectNetworkScreen}
            options={{ title: t('Select Network') }}
          />
          <Home.Screen
            name='ReceiveTokenScreen'
            component={ReceiveTokenScreen}
            options={{ title: t('Receive') }}
          />
        </Home.Navigator>
      </SendContextProvider>
      <BiometricModal />
    </HomeContextProvider>
  )
}

export default HomeStack
