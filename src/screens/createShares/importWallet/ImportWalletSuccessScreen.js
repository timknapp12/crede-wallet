import { Button, Column, CredeLogo, H2, ScreenContainer, SuccessIcon } from 'components'

import { useAppContext } from 'contexts/AppContext'

import i18n from 'translations/config'

const { t } = i18n

const ImportWalletSuccessScreen = () => {
  const { navigateAndLog } = useAppContext()

  const goToNextScreen = () => {
    navigateAndLog('SetUpPinScreen', 'nav_to_set_up_pin_screen')
  }

  return (
    <ScreenContainer>
      <Column $justify='space-between' $height='100%'>
        <CredeLogo />
        <Column>
          <SuccessIcon />
          <H2>{t('Wallet Imported')}</H2>
        </Column>
        <Button primary onPress={goToNextScreen}>
          {t('Continue')}
        </Button>
      </Column>
    </ScreenContainer>
  )
}

export default ImportWalletSuccessScreen
