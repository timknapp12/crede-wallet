/* eslint-disable no-undef */
import appCheck from '@react-native-firebase/app-check'
import auth from '@react-native-firebase/auth'
import Constants from 'expo-constants'

const ANDROID_DEBUG_TOKEN = Constants.expoConfig.extra.appCheckAndroidDebugToken
const IOS_DEBUG_TOKEN = Constants.expoConfig.extra.appCheckIosDebugToken

async function fetchAppCheckToken() {
  const provider = appCheck().newReactNativeFirebaseAppCheckProvider()
  const environment = Constants.expoConfig.extra.env
  await provider.configure({
    apple: {
      provider: environment !== 'prod' ? 'debug' : 'appAttestWithDeviceCheckFallback',
      debugToken: environment !== 'prod' ? IOS_DEBUG_TOKEN : undefined,
    },
    android: {
      provider: environment !== 'prod' ? 'debug' : 'playIntegrity',
      debugToken: environment !== 'prod' ? ANDROID_DEBUG_TOKEN : undefined,
    },
  })
  await appCheck().initializeAppCheck({ provider, isTokenAutoRefreshEnabled: false })
  const appCheckToken = await appCheck().getToken(/* forceRefresh */ true)

  return appCheckToken
}

const BASE_URL = Constants.expoConfig.extra.uri

export async function apiRequest({ url, method = 'GET', body }) {
  const authToken = await auth().currentUser.getIdToken()
  const { token } = await fetchAppCheckToken()

  return fetch(`${BASE_URL}/${url}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'X-Firebase-AppCheck': token,
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
    ...(body && { body: JSON.stringify(body || {}) }),
  }).then(async response => {
    if (response.status === 401 || response.status === 403) {
      // await logOut();
    }
    if (!response.ok) {
      const responseObject = await response.json()
      throw new Error(responseObject?.message)
    }
    return await response.json()
  })
}

export async function externalApiRequest({ url, method = 'GET', body }) {
  return fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(body && { body: JSON.stringify(body || {}) }),
  }).then(async response => {
    if (!response.ok) {
      const responseObject = await response.json()
      throw new Error(responseObject?.message)
    }
    if (method === 'GET') {
      return await response.json()
    } else {
      return response
    }
  })
}
