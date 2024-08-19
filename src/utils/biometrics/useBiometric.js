import * as LocalAuthentication from 'expo-local-authentication'
import { useEffect, useState } from 'react'

const useBiometric = (onSuccess = () => {}, promptMessage) => {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false)
  const [isBiometricEnrolled, setIsBiometricEnrolled] = useState(false)
  const [biometricTypeList, setBiometricTypeList] = useState([])
  const [authWithBioErrMessage, setAuthWithBioErrMessage] = useState('')

  useEffect(() => {
    const checkIsEnrolled = async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync()
      setIsBiometricSupported(compatible)
      const enroll = await LocalAuthentication.isEnrolledAsync()
      if (enroll) {
        setIsBiometricEnrolled(true)
        const type = await LocalAuthentication.supportedAuthenticationTypesAsync()
        setBiometricTypeList(type)
      }
    }
    checkIsEnrolled()
  }, [])

  const authenticateWithBiometric = async (onSuccess, promptMessage) => {
    try {
      const biometricAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: promptMessage,
        disableDeviceFallback: false,
        cancelLabel: 'Cancel',
      })
      if (biometricAuth.success) {
        onSuccess()
      }
    } catch (error) {
      setAuthWithBioErrMessage(error || 'error')
    }
  }

  return {
    isBiometricSupported,
    isBiometricEnrolled,
    biometricTypeList,
    authWithBioErrMessage,
    authenticateWithBiometric: () => authenticateWithBiometric(onSuccess, promptMessage),
  }
}

export default useBiometric
