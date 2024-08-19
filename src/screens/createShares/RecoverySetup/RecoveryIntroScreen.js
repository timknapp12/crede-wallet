import { useEmailWalletCreationNoRecovery } from 'api'

import { Button, Column, CredeLogo, H2, PrimaryText, ScreenContainer } from 'components'

import { useAppContext } from 'contexts/AppContext'
import { useCreateSharesContext } from 'contexts/CreateSharesContext'

import i18n from 'translations/config'

const { t } = i18n

const RecoveryIntroScreen = () => {
  const { navigateAndLog } = useAppContext()
  const { removeAllSecurityAnswers, setSelectedSecurityQuestions } =
    useCreateSharesContext()
  const { mutateAsync: sendEmailWalletCreationNoRecovery } =
    useEmailWalletCreationNoRecovery()

  const goToChooseRecoveryMethodScreen = () => {
    // in case user quit the app mid way through questions previously and is coming back, clear out questions and answers
    removeAllSecurityAnswers()
    setSelectedSecurityQuestions([])
    navigateAndLog('ChooseRecoveryMethodScreen', 'select_to_setup_recovery')
  }

  const goToSignUpCompleteScreen = async () => {
    try {
      await sendEmailWalletCreationNoRecovery()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to send email:', error)
    }
    // remove temporarily stored shares in context. when they set up security questions later, they will have to enter their pin
    // in case user quit the app mid way through questions previously and is coming back, clear out questions and answers
    removeAllSecurityAnswers()
    setSelectedSecurityQuestions([])
    navigateAndLog('CongratsScreen', 'skip_recovery_setup')
  }

  return (
    <ScreenContainer
      footerChildren={
        <Column>
          <Button onPress={goToSignUpCompleteScreen}>{t('Skip For Now')}</Button>
          <Button primary onPress={goToChooseRecoveryMethodScreen}>
            {t('Set Up Recovery')}
          </Button>
        </Column>
      }
      transparentFooterBackground
    >
      <Column $justify='space-between' $height='100%'>
        <CredeLogo />
        <Column $align='flex-start' $justify='flex-start' style={{ flex: 1, rowGap: 16 }}>
          <H2>{t('Wallet Recovery')}</H2>
          <PrimaryText>
            {t(
              'To keep your wallet safe we highly recommend setting up wallet recovery now.'
            )}
          </PrimaryText>
          <PrimaryText>
            {t(
              'If you lose your device and do not have wallet recovery set up you will lose access to your wallet.'
            )}
          </PrimaryText>
        </Column>
      </Column>
    </ScreenContainer>
  )
}

export default RecoveryIntroScreen
