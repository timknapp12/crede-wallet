import * as React from 'react'
import { TouchableOpacity, View } from 'react-native'

import { useCreateRecoveryShares, useEmailWalletCreation } from 'api'

import {
  BackIcon,
  Button,
  Column,
  CredeLogo,
  H5Error,
  Input,
  PrimaryText,
  ScreenContainer,
} from 'components'

import { useAppContext } from 'contexts/AppContext'
import { useCreateSharesContext } from 'contexts/CreateSharesContext'

import i18n from 'translations/config'

import { xorStrings } from 'utils/api/wallet/cryptography'
import { encryptShare } from 'utils/api/wallet/encryption'

const { t } = i18n

const RecoveryQuestionsReviewScreen = () => {
  const { navigateAndLog, theme, firebaseId, ethPublicKey } = useAppContext()
  const {
    securityAnswers,
    removeAllSecurityAnswers,
    tempStoredShares,
    setTempStoredShares,
    selectedSecurityQuestions,
  } = useCreateSharesContext()
  const { mutateAsync: createRecoveryShares } = useCreateRecoveryShares(firebaseId)
  const { mutateAsync: sendEmailWalletCreation } = useEmailWalletCreation()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isError, setIsError] = React.useState(false)

  const onSubmit = async () => {
    setIsLoading(true)
    try {
      // xor strings as the encryption key
      const xorResult = xorStrings(
        securityAnswers?.[0],
        securityAnswers?.[1],
        securityAnswers?.[2]
      )
      const questionIdsArray = selectedSecurityQuestions?.map(
        question => question?.securityQuestionId
      )

      // TODO if !tempStoredShares?.length, team is deciding if we will prompt user to enter pin instead of storing the shares temporarily

      // encrypt second share
      const secondRawStringifiedShare = JSON.stringify(tempStoredShares?.[1])
      const secondEncryptor = xorResult
      const secondEncryptedShare = await encryptShare(
        secondRawStringifiedShare,
        secondEncryptor
      )

      await createRecoveryShares({
        externalId: firebaseId,
        securityQuestionsShare: secondEncryptedShare,
        securityQuestionIds: questionIdsArray,
        nerdShare: JSON.stringify(tempStoredShares?.[2]),
      })

      // remove the temporarily stored shares from context
      setTempStoredShares([])
      removeAllSecurityAnswers()
      setIsLoading(false)
      try {
        await sendEmailWalletCreation({ publicAddress: ethPublicKey })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to send email:', error)
      }
      navigateAndLog('RecoverySuccessScreen', 'recovery_questions_success')
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('ERROR in setting up recovery shares: ', e)
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoBack = () => {
    navigateAndLog('SecurityQuestionInput', 'nav_back_to_answers_input_screen')
  }

  return (
    <ScreenContainer
      padding='19px'
      footerChildren={
        <Column>
          {isError && (
            <H5Error>{t('Sorry! An error occured. Please try again.')}</H5Error>
          )}
          <Button primary onPress={onSubmit} isLoading={isLoading}>
            {t('Submit Answers')}
          </Button>
        </Column>
      }
    >
      <View
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity onPress={isLoading ? () => {} : handleGoBack}>
          <BackIcon />
        </TouchableOpacity>
        <CredeLogo />
        {/* add invisible icon same width as back icon to make logo sit in center */}
        <BackIcon color='transparent' />
      </View>
      {selectedSecurityQuestions?.map((questionObj, index) => (
        <Column
          $gap='16px'
          $align='flex-start'
          style={{ paddingTop: 16 }}
          key={questionObj.securityQuestionId}
        >
          <PrimaryText>{`Security Question ${index + 1}`}</PrimaryText>
          <View
            style={{
              backgroundColor: theme.backgroundDefault,
              borderRadius: 12,
              padding: 16,
              width: '100%',
            }}
          >
            <PrimaryText>{questionObj.questionText}</PrimaryText>
          </View>
          <Input value={securityAnswers?.[index]} autoCapitalize='none' readOnly />
          {index < 2 && (
            <View
              style={{
                width: '100%',
                borderBottomColor: theme.borderDefault,
                borderBottomWidth: 1,
                marginTop: 16,
                marginBottom: 16,
              }}
            />
          )}
        </Column>
      ))}
    </ScreenContainer>
  )
}

export default RecoveryQuestionsReviewScreen
