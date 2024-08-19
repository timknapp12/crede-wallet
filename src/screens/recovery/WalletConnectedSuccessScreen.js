import { useNavigation } from '@react-navigation/native'
import { useEffect } from 'react'
import { View } from 'react-native'

import {
  Button,
  Column,
  CredeLogo,
  H2,
  PrimaryText,
  ScreenContainer,
  SuccessIcon,
} from 'components'

import { useAppContext } from 'contexts/AppContext'
import { useRecoveryContext } from 'contexts/RecoveryContext'

import i18n from 'translations/config'

const { t } = i18n

const WalletConnectedSuccessScreen = () => {
  const { navigateToNewStackAndLog, navigateAndLog } = useAppContext()
  const { isResetPinFlow } = useRecoveryContext()

  const navigation = useNavigation()

  useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        e.preventDefault()
      }),
    [navigation]
  )

  const goToSetupPinScreen = () => {
    isResetPinFlow
      ? navigateAndLog('HomeScreen', 'nav_to_home_after_wallet_cnct_success')
      : navigateToNewStackAndLog(
          'CreateSharesStack',
          'SetUpPinScreen',
          'nav_to_setup_pin'
        )
  }

  return (
    <ScreenContainer
      footerChildren={
        <Button primary onPress={goToSetupPinScreen}>
          {isResetPinFlow ? t('Done') : t('Continue')}
        </Button>
      }
    >
      <Column $justify='space-between' $height='100%'>
        <CredeLogo />
        <Column>
          <SuccessIcon />
          <H2>{isResetPinFlow ? t('New Pin Set!') : t('Wallet Connected')}</H2>
          {!isResetPinFlow && (
            <PrimaryText style={{ textAlign: 'center' }}>
              {t('You can finish setting up your wallet on this device.')}
            </PrimaryText>
          )}
        </Column>
        <View></View>
      </Column>
    </ScreenContainer>
  )
}

export default WalletConnectedSuccessScreen
