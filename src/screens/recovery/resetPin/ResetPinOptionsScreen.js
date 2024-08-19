import PropTypes from 'prop-types'
import * as React from 'react'
import { TouchableOpacity, View } from 'react-native'

import { useGetRecoveryShareInfo } from 'api'

import {
  BackIcon,
  Column,
  CredeLogo,
  H2,
  H3,
  PinIcon,
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

const ResetPinOptionsScreen = () => {
  const { navigateAndLog, firebaseId } = useAppContext()
  const {
    setRecoveryOption,
    setIsResetPinFlow,
    setSecurityQuestionsObj,
    setPdfKitObj,
    setNerdShareObj,
  } = useRecoveryContext()
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
  }, [securityQuestionsObj, recoveryKitObj])

  const handleGoBack = () => navigateAndLog('HomeScreen', 'nav_to_home_from_reset_pin')

  return (
    <ScreenContainer padding='19px'>
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
          <H2>{t('Reset your pin')}</H2>
          <PrimaryText>
            {t(
              'If you forgot your pin or you just want to change it here are your options.'
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
                <RecoveryMethodOption
                  title={t('Current Pin')}
                  subTitle={t('Enter your current pin to reset it')}
                  icon={<PinIcon />}
                  onPressFn={() => {
                    setIsResetPinFlow(true)
                    // setRecoveryOption('seedPhrase')
                    navigateAndLog('EnterCurrentPinScreen', 'nav_to_enter_pin_screen')
                  }}
                />
                {securityQuestionsObj && (
                  <RecoveryMethodOption
                    title={t('Security Questions')}
                    subTitle={t('Answer your security questions')}
                    icon={<SecurityQuestionsIcon />}
                    onPressFn={() => {
                      setIsResetPinFlow(true)
                      setRecoveryOption('securityQuestions')
                      navigateAndLog(
                        'SecurityQuestionsAnswersScreen',
                        'nav_to_recovery_security_questions'
                      )
                    }}
                  />
                )}
                {recoveryKitObj && (
                  <RecoveryMethodOption
                    title={t('Recovery PDF')}
                    subTitle={t('Upload your saved recovery PDF')}
                    icon={<RecoveryPDFIcon />}
                    onPressFn={() => {
                      setIsResetPinFlow(true)
                      setRecoveryOption('pdfKit')
                      navigateAndLog(
                        'RecoveryByPdfScreen',
                        'nav_to_recover_by_pdf_screen'
                      )
                    }}
                  />
                )}
                <RecoveryMethodOption
                  title={t('Seed Phrase')}
                  subTitle={t('Enter an exported seed phrase')}
                  icon={<RecoverySeedPhraseIcon />}
                  onPressFn={async () => {
                    setIsResetPinFlow(true)
                    setRecoveryOption('seedPhrase')
                    navigateAndLog(
                      'RecoverBySeedPhraseScreen',
                      'nav_to_recover_by_seed_screen'
                    )
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

export default ResetPinOptionsScreen
