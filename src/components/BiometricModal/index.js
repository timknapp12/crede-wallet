import { useEffect } from 'react'
import { Modal, Platform, TouchableOpacity } from 'react-native'

import { useAppContext } from 'contexts/AppContext'

import i18n from 'translations/config'

import useBiometric from 'utils/biometrics/useBiometric'

import { FingerprintIcon } from '../svgs'
import { H5Error, PrimaryText } from '../texts'
import { StyledBlurView } from './biometricModal.styles'

const { t } = i18n
const BiometricModal = () => {
  const { isBiometricModalOpen, setIsBiometricModalOpen, appStateVisible } =
    useAppContext()

  const { authWithBioErrMessage, authenticateWithBiometric } = useBiometric(
    () => setIsBiometricModalOpen(false),
    t('Use biometric to unlock')
  )

  const useBiometricAndContinue = async () => {
    await authenticateWithBiometric()
  }

  useEffect(() => {
    if (isBiometricModalOpen && appStateVisible === 'active') {
      useBiometricAndContinue()
    }
  }, [isBiometricModalOpen, appStateVisible])

  return (
    <Modal transparent visible={isBiometricModalOpen} onRequestClose={() => {}}>
      <StyledBlurView intensity={20}>
        <PrimaryText>{t('Use biometric to unlock')}</PrimaryText>
        {Platform.OS === 'android' ? (
          <TouchableOpacity onPress={useBiometricAndContinue}>
            <FingerprintIcon />
          </TouchableOpacity>
        ) : null}
        {authWithBioErrMessage ? <H5Error>{authWithBioErrMessage}</H5Error> : null}
      </StyledBlurView>
    </Modal>
  )
}

export default BiometricModal
