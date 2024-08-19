import { useNavigation } from '@react-navigation/native'
import PropTypes from 'prop-types'
import { StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native'

import {
  BackIcon,
  Button,
  Column,
  CredeLogo,
  ImportWalletIcon,
  Row,
  ScreenContainer,
  ScreenTitle,
} from 'components'

import { useAppContext } from 'contexts/AppContext'
import { useCreateSharesContext } from 'contexts/CreateSharesContext'

import i18n from 'translations/config'

const { t } = i18n

const CreateOrImportScreen = () => {
  const { setIsBiometricModalOpen, navigateAndLog } = useAppContext()
  const { setImportedMnemonic } = useCreateSharesContext()

  const navigation = useNavigation()

  const handleGoBack = () => navigation.goBack()

  const goToSetUpPinScreen = () => {
    setIsBiometricModalOpen(false)
    setImportedMnemonic('')
    navigateAndLog('SetUpPinScreen', 'nav_to_create_pin_screen')
  }

  const goToImportSeedPhraseScreen = () => {
    setIsBiometricModalOpen(false)
    navigateAndLog('ImportSeedPhraseScreen', 'nav_to_import_wallet_screen')
  }

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
        <Column $gap='32px'>
          <ScreenTitle style={styles.title}>{t('Keep Everything in Crede')}</ScreenTitle>
          <ImportWalletIcon style={{ width: 50 }} />
        </Column>
        <Column>
          <Button onPress={goToSetUpPinScreen}>{t('Create new wallet')}</Button>
          <Button primary onPress={goToImportSeedPhraseScreen}>
            {t('I already have a wallet')}
          </Button>
        </Column>
      </Column>
    </ScreenContainer>
  )
}

CreateOrImportScreen.propTypes = {
  navigation: PropTypes.object,
}
export default CreateOrImportScreen

const styles = StyleSheet.create({
  title: { textAlign: 'center', marginBottom: 16 },
})
