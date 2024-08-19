import PropTypes from 'prop-types'

import {
  Button,
  Column,
  CredeLogo,
  PrimaryText,
  ScreenContainer,
  ScreenTitle,
} from 'components'

import { useAppContext } from 'contexts/AppContext'
import { useCreateSharesContext } from 'contexts/CreateSharesContext'

import i18n from 'translations/config'

const { t } = i18n

const CongratsScreen = ({ navigation }) => {
  const { setIsBiometricModalOpen, isRecoveringWallet } = useAppContext()
  const { setTempStoredShares } = useCreateSharesContext()

  const goToHomeScreen = () => {
    setIsBiometricModalOpen(false)
    setTempStoredShares([])
    navigation.push('HomeStack')
  }

  const goToExportPrivateKey = () => {
    setIsBiometricModalOpen(false)
    setTempStoredShares([])
    navigation.push('HomeStack', {
      screen: 'EnterRecoveryShareScreen',
    })
  }

  return (
    <ScreenContainer>
      <Column $justify='space-between' $height='100%'>
        <Column>
          <Column>
            <CredeLogo />
          </Column>
          <Column $align='flex-start'>
            <ScreenTitle>{t('Congratulations!')}</ScreenTitle>
            <PrimaryText>
              {isRecoveringWallet
                ? t('You have recovered your non-custodial wallet.')
                : t(
                    `You've set up a non-custodial wallet you can easily recover with your recovery method.`
                  )}
            </PrimaryText>
            <PrimaryText>
              {t(
                `You can optionally export your seed phrase for safe keeping from your account settings.`
              )}
            </PrimaryText>
          </Column>
        </Column>
        <Column>
          <Button onPress={goToExportPrivateKey}>{t('Export Private Key')}</Button>
          <Button primary onPress={goToHomeScreen}>
            {t('Finish')}
          </Button>
        </Column>
      </Column>
    </ScreenContainer>
  )
}

CongratsScreen.propTypes = {
  navigation: PropTypes.object,
}
export default CongratsScreen
