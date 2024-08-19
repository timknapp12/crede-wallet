import { NavigationContainer } from '@react-navigation/native'
import * as SplashScreen from 'expo-splash-screen'
import * as Updates from 'expo-updates'
import { useEffect } from 'react'
import 'react-native-gesture-handler'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { QueryClientProvider } from 'contexts/apiProvider'

import { CustomStatusBar } from './src/components/CustomStatusBar'
import AppContextProvider from './src/contexts/AppContext'
import AppStack from './src/navigation/AppStack'
import applyGlobalPolyfills from './src/utils/applyGlobalPolyfills'

applyGlobalPolyfills()

const App = () => {
  // Keep the splash screen visible while we fetch resources
  SplashScreen.preventAutoHideAsync()

  async function onFetchUpdateAsync() {
    try {
      const update = await Updates.checkForUpdateAsync()

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync()
        await Updates.reloadAsync()
      }
    } catch (error) {
      // alert(`Error fetching latest Expo update: ${error}`)
    }
  }

  useEffect(() => {
    onFetchUpdateAsync()
  }, [])

  return (
    <QueryClientProvider>
      <NavigationContainer>
        <AppContextProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <CustomStatusBar />
            <AppStack />
          </GestureHandlerRootView>
        </AppContextProvider>
      </NavigationContainer>
    </QueryClientProvider>
  )
}

export default App
