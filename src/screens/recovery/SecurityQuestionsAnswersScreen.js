import { useFocusEffect } from '@react-navigation/native'
import * as React from 'react'
import { BackHandler, StyleSheet, TouchableOpacity, View } from 'react-native'

import {
  BackIcon,
  Button,
  Column,
  CredeLogo,
  H2,
  H5,
  Input,
  KeyboardViewContainer,
  PrimaryText,
} from 'components'

import { useAppContext } from 'contexts/AppContext'
import { useRecoveryContext } from 'contexts/RecoveryContext'

import i18n from 'translations/config'

const { t } = i18n

const SecurityQuestionsAnswersScreen = () => {
  const { navigateAndLog, theme } = useAppContext()
  const {
    securityQuestionsObj,
    step,
    setStep,
    securityAnswers,
    setSecurityAnswer,
    isResetPinFlow,
  } = useRecoveryContext()
  const securityQuestions = securityQuestionsObj?.shareInfo

  const currentQuestion = securityQuestions?.[step - 1]
  const currentAnswer = securityAnswers?.[step - 1]

  // if user clicks back on android phone with button handle questions in state
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (step > 1) {
          setStep(step - 1)
          return true
        } else {
          return false
        }
      }

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress)

      return () => subscription.remove()
    }, [securityAnswers])
  )

  const handleGoBack = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      isResetPinFlow
        ? navigateAndLog('ResetPinOptionsScreen', 'nav_back_to_reset_pin_options')
        : navigateAndLog(
            'SelectRecoveryOptionScreen',
            'nav_back_to_select_recovery_option'
          )
    }
  }

  const handleContinue = () => {
    if (step >= 3) {
      navigateAndLog('SecurityAnswersReviewScreen', 'nav_to_answers_review_screen')
    } else {
      setStep(step + 1)
    }
  }

  return (
    <KeyboardViewContainer>
      <View style={{ flex: 1 }}>
        <View style={styles.inner}>
          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <TouchableOpacity onPress={handleGoBack}>
              <BackIcon />
            </TouchableOpacity>
            <CredeLogo />
            {/* add invisible icon same width as back icon to make logo sit in center */}
            <BackIcon color='transparent' />
          </View>
          <Column
            $align='flex-start'
            $justify='flex-start'
            style={{ flex: 1, rowGap: 16 }}
          >
            <H2>{`${t('Security Question')} ${step}/3`}</H2>
            <Column $gap='16px' $align='flex-start' style={{ paddingTop: 16 }}>
              <View
                style={{
                  backgroundColor: theme.backgroundDefault,
                  borderRadius: 12,
                  padding: 16,
                  width: '100%',
                }}
              >
                <PrimaryText>{currentQuestion?.questionText}</PrimaryText>
              </View>
              <Column $gap='4px' $align='flex-start'>
                <Input
                  value={currentAnswer}
                  onChangeText={text => {
                    setSecurityAnswer(text, step - 1)
                  }}
                  autoCapitalize='none'
                  autoFocus={true}
                />
                <H5>{t('Answers are not case sensitive')}</H5>
              </Column>
            </Column>
          </Column>
        </View>
        <View
          style={{
            ...styles.buttonContainer,
            backgroundColor: theme.backgroundDefault,
          }}
        >
          <Button primary disabled={!currentAnswer} onPress={handleContinue}>
            {t('Continue')}
          </Button>
        </View>
      </View>
    </KeyboardViewContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputView: {
    borderWidth: 1,
    borderRadius: 8,
    width: '100%',
    padding: 12,
  },
  inner: {
    padding: 24,
    paddingTop: 48,
    flex: 1,
  },
  buttonContainer: {
    width: '100%',
    padding: 24,
    paddingTop: 16,
  },
})

export default SecurityQuestionsAnswersScreen
