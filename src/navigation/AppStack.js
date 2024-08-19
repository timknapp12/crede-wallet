import { createNativeStackNavigator } from '@react-navigation/native-stack'

import CreateSharesStack from './CreateSharesStack'
import HomeStack from './HomeStack'
import LoginStack from './LoginStack'
import RecoveryStack from './RecoveryStack'

const App = createNativeStackNavigator()

const AppStack = () => {
  return (
    <App.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <App.Screen name='LoginStack' component={LoginStack} />
      <App.Screen name='CreateSharesStack' component={CreateSharesStack} />
      <App.Screen name='RecoveryStack' component={RecoveryStack} />
      <App.Screen name='HomeStack' component={HomeStack} />
    </App.Navigator>
  )
}

export default AppStack
