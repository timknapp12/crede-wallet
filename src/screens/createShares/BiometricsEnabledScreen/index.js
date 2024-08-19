import { TouchableOpacity } from 'react-native'

import {
  BackIcon,
  Button,
  Column,
  CredeLogo,
  H2,
  Row,
  ScreenContainer,
  SuccessIcon,
} from 'components'

import { useAppContext } from 'contexts/AppContext'

import i18n from 'translations/config'

const { t } = i18n

const BiometricsEnabledScreen = () => {
  const { navigateAndLog } = useAppContext()

  const handleGoBack = () => {
    navigateAndLog('BiometricScreen', 'nav_back_to_biometricss_screen')
  }

  const goToCreateOrImportScreen = () =>
    navigateAndLog('CreateOrImportScreen', 'nav_to_create_or_import_screen')

  return (
    <ScreenContainer>
      <Column $justify='space-between' $height='100%'>
        <Row $justify='space-between'>
          <TouchableOpacity onPress={handleGoBack}>
            <BackIcon />
          </TouchableOpacity>
          <CredeLogo />
          <BackIcon color='transparent' />
        </Row>
        <Column>
          <SuccessIcon />
          <H2 style={{ textAlign: 'center' }}>{t('Biometric Security Enabled')}</H2>
        </Column>
        <Button primary onPress={goToCreateOrImportScreen}>
          {t('Continue')}
        </Button>
      </Column>
    </ScreenContainer>
  )
}

export default BiometricsEnabledScreen
