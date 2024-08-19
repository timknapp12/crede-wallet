import { StatusBar } from 'expo-status-bar'

import { useAppContext } from 'contexts/AppContext'

export function CustomStatusBar() {
  const { colorTheme } = useAppContext()

  return (
    <StatusBar
      style={colorTheme === 'device' ? 'auto' : colorTheme === 'light' ? 'dark' : 'light'}
    />
  )
}
