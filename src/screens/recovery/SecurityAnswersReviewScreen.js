import * as React from 'react'
import { TouchableOpacity, View } from 'react-native'

import { useEmailWalletRecovery, useGetWallet } from 'api'

import {
  BackIcon,
  Button,
  Column,
  CredeLogo,
  Input,
  PrimaryText,
  ScreenContainer,
} from 'components'

import { useAppContext } from 'contexts/AppContext'
import { useRecoveryContext } from 'contexts/RecoveryContext'

import i18n from 'translations/config'

import {
  getEthKeys,
  getRawSharesFromExistingMnemonic,
  reconstructMnemonic,
  xorStrings,
} from 'utils/api/wallet/cryptography'
import { decryptShare } from 'utils/api/wallet/encryption'
import {
  getIsRecoveryBlocked,
  incrementFailedRecoverAttempts,
  resetFailedRecoveryAttempts,
  storeEthPublicKey,
} from 'utils/asyncStorage'

const { t } = i18n

const SecurityAnswersReviewScreen = () => {
  const {
    navigateAndLog,
    setEthPublicKey,
    setMnemonic,
    theme,
    setEthPrivateKey,
    firebaseId,
    setIsRecoveringWallet,
  } = useAppContext()
  const {
    securityQuestionsObj,
    securityAnswers,
    nerdShareObj,
    setRecoveryFailedMessage,
    isResetPinFlow,
    setTempStoredShares,
  } = useRecoveryContext()
  const { mutateAsync: getWallet } = useGetWallet()
  const { mutateAsync: sendEmailWalletRecovery } = useEmailWalletRecovery()
  const [isLoading, setIsLoading] = React.useState(false)

  const onSubmit = async () => {
    setIsLoading(true)
    const { isBlocked, errorMessage } = await getIsRecoveryBlocked(firebaseId)
    if (!isBlocked) {
      try {
        setRecoveryFailedMessage('')

        const xorResult = xorStrings(
          securityAnswers?.[0],
          securityAnswers?.[1],
          securityAnswers?.[2]
        )
        const encryptedShare = securityQuestionsObj?.share
        const decryptedValue = await decryptShare(encryptedShare, xorResult)

        if (decryptedValue === '') {
          // security questions were wrong
          const failedAttemptMessage = await incrementFailedRecoverAttempts(firebaseId)
          setRecoveryFailedMessage(failedAttemptMessage)
          navigateAndLog('WalletConnectedFailedScreen', 'recovery_by_questions_failed')
        }

        const parsedNerdShare = JSON.parse(nerdShareObj?.share)
        const parsedDecryptedShare = JSON.parse(decryptedValue)

        const rawNerdShare = Object.values(parsedNerdShare)
        const rawDecryptedShare = Object.values(parsedDecryptedShare)

        const { mnemonic } = await reconstructMnemonic([rawNerdShare, rawDecryptedShare])
        if (!isResetPinFlow) {
          const { ethPrivateKey, ethPublicKey } = getEthKeys(mnemonic)
          const wallet = await getWallet()

          if (ethPublicKey === wallet?.addresses?.EVM) {
            storeEthPublicKey(ethPublicKey, firebaseId, setEthPublicKey)
            setEthPrivateKey(ethPrivateKey)
            setMnemonic(mnemonic)
            setIsRecoveringWallet(true)

            await resetFailedRecoveryAttempts(firebaseId)
            try {
              await sendEmailWalletRecovery()
            } catch (error) {
              // eslint-disable-next-line no-console
              console.error('Failed to send email:', error)
            }
            navigateAndLog(
              'WalletConnectedSuccessScreen',
              'recovery_by_questions_success'
            )
          }
        } else {
          const rawShares = await getRawSharesFromExistingMnemonic(mnemonic)
          setTempStoredShares(rawShares)

          await resetFailedRecoveryAttempts(firebaseId)
          navigateAndLog('EnterNewPinScreen', 'nav_to_enter_new_pin_screen')
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    } else {
      setRecoveryFailedMessage(errorMessage)
      navigateAndLog('WalletConnectedFailedScreen', 'recovery_by_questions_failed')
    }
  }

  const handleGoBack = () => {
    navigateAndLog('SecurityQuestionsAnswersScreen', 'nav_back_to_answers_input_screen')
  }

  return (
    <ScreenContainer
      padding='19px'
      footerChildren={
        <Button primary onPress={onSubmit} isLoading={isLoading}>
          {t('Submit Answers')}
        </Button>
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
      {securityQuestionsObj?.shareInfo?.map((question, index) => (
        <Column
          $gap='16px'
          $align='flex-start'
          style={{ paddingTop: 16 }}
          key={question?.questionText}
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
            <PrimaryText>{question?.questionText}</PrimaryText>
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

export default SecurityAnswersReviewScreen
