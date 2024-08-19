import * as WebBrowser from 'expo-web-browser'
import { useEffect, useState } from 'react'
import { Platform, TouchableOpacity } from 'react-native'

import {
  Button,
  Column,
  CredeLogo,
  EyeIcon,
  FaceIDIcon,
  FingerprintIDIcon,
  H3,
  H5Error,
  Link,
  Row,
  ScreenContainer,
  ScreenTitle,
  Switch,
} from 'components'

// hooks
import { useAppContext } from 'contexts/AppContext'

import i18n from 'translations/config'

import useBiometric from 'utils/biometrics/useBiometric'

const { t } = i18n

const BiometricScreen = () => {
  const {
    areBiometricsEnabled,
    storeAreBiometricsEnabled,
    storeDisableBiometrics,
    navigateAndLog,
    isRecoveringWallet,
    navigateToNewStackAndLog,
    firebaseId,
    logEvent,
  } = useAppContext()
  const initialState = areBiometricsEnabled || false
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(initialState)

  const { biometricTypeList, authWithBioErrMessage, authenticateWithBiometric } =
    useBiometric(() => storeAreBiometricsEnabled(firebaseId), t('Enable biometrics'))

  const iosFingerPrintUrl =
    'https://support.apple.com/en-us/102528#:~:text=Tap%20Settings%20%3E%20Touch%20ID%20%26%20Passcode,can%20begin%20recognizing%20your%20fingerprint.'
  const googleFingerPrintUrl =
    'https://support.google.com/pixelphone/answer/6300638?hl=en'
  const fingerPrintUrl = Platform.OS === 'ios' ? iosFingerPrintUrl : googleFingerPrintUrl

  const typeMap = {
    1: {
      title: 'Enable Fingerprint ID for additional security',
      method: 'Fingerprint ID',
      learn: 'Learn more about Fingerprint ID',
      continueWithout: 'Continue without Fingerprint ID',
      icon: <FingerprintIDIcon />,
      enable: 'Enable Fingerprint ID',
      url: fingerPrintUrl,
      log: 'fingerprintId',
    },
    2: {
      title: 'Enable Face ID for additional security',
      method: 'Face ID',
      learn: 'Learn more about Face ID',
      continueWithout: 'Continue without Face ID',
      icon: <FaceIDIcon />,
      enable: 'Enable Face ID',
      url: 'https://support.apple.com/en-us/102381',
      log: 'faceId',
    },
    3: {
      title: 'Enable Iris ID for additional security',
      method: 'Iris ID',
      learn: 'Learn more about Iris ID',
      continueWithout: 'Continue without Iris ID',
      icon: <EyeIcon />,
      enable: 'Enable Iris ID',
      url: 'https://www.samsung.com/ph/support/mobile-devices/what-is-iris-scanning-and-how-to-use-it-on-my-samsung-galaxy-device/',
      log: 'irisId',
    },
  }

  const type = biometricTypeList?.[0]

  const [screenData, setScreenData] = useState(typeMap['1'])

  useEffect(() => {
    if (!type) return
    const data = {
      url: typeMap[type]?.url,
      title: t(typeMap[type]?.title),
      icon: typeMap[type]?.icon,
      method: t(typeMap[type]?.method),
      learn: t(typeMap[type]?.learn),
      continueWithout: t(typeMap[type]?.continueWithout),
      enable: t(typeMap[type]?.enable),
    }
    setScreenData(data)
  }, [type])
  const { url, title, icon, method, learn, continueWithout, enable } = screenData

  const continueWithoutBiometrics = async () => {
    await storeDisableBiometrics(firebaseId)
    navigateAndLog('CreateOrImportScreen', 'disable_biometrics')
  }
  const useBiometricAndContinue = async () => {
    await authenticateWithBiometric()
    if (isRecoveringWallet) {
      navigateToNewStackAndLog('CreateSharesStack', 'SetUpPinScreen', 'nav_to_setup_pin')
      logEvent(`biometrics_option_${typeMap[type]?.log}`)
    } else {
      navigateAndLog('BiometricsEnabledScreen', 'enable_biometrics')
      logEvent(`biometrics_option_${typeMap[type]?.log}`)
    }
  }

  const onPress = () =>
    isBiometricEnabled ? useBiometricAndContinue() : setIsBiometricEnabled(true)

  const openInWeb = async () => await WebBrowser.openBrowserAsync(url)

  return (
    <ScreenContainer>
      <Column $justify='space-between' $height='100%'>
        <Column>
          <CredeLogo />
          <ScreenTitle>{title}</ScreenTitle>
        </Column>
        {authWithBioErrMessage?.length > 0 ? (
          <H5Error>{authWithBioErrMessage}</H5Error>
        ) : null}
        <Column $align='flex-start'>
          <Row $justify='space-between'>
            <Row $width='auto'>
              {icon}
              <H3>{method}</H3>
            </Row>
            <Switch
              value={isBiometricEnabled}
              onValueChange={() => setIsBiometricEnabled(prev => !prev)}
            />
          </Row>
          <TouchableOpacity onPress={openInWeb}>
            <Link>{learn}</Link>
          </TouchableOpacity>
        </Column>
        <Column>
          <Button borderless onPress={continueWithoutBiometrics}>
            {continueWithout}
          </Button>
          <Button primary onPress={onPress}>
            {isBiometricEnabled ? t('Continue') : enable}
          </Button>
        </Column>
      </Column>
    </ScreenContainer>
  )
}

export default BiometricScreen
