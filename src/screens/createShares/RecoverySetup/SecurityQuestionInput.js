import { useFocusEffect } from '@react-navigation/native'
import * as React from 'react'
import {
  BackHandler,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

import {
  BackIcon,
  Button,
  Column,
  CredeLogo,
  H2,
  KeyboardViewContainer,
  PrimaryText,
} from 'components'

import { useAppContext } from 'contexts/AppContext'
import { useCreateSharesContext } from 'contexts/CreateSharesContext'

import i18n from 'translations/config'

const { t } = i18n

// TODO get security questions from backend when endpoint is ready

const SecurityQuestionInputScreen = () => {
  const { navigateAndLog, theme } = useAppContext()
  const {
    selectedSecurityQuestions,
    removeLastSecurityQuestionAndAnswer,
    addSecurityAnswer,
  } = useCreateSharesContext()

  const [questionResponse, setQuestionResponse] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const step = selectedSecurityQuestions?.length
  // current question will always be the last in the list of questions
  const currentQuestion = selectedSecurityQuestions[selectedSecurityQuestions.length - 1]

  // if user clicks back on android phone with button handle questions in state
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        removeLastSecurityQuestionAndAnswer()
        return false
      }

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress)

      return () => subscription.remove()
    }, [])
  )

  const handleGoBack = () => {
    removeLastSecurityQuestionAndAnswer()
    navigateAndLog('RecoverySecurityQuestions', 'nav_back_to_recovery_security_questions')
  }

  const handleContinue = async () => {
    setIsLoading(true)
    addSecurityAnswer(questionResponse)
    if (selectedSecurityQuestions?.length >= 3) {
      setIsLoading(false)
      navigateAndLog('RecoveryQuestionsReviewScreen', 'nav_to_recovery_review_screen')
    } else {
      setIsLoading(false)
      navigateAndLog(
        'RecoverySecurityQuestions',
        'nav_back_to_recovery_security_questions'
      )
    }
  }

  return (
    <KeyboardViewContainer>
      <View style={{ flex: 1 }}>
        <View style={styles.inner}>
          <View
            style={{
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
            style={{ flex: 1, rowGap: 14, paddingTop: 16 }}
          >
            <H2>{`${t('Security Question')} ${step}/3`}</H2>
            <PrimaryText>{t('Choose a security question to answer')}</PrimaryText>
            <Column style={{ paddingTop: 32 }}>
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
              <View
                style={{
                  ...styles.inputView,
                  borderColor: theme.borderDefault,
                  backgroundColor: theme.backgroundDefault,
                }}
              >
                <TextInput
                  value={questionResponse}
                  onChangeText={responseValue => {
                    setQuestionResponse(responseValue)
                  }}
                  returnKeyType='default'
                  autoFocus
                  style={{
                    color: theme.textDefault,
                    width: '100%',
                  }}
                  multiline
                  numberOfLines={Platform.OS === 'ios' ? null : 2}
                  minHeight={Platform.OS === 'ios' ? 40 : null}
                  textAlignVertical='top'
                />
              </View>
            </Column>
          </Column>
        </View>
        <View
          style={{
            width: '100%',
            padding: 24,
            paddingTop: 16,
            backgroundColor: theme.backgroundDefault,
          }}
        >
          <Button
            primary
            disabled={!questionResponse}
            onPress={handleContinue}
            isLoading={isLoading}
          >
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
})

export default SecurityQuestionInputScreen
