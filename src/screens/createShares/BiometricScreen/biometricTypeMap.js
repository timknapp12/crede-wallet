import { EyeIcon, FaceIDIcon, FingerprintIDIcon } from 'components'

const iosFingerPrintUrl =
  'https://support.apple.com/en-us/102528#:~:text=Tap%20Settings%20%3E%20Touch%20ID%20%26%20Passcode,can%20begin%20recognizing%20your%20fingerprint.'
const googleFingerPrintUrl = 'https://support.google.com/pixelphone/answer/6300638?hl=en'

export const getBiometricTypeMap = (Platform, type) => {
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
      sideNavButtonTitle: 'Manage Fingerprint ID',
      materialIconName: 'fingerprint',
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
      sideNavButtonTitle: 'Manage Face ID',
      materialIconName: 'face-recognition',
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
      sideNavButtonTitle: 'Manage Iris ID',
      materialIconName: 'eye-outline',
    },
  }
  return typeMap[type]
}
