/* eslint-disable no-undef */
// dev settings
let uri = 'https://api.dev.credewallet.com'
let appName = 'devWalletRecovery'
let slugName = 'devWalletRecovery'
let packageName = 'com.nerdUnited.devWalletRecovery'
let version = '1.0.0'
let versionCode = 1
let easProjectId = 'c5a10ce3-2dbf-4b79-9547-462d3d6be030'
let googleServicesFileIos = './firebaseConfig/dev/GoogleService-Info.plist'
let googleServicesFileAndroid = './firebaseConfig/dev/google-services.json'
let firebaseApiKey = 'AIzaSyDeHUmGLupdFs5t8j-3dgXDKNRbEzIUWYo'
let firebaseMeasurementId = 'G-Y9C2YKR6YR'
let googleWebClientId =
  '846331006567-0mhm1dr0c6645gnpq5b6b63bqbcelpps.apps.googleusercontent.com'
let dynamicLinkDomain = 'devwalletrecovery.page.link'
let env = 'dev'
let icon = './assets/matthew.png'
let androidIcon = './assets/JSONParseError.png'
let appCheckAndroidDebugToken = '17084806-BE5E-4371-94A6-60D0C61D0C4A'
let appCheckIosDebugToken = '126F4906-4772-4C9E-ACDF-00F0857B7F94'
let OTAUpdatesUrl = `https://u.expo.dev/${easProjectId}`

// staging settings
if (process.env.DEPLOY_ENVIRONMENT === 'staging') {
  uri = 'https://api.stage.credewallet.com'
  appName = 'stagingWalletRecovery'
  slugName = 'stagingWalletRecovery'
  packageName = 'com.nerdUnited.stagingWalletRecovery'
  version = '0.0.6'
  versionCode = 1
  easProjectId = 'fc955268-bf0f-40b3-9036-6d75eb94fc5b'
  googleServicesFileIos = './firebaseConfig/staging/GoogleService-Info.plist'
  googleServicesFileAndroid = './firebaseConfig/staging/google-services.json'
  firebaseApiKey = 'AIzaSyBVZmMfGCk84oNDSs-2bUJK6bLuCYGIUcY'
  firebaseMeasurementId = 'G-85K6KQSLTB'
  googleWebClientId =
    '1092144475052-0ujjo2508c9q391o6seujgkq030j4q3h.apps.googleusercontent.com'
  dynamicLinkDomain = 'stagingwalletrecovery.page.link'
  env = 'staging'
  icon = './assets/tom_karren.png'
  appCheckAndroidDebugToken = 'EC8E1FE5-29CB-40B9-882E-732ECAEDC16E'
  appCheckIosDebugToken = '305A6752-B82B-48EA-838F-0C32C4C28FA2'
  OTAUpdatesUrl = `https://u.expo.dev/${easProjectId}`
}

// Production settings
if (process.env.DEPLOY_ENVIRONMENT === 'production') {
  uri = 'https://api.credewallet.com'
  appName = 'Crede Wallet'
  slugName = 'credeWallet'
  packageName = 'com.nerdUnited.credeWallet'
  version = '0.0.7'
  versionCode = 7
  easProjectId = 'd2489269-0025-4667-91ba-2f5e875b72fa'
  googleServicesFileIos = './firebaseConfig/prod/GoogleService-Info.plist'
  googleServicesFileAndroid = './firebaseConfig/prod/google-services.json'
  firebaseApiKey = 'AIzaSyA9nG38BSjqYdxAck_wM5p_7a4jnnrg4Vo'
  firebaseMeasurementId = 'G-Z9PSL9T17Q'
  googleWebClientId =
    '235248502177-urj9ek7s8pjnksqi0imu9f43a21ag0a1.apps.googleusercontent.com'
  dynamicLinkDomain = ''
  env = 'prod'
  icon = './assets/crede.png'
  androidIcon = './assets/android.png'
  appCheckAndroidDebugToken = undefined
  appCheckIosDebugToken = undefined
  OTAUpdatesUrl = `https://u.expo.dev/${easProjectId}`
}

export default {
  expo: {
    owner: 'nerdunited',
    name: appName,
    slug: slugName,
    scheme: 'walletrecoveryapp',
    version,
    orientation: 'portrait',
    icon: icon,
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/splash-logo.png',
      resizeMode: 'contain',
      backgroundColor: '#0D0C0C',
    },
    assetBundlePatterns: ['**/*'],
    updates: {
      fallbackToCacheTimeout: 0,
      enabled: true,
      checkAutomatically: 'ON_LOAD',
      url: OTAUpdatesUrl,
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
    ios: {
      config: {
        usesNonExemptEncryption: false,
      },
      infoPlist: {
        NSUserTrackingUsageDescription:
          'We use Tracking to fix bugs and improve your experience. We will never sell your personal information or show you ads.',
      },
      supportsTablet: true,
      googleServicesFile: googleServicesFileIos,
      bundleIdentifier: packageName,
      appleTeamId: '9358A426U5',
      entitlements: {
        'com.apple.developer.applesignin': ['Default'],
      },
      privacyManifests: {
        NSPrivacyAccessedAPITypes: [
          {
            NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategorySystemBootTime',
            NSPrivacyAccessedAPITypeReasons: ['35F9.1'],
          },
          {
            NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryDiskSpace',
            NSPrivacyAccessedAPITypeReasons: ['85F4.1'],
          },
          {
            NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryFileTimestamp',
            NSPrivacyAccessedAPITypeReasons: ['DDA9.1'],
          },
          {
            NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryUserDefaults',
            NSPrivacyAccessedAPITypeReasons: ['CA92.1'],
          },
        ],
      },
    },
    locales: {
      en: './src/translations/iosPermissions/english.json',
      es: './src/translations/iosPermissions/spanish.json',
      de: './src/translations/iosPermissions/german.json',
    },
    android: {
      versionCode: versionCode,
      adaptiveIcon: {
        foregroundImage: androidIcon,
        backgroundColor: '#000000',
      },
      permissions: [
        'CAMERA',
        // 'READ_CONTACTS',
        'WRITE_EXTERNAL_STORAGE',
        'READ_EXTERNAL_STORAGE',
        'USE_BIOMETRIC',
      ],
      googleServicesFile: googleServicesFileAndroid,
      package: packageName,
      softwareKeyboardLayoutMode: 'pan',
    },
    web: {
      favicon: './assets/favicon.png',
      config: {
        firebase: {
          apiKey: firebaseApiKey,
          measurementId: firebaseMeasurementId,
        },
      },
    },
    plugins: [
      'expo-localization',
      '@react-native-firebase/app',
      '@react-native-firebase/crashlytics',
      '@react-native-firebase/auth',
      '@react-native-firebase/app-check',
      './rnf-disable-ad-id-support.plugin.js',
      ['@react-native-google-signin/google-signin'],
      [
        'expo-build-properties',
        {
          ios: {
            useFrameworks: 'static',
          },
        },
      ],
      [
        'expo-local-authentication',
        {
          faceIDPermission: `Allowing biometrics will help you increase security of your account.`,
        },
      ],
      [
        'expo-camera',
        {
          cameraPermission: `Allowing access to your camera will enable you to scan QR codes to obtain wallet addresses.`,
        },
      ],
      ['expo-secure-store'],
      [
        'expo-updates',
        {
          checkAutomatically: 'ON_LOAD',
        },
      ],
    ],
    extra: {
      uri,
      version,
      eas: {
        projectId: easProjectId,
      },
      googleWebClientId,
      dynamicLinkDomain,
      env,
      appCheckAndroidDebugToken,
      appCheckIosDebugToken,
    },
  },
}
