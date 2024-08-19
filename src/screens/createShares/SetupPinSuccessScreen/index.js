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

import { useAppContext } from 'contexts/AppContext'

import i18n from 'translations/config'

const { t } = i18n

const SetupPinSuccessScreen = () => {
  const { navigateAndLog, isRecoveringWallet } = useAppContext()

  const navigation = useNavigation()

  useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        e.preventDefault()
      }),
    [navigation]
  )

  const goToRecoverySetupScreen = () =>
    isRecoveringWallet
      ? navigateAndLog('CongratsScreen', 'nav_to_congrats_screen')
      : navigateAndLog('RecoveryIntroScreen', 'nav_to_recovery_intro_screen')

  return (
    <ScreenContainer>
      <Column $justify='space-between' $height='100%'>
        <CredeLogo />
        <Column>
          <SuccessIcon />
          <ScreenTitle>{t('Pin Set!')}</ScreenTitle>
        </Column>
        <Button primary onPress={goToRecoverySetupScreen}>
          {t('Continue')}
        </Button>
      </Column>
    </ScreenContainer>
  )
}

export default SetupPinSuccessScreen
