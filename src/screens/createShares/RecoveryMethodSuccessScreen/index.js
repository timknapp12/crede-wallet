import { useNavigation } from '@react-navigation/native'
import { useEffect } from 'react'

import {
  Button,
  Column,
  CredeLogo,
  ScreenContainer,
  ScreenTitle,
  SuccessIcon,
} from 'components'

// hooks
import { useAppContext } from 'contexts/AppContext'

import i18n from 'translations/config'

const { t } = i18n

const RecoveryMethodSuccessScreen = () => {
  const { navigateAndLog } = useAppContext()

  const navigation = useNavigation()

  useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        e.preventDefault()
      }),
    [navigation]
  )

  const goToCongratsScreen = () =>
    navigateAndLog('CongratsScreen', 'nav_to_congrats_screen')

  return (
    <ScreenContainer>
      <Column $justify='space-between' $height='100%'>
        <CredeLogo />
        <Column>
          <SuccessIcon />
          <ScreenTitle>{t('Recovery method set!')}</ScreenTitle>
        </Column>
        <Button primary onPress={goToCongratsScreen}>
          {t('Continue')}
        </Button>
      </Column>
    </ScreenContainer>
  )
}

export default RecoveryMethodSuccessScreen
