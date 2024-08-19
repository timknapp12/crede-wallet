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

const AccountCreatedScreen = () => {
  const { navigateAndLog, isRecoveringWallet } = useAppContext()

  const goToCreateSharesStack = () =>
    navigateAndLog('CreateSharesStack', 'nav_to_setup_pin_screen')

  return (
    <ScreenContainer>
      <Column $justify='space-between' $height='100%'>
        <CredeLogo />
        <Column>
          <SuccessIcon />
          <ScreenTitle>
            {isRecoveringWallet ? t('Account Recovered!') : t('Account Created!')}
          </ScreenTitle>
        </Column>
        <Button primary onPress={goToCreateSharesStack}>
          {t('Continue')}
        </Button>
      </Column>
    </ScreenContainer>
  )
}

export default AccountCreatedScreen
