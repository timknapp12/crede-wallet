import { useNavigation } from '@react-navigation/native'
import { useEffect } from 'react'
import { View } from 'react-native'

import { Button, Column, CredeLogo, H2, ScreenContainer, SuccessIcon } from 'components'

import { useAppContext } from 'contexts/AppContext'

import i18n from 'translations/config'

const { t } = i18n

const RecoverySuccessScreen = () => {
  const { navigateAndLog } = useAppContext()

  const navigation = useNavigation()

  useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        e.preventDefault()
      }),
    [navigation]
  )

  const goToHomeScreen = () =>
    navigateAndLog('CongratsScreen', 'nav_to_home_from_recovery_success')

  return (
    <ScreenContainer
      footerChildren={
        <Button primary onPress={goToHomeScreen}>
          {t('Continue')}
        </Button>
      }
    >
      <Column $justify='space-between' $height='100%'>
        <CredeLogo />
        <Column>
          <SuccessIcon />
          <H2>{t('Recovery Method Set!')}</H2>
        </Column>
        <View></View>
      </Column>
    </ScreenContainer>
  )
}

export default RecoverySuccessScreen
