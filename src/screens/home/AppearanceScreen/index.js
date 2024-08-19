import { StyleSheet, TouchableOpacity, View } from 'react-native'

import {
  CheckmarkLargeIcon,
  Column,
  DarkModeIcon,
  DeviceIcon,
  LightModeIcon,
  PrimaryText,
  ScreenContainer,
} from 'components'

import { useAppContext } from 'contexts/AppContext'

import i18n from 'translations/config'

const { t } = i18n

const AppearanceScreen = () => {
  const { theme, colorTheme, setAndSaveColorTheme } = useAppContext()

  const options = [
    {
      id: 'device',
      label: t('Match System'),
      icon: <DeviceIcon />,
    },
    {
      id: 'light',
      label: t('Light Mode'),
      icon: <LightModeIcon />,
    },
    {
      id: 'dark',
      label: t('Dark Mode'),
      icon: <DarkModeIcon />,
    },
  ]

  return (
    <ScreenContainer paddingTop='8px' paddingBottom='0px'>
      <Column $gap='8px'>
        {options?.map(option => (
          <TouchableOpacity
            key={option.id}
            style={styles.container}
            onPress={() => setAndSaveColorTheme(option.id)}
          >
            <View
              style={{
                ...styles.row,
                ...(colorTheme === option?.id && { backgroundColor: theme.selected }),
              }}
            >
              {colorTheme === option.id ? <CheckmarkLargeIcon /> : option.icon}
              <PrimaryText>{option?.label}</PrimaryText>
            </View>
          </TouchableOpacity>
        ))}
      </Column>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    padding: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 16,
  },
  container: {
    width: '100%',
  },
})

export default AppearanceScreen
