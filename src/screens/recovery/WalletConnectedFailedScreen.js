import { View } from 'react-native'

import {
  Button,
  Column,
  CredeLogo,
  FailureIcon,
  H2,
  PrimaryText,
  ScreenContainer,
  Toast,
} from 'components'

import { useAppContext } from 'contexts/AppContext'
import { useRecoveryContext } from 'contexts/RecoveryContext'

import i18n from 'translations/config'

const { t } = i18n

const WalletConnectedFailedScreen = () => {
  const { navigateAndLog } = useAppContext()
  const {
    setSecurityAnswers,
    setStep,
    recoveryOption,
    recoveryFailedMessage,
    isResetPinFlow,
  } = useRecoveryContext()

  const goToAnswersReviewScreen = () => {
    setStep(1)
    if (recoveryOption === 'securityQuestions') {
      navigateAndLog('SecurityQuestionsAnswersScreen', 'nav_to_answers_review_screen')
    } else if (recoveryOption === 'seedPhrase') {
      navigateAndLog('RecoverBySeedPhraseScreen', 'nav_to_recover_by_seed_screen')
    } else {
      navigateAndLog('RecoveryByPdfScreen', 'nav_to_recover_by_pdf_screen')
    }
  }

  const goToSignInScreen = () => {
    setSecurityAnswers([])
    navigateAndLog('SelectRecoveryOptionScreen', 'nav_to_select_recovery_screen')
  }

  const goToHomeScreen = () => {
    setSecurityAnswers([])
    navigateAndLog('HomeScreen', 'nav_to_home_screen')
  }

  return (
    <ScreenContainer
      footerChildren={
        <Column $gap='16px'>
          <Button onPress={isResetPinFlow ? goToHomeScreen : goToSignInScreen}>
            {t('Leave')}
          </Button>
          <Button primary onPress={goToAnswersReviewScreen}>
            {recoveryOption === 'securityQuestions'
              ? t('Change Answers')
              : recoveryOption === 'seedPhrase'
                ? t('Re-Enter Seed Phrase')
                : t('Re-Enter Recovery Key')}
          </Button>
        </Column>
      }
    >
      <Column $justify='space-between' $height='100%'>
        <CredeLogo />
        <Column>
          <FailureIcon />
          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <H2>
              {recoveryOption === 'securityQuestions'
                ? t('Incorrect Answers')
                : recoveryOption === 'seedPhrase'
                  ? t('Invalid Seed Phrase')
                  : t('Incorrect Recovery Key')}
            </H2>
          </View>
          <PrimaryText style={{ textAlign: 'center' }}>
            {recoveryOption === 'securityQuestions'
              ? t('The answers you entered are incorrect.')
              : recoveryOption === 'seedPhrase'
                ? t('The seed phrase you entered is invalid')
                : t('The recovery key you entered is incorrect.')}
          </PrimaryText>
          {recoveryOption !== 'seedPhrase' && (
            <Toast showToast variant='error'>
              {recoveryFailedMessage}
            </Toast>
          )}
        </Column>
        <View></View>
      </Column>
    </ScreenContainer>
  )
}

export default WalletConnectedFailedScreen
