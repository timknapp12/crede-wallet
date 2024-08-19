import { useFocusEffect } from '@react-navigation/native'
import PropTypes from 'prop-types'
import * as React from 'react'
import { BackHandler, TouchableOpacity, View } from 'react-native'

import { useGetSecurityQuestions } from 'api'

import {
  BackIcon,
  CheckmarkIcon,
  Column,
  CredeLogo,
  H2,
  PrimaryText,
  PrimaryTextSmall,
  ScreenContainer,
  ScrollView,
  SkeletonLoader,
} from 'components'

import { useAppContext } from 'contexts/AppContext'
import { useCreateSharesContext } from 'contexts/CreateSharesContext'

import i18n from 'translations/config'

const { t } = i18n

const RecoverySecurityQuestionsScreen = () => {
  const { navigateAndLog } = useAppContext()
  const { selectedSecurityQuestions } = useCreateSharesContext()
  const securityQuestionsQuery = useGetSecurityQuestions()
  const securityQuestions = securityQuestionsQuery?.data?.securityQuestions

  const step = selectedSecurityQuestions?.length + 1

  // if user clicks back on android phone with button handle questions in state
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (selectedSecurityQuestions?.length > 0) {
          navigateAndLog('SecurityQuestionInput', 'nav_back_to_security_question_input')
          return true
        } else {
          return false
        }
      }

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress)

      return () => subscription.remove()
    }, [selectedSecurityQuestions])
  )

  const handleGoBack = () => {
    if (selectedSecurityQuestions?.length > 0) {
      navigateAndLog('SecurityQuestionInput', 'nav_back_to_security_question_input')
    } else {
      navigateAndLog('ChooseRecoveryMethodScreen', 'nav_back_to_choose_recovery_method')
    }
  }

  // make a list with the selected security questions at the bottom of the list
  let idsInSecondList = new Set(
    selectedSecurityQuestions.map(item => item.securityQuestionId)
  )
  const sortedSecurityQuestions = [
    ...(securityQuestions?.filter(
      question => !idsInSecondList?.has(question.securityQuestionId)
    ) || []),
    ...selectedSecurityQuestions,
  ]

  return (
    <ScreenContainer>
      <Column $justify='space-between' $height='100%'>
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
        <Column $align='flex-start' $justify='flex-start' style={{ flex: 1, rowGap: 16 }}>
          <H2>{`${t('Security Question')} ${step}/3`}</H2>
          <PrimaryText>{t('Choose a security question to answer')}</PrimaryText>
          <ScrollView>
            <Column $gap='16px' $align='flex-start' style={{ paddingTop: 16 }}>
              {securityQuestionsQuery?.isLoading
                ? [1, 2, 3, 4, 5].map(item => (
                    <SkeletonLoader isLoading width='100%' height={50} key={item} />
                  ))
                : sortedSecurityQuestions?.map(question => (
                    <QuestionContainer
                      question={question}
                      key={question?.securityQuestionId}
                      questionIndex={selectedSecurityQuestions
                        ?.map(q => q.securityQuestionId)
                        ?.indexOf(question?.securityQuestionId)}
                    />
                  ))}
            </Column>
          </ScrollView>
        </Column>
      </Column>
    </ScreenContainer>
  )
}

function QuestionContainer({ questionIndex, question }) {
  const { theme, navigateAndLog } = useAppContext()
  const { addSecurityQuestion } = useCreateSharesContext()

  const hasBeenSelected = questionIndex >= 0

  const onPressQuestion = () => {
    addSecurityQuestion(question)
    navigateAndLog('SecurityQuestionInput', 'select_security_question')
  }

  return (
    <TouchableOpacity
      style={{
        backgroundColor: hasBeenSelected
          ? theme.backgroundHighlightDisabled
          : theme.backgroundDefault,
        borderRadius: 12,
        padding: 16,
        width: '100%',
      }}
      onPress={hasBeenSelected ? () => {} : onPressQuestion}
    >
      {hasBeenSelected && (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            color: theme.successStrong,
          }}
        >
          <CheckmarkIcon color={theme.successStrong} />
          <PrimaryTextSmall style={{ color: theme.successStrong }}>{`${t(
            'Security Question'
          )} ${questionIndex + 1}`}</PrimaryTextSmall>
        </View>
      )}
      <PrimaryText>{question?.questionText}</PrimaryText>
    </TouchableOpacity>
  )
}

QuestionContainer.propTypes = {
  question: PropTypes.object.isRequired,
  questionIndex: PropTypes.number.isRequired,
}

export default RecoverySecurityQuestionsScreen
