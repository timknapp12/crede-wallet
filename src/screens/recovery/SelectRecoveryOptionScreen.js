import auth from '@react-native-firebase/auth'
import PropTypes from 'prop-types'
import * as React from 'react'
import { Linking, TouchableOpacity } from 'react-native'

import { useGetRecoveryShareInfo } from 'api'

import {
  Button,
  Column,
  CredeLogo,
  H2,
  H3,
  H6,
  PrimaryText,
  RecoveryPDFIcon,
  RecoverySeedPhraseIcon,
  ScreenContainer,
  SecurityQuestionsIcon,
  SkeletonLoader,
} from 'components'

import { useAppContext } from 'contexts/AppContext'
import { useRecoveryContext } from 'contexts/RecoveryContext'

import i18n from 'translations/config'

const { t } = i18n

const SelectRecoveryOptionScreen = () => {
  const {
    navigateAndLog,
    setToken,
    setMnemonic,
    firebaseId,
    logEvent,
    setIsRecoveringWallet,
  } = useAppContext()
  const { setSecurityQuestionsObj, setPdfKitObj, setNerdShareObj, setRecoveryOption } =
    useRecoveryContext()
  const recoveryOptionsQuery = useGetRecoveryShareInfo({ firebaseId })
  const recoveryOptionsArray = recoveryOptionsQuery?.data?.recoveryShares

  const securityQuestionsObj = recoveryOptionsArray?.find(
    obj => obj?.custodianType === 'securityQuestions'
  )

  const recoveryKitObj = recoveryOptionsArray?.find(
    obj => obj?.custodianType === 'pdfKit'
  )

  const nerdShareObj = recoveryOptionsArray?.find(obj => obj?.custodianType === 'nerd')

  React.useEffect(() => {
    if (securityQuestionsObj) setSecurityQuestionsObj(securityQuestionsObj)
    if (recoveryKitObj) setPdfKitObj(recoveryKitObj)
    if (nerdShareObj) setNerdShareObj(nerdShareObj)
  }, [securityQuestionsObj, recoveryKitObj, nerdShareObj])

  const signOut = async () => {
    await setToken('')
    await setMnemonic('')
    await setIsRecoveringWallet(false)
    try {
      await auth()
        .signOut()
        .then(() => navigateAndLog('WelcomeScreen', 'auth_sign_out_from_recovery_screen'))
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`${t('Error logging out')}: ${error?.message}`)
    }
  }

  const email = 'support@credewallet.com'
  const onEmail = () => {
    Linking.openURL(`mailto:${email}`)
    logEvent('open_link_to_email_customer_service')
  }

  return (
    <ScreenContainer
      padding='19px'
      footerChildren={
        <Column $gap='13px'>
          <Button onPress={signOut}>{t('Log Out')}</Button>
          <TouchableOpacity onPress={onEmail}>
            <H6>{`${t('Questions?')} support@crede-wallet.com`}</H6>
          </TouchableOpacity>
        </Column>
      }
      transparentFooterBackground
    >
      <Column $justify='space-between' $height='100%'>
        <CredeLogo />
        <Column $align='flex-start' $justify='flex-start' style={{ flex: 1, rowGap: 16 }}>
          <H2>{t('Connect Your Crede Wallet')}</H2>
          <PrimaryText>
            {t(
              'It looks like you are signing in on a new device. Select a method to connect a wallet.'
            )}
          </PrimaryText>
          <Column $justify='flex-start' $gap='0px' style={{ paddingTop: 16 }}>
            {recoveryOptionsQuery?.isLoading ? (
              <Column $justify='flex-start' $gap='16px'>
                <SkeletonLoader isLoading width='100%' height={50} />
                <SkeletonLoader isLoading width='100%' height={50} />
                <SkeletonLoader isLoading width='100%' height={50} />
              </Column>
            ) : (
              <>
                {securityQuestionsObj && (
                  <RecoveryMethodOption
                    title={t('Security Questions')}
                    subTitle={t('Answer preset questions')}
                    icon={<SecurityQuestionsIcon />}
                    onPressFn={() => {
                      setRecoveryOption('securityQuestions')
                      navigateAndLog(
                        'SecurityQuestionsAnswersScreen',
                        'recover_security_questions'
                      )
                    }}
                  />
                )}
                {recoveryKitObj && (
                  <RecoveryMethodOption
                    title={t('Recovery PDF')}
                    subTitle={t('Enter a key from a saved recovery PDF')}
                    icon={<RecoveryPDFIcon />}
                    onPressFn={() => {
                      setRecoveryOption('pdfKit')
                      navigateAndLog('RecoveryByPdfScreen', 'recover_by_pdf')
                    }}
                  />
                )}
                <RecoveryMethodOption
                  title={t('Seed Phrase')}
                  subTitle={t('Enter an exported seed phrase')}
                  icon={<RecoverySeedPhraseIcon />}
                  onPressFn={() => {
                    setRecoveryOption('seedPhrase')
                    navigateAndLog('RecoverBySeedPhraseScreen', 'recover_by_seed')
                  }}
                />
              </>
            )}
          </Column>
        </Column>
      </Column>
    </ScreenContainer>
  )
}

function RecoveryMethodOption({ icon, title, subTitle, onPressFn }) {
  return (
    <TouchableOpacity
      style={{
        columnGap: 16,
        padding: 16,
        paddingLeft: 0,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
      onPress={onPressFn}
    >
      {icon}
      <Column $align='flex-start' style={{ rowGap: 0 }}>
        <H3>{title}</H3>
        <PrimaryText>{subTitle}</PrimaryText>
      </Column>
    </TouchableOpacity>
  )
}

RecoveryMethodOption.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired,
  onPressFn: PropTypes.func.isRequired,
}

export default SelectRecoveryOptionScreen
