import PropTypes from 'prop-types'
import { TouchableOpacity } from 'react-native'

import {
  Column,
  CredeLogo,
  H2,
  H3,
  PrimaryText,
  RecoveryKeyIcon,
  ScreenContainer,
  SecurityQuestionsIcon,
} from 'components'

import { useAppContext } from 'contexts/AppContext'

import i18n from 'translations/config'

const { t } = i18n

const ChooseRecoveryMethodScreen = () => {
  const { navigateAndLog } = useAppContext()

  return (
    <ScreenContainer padding='19px'>
      <Column $justify='space-between' $height='100%'>
        <CredeLogo />
        <Column $align='flex-start' $justify='flex-start' style={{ flex: 1, rowGap: 16 }}>
          <H2>{t('Choose a recovery method')}</H2>
          <PrimaryText>{t('You can chose a recovery method you prefer.')}</PrimaryText>
          <Column $justify='flex-start' $gap='16px' style={{ paddingTop: 16 }}>
            <RecoveryMethodOption
              title={t('Security Questions')}
              subTitle={t('Answer three security questions')}
              icon={<SecurityQuestionsIcon />}
              navigate={() =>
                navigateAndLog(
                  'RecoverySecurityQuestions',
                  'select_security_questions_for_recovery'
                )
              }
            />
            <RecoveryMethodOption
              title={t('Recovery PDF')}
              subTitle={t('Save a file for recovery')}
              icon={<RecoveryKeyIcon />}
              navigate={() =>
                navigateAndLog('RecoveryPdfDownloadScreen', 'select_pdf_for_recovery')
              }
            />
          </Column>
        </Column>
      </Column>
    </ScreenContainer>
  )
}

function RecoveryMethodOption({ icon, title, subTitle, navigate }) {
  return (
    <TouchableOpacity
      style={{
        columnGap: 16,
        padding: 16,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
      onPress={navigate}
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
  navigate: PropTypes.func.isRequired,
}

export default ChooseRecoveryMethodScreen
