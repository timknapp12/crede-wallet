/* eslint-disable no-console */
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'

import i18n from 'translations/config'

import { decryptShare, encryptShare } from 'utils/api/wallet/encryption'

const { t } = i18n

const PIN_FAILED_ATTEMPTS_KEY = 'pinFailedAttempts'
const PIN_LOCKED_TIMESTAMP = 'pinLockedTimestamp'
const RECOVER_FAILED_ATTEMPTS_KEY = 'recoverFailedAttempts'
const RECOVERY_LOCKED_TIMESTAMP = 'recoveryLockedTimestamp'
const FAILED_ATTEMPTS_LIMIT = 5
const SHOW_ERROR_AFTER_NUM = 3

// store if shares are created
export const storeAreSharesCreated = async firebaseId => {
  try {
    await AsyncStorage.setItem(`areSharesCreated${firebaseId}`, 'true')
  } catch (e) {
    console.log('error in storeAreSharesCreated:', e)
  }
}

export const getAreSharesCreated = async firebaseId => {
  try {
    const value = await AsyncStorage.getItem(`areSharesCreated${firebaseId}`)
    return value === 'true'
  } catch (e) {
    console.log('error in getAreSharesCreated:', e)
  }
}

// store first encrypted share
export const storeTwoRawShares = async (key, firebaseId, shares) => {
  const sharesObj = { firstRawShare: shares[0], secondRawShare: shares[1] }
  const stringifiedValue = JSON.stringify(sharesObj, (key, value) => {
    if (Array.isArray(value)) {
      // If the value is an array, convert it to a regular array
      return value.slice()
    }
    return value
  })
  try {
    const encryptedShare = await encryptShare(stringifiedValue, key)
    await SecureStore.setItemAsync(`credePin${firebaseId}`, encryptedShare)
  } catch (e) {
    console.log('error in storeTwoRawShares:', e)
  }
}

// remove shares stored by an old pin
export const removeTwoRawShares = async firebaseId => {
  try {
    await SecureStore.deleteItemAsync(`credePin${firebaseId}`)
  } catch (error) {
    throw new Error(error)
  }
}

const getCurrentTimestamp = () => Math.floor(Date.now() / 1000) // in seconds

// Function to store timestamp in AsyncStorage
const storeTimestamp = async storageKey => {
  try {
    const timestamp = getCurrentTimestamp()
    await AsyncStorage.setItem(storageKey, timestamp.toString())
  } catch (error) {
    console.error('Error storing timestamp:', error)
  }
}

const getLockoutEndTime = async storageKey => {
  const lockoutTime = await AsyncStorage.getItem(storageKey)
  // add one hour
  const lockoutTimeMs = lockoutTime * 1000 + 60 * 60 * 1000
  // get hours and minutes
  const date = new Date(lockoutTimeMs)
  const formattedDate = date.toLocaleTimeString('en-us', {
    hour12: true,
    timeStyle: 'short',
  })

  return formattedDate
}

// Function to check if current time is within 1 hour of stored timestamp
const checkWithinOneHour = async storageKey => {
  const currentTimestamp = getCurrentTimestamp()
  const storedLockoutTimestamp = await AsyncStorage.getItem(storageKey)

  if (storedLockoutTimestamp) {
    const differenceInSeconds = currentTimestamp - Number(storedLockoutTimestamp)
    const differenceInHours = differenceInSeconds / 3600 // 3600 seconds in an hour
    if (differenceInHours <= 1) {
      const unlockTime = await getLockoutEndTime(storageKey)
      return {
        isBlocked: true,
        unlockTime,
      }
    } else {
      return {
        isBlocked: false,
        unlockTime: null,
      }
    }
  } else {
    return {
      isBlocked: false,
      unlockTime: null,
    }
  }
}

export const getTwoRawShares = async (key, firebaseId) => {
  // check if trying pin is locked
  const { isBlocked } = await checkWithinOneHour(`${PIN_LOCKED_TIMESTAMP}${firebaseId}`)

  if (!isBlocked) {
    let encryptedValue = await SecureStore.getItemAsync(`credePin${firebaseId}`)
    if (!encryptedValue) throw new Error('No pin value detected')
    let value = await decryptShare(encryptedValue, key)
    if (value) {
      // remove failed attempts
      await AsyncStorage.removeItem(`${PIN_FAILED_ATTEMPTS_KEY}${firebaseId}`)

      const result = JSON.parse(value, (key, val) => {
        if (typeof val === 'object' && !Array.isArray(val)) {
          return Object.keys(val).map(k => val[k])
        }
        return val
      })
      return result
    } else {
      // increment failed attempts counter
      let failedAttemptsStorage = await AsyncStorage.getItem(
        `${PIN_FAILED_ATTEMPTS_KEY}${firebaseId}`
      )
      let prevFailedAttempts = failedAttemptsStorage ? Number(failedAttemptsStorage) : 0
      const failedAttempts = ++prevFailedAttempts
      await AsyncStorage.setItem(
        `${PIN_FAILED_ATTEMPTS_KEY}${firebaseId}`,
        failedAttempts.toString()
      )
      if (failedAttempts >= FAILED_ATTEMPTS_LIMIT) {
        await storeTimestamp(`${PIN_LOCKED_TIMESTAMP}${firebaseId}`)
        await AsyncStorage.removeItem(`${PIN_FAILED_ATTEMPTS_KEY}${firebaseId}`)

        const unlockTime = await getLockoutEndTime(`${PIN_LOCKED_TIMESTAMP}${firebaseId}`)
        throw new Error(
          t(
            `You have entered your pin incorrectly ${FAILED_ATTEMPTS_LIMIT} times. You are locked from further attempts till ${unlockTime}.`
          )
        )
      } else {
        if (failedAttempts >= SHOW_ERROR_AFTER_NUM) {
          throw new Error(
            `You have entered your pin incorrectly ${failedAttempts} times. You have ${
              FAILED_ATTEMPTS_LIMIT - failedAttempts
            } more attempt${
              FAILED_ATTEMPTS_LIMIT - failedAttempts === 1 ? '' : 's'
            } before being locked out.`
          )
        } else {
          throw new Error(t('Incorrect pin'))
        }
      }
    }
  } else {
    const unlockTime = await getLockoutEndTime(`${PIN_LOCKED_TIMESTAMP}${firebaseId}`)
    throw new Error(
      t(
        `You have entered your pin incorrectly ${FAILED_ATTEMPTS_LIMIT} times. You are locked from further attempts till ${unlockTime}.`
      )
    )
  }
}

export const incrementFailedRecoverAttempts = async firebaseId => {
  // increment failed attempts counter
  let failedAttemptsStorage = await AsyncStorage.getItem(
    `${RECOVER_FAILED_ATTEMPTS_KEY}${firebaseId}`
  )
  let prevFailedAttempts = failedAttemptsStorage ? Number(failedAttemptsStorage) : 0
  const failedAttempts = ++prevFailedAttempts
  await AsyncStorage.setItem(
    `${RECOVER_FAILED_ATTEMPTS_KEY}${firebaseId}`,
    failedAttempts.toString()
  )
  if (failedAttempts >= FAILED_ATTEMPTS_LIMIT) {
    await storeTimestamp(`${RECOVERY_LOCKED_TIMESTAMP}${firebaseId}`)
    await AsyncStorage.removeItem(`${RECOVER_FAILED_ATTEMPTS_KEY}${firebaseId}`)

    const unlockTime = await getLockoutEndTime(
      `${RECOVERY_LOCKED_TIMESTAMP}${firebaseId}`
    )
    return t(
      `You have entered your pin incorrectly ${FAILED_ATTEMPTS_LIMIT} times. You are locked from further attempts till ${unlockTime}.`
    )
  } else {
    if (failedAttempts >= SHOW_ERROR_AFTER_NUM) {
      return `You have entered your pin incorrectly ${failedAttempts} times. You have ${
        FAILED_ATTEMPTS_LIMIT - failedAttempts
      } more attempt${
        FAILED_ATTEMPTS_LIMIT - failedAttempts === 1 ? '' : 's'
      } before being locked out.`
    } else {
      return t('Incorrect pin')
    }
  }
}

export const getIsRecoveryBlocked = async firebaseId => {
  const { isBlocked, unlockTime } = await checkWithinOneHour(
    `${RECOVERY_LOCKED_TIMESTAMP}${firebaseId}`
  )
  const errorMessage = `You have entered your pin incorrectly ${FAILED_ATTEMPTS_LIMIT} times. You are locked from further attempts till ${unlockTime}.`

  return {
    isBlocked,
    errorMessage,
  }
}

export const resetFailedRecoveryAttempts = async firebaseId => {
  await AsyncStorage.removeItem(`${PIN_FAILED_ATTEMPTS_KEY}${firebaseId}`)
  await AsyncStorage.removeItem(`${PIN_LOCKED_TIMESTAMP}${firebaseId}`)
  await AsyncStorage.removeItem(`${RECOVER_FAILED_ATTEMPTS_KEY}${firebaseId}`)
  await AsyncStorage.removeItem(`${RECOVERY_LOCKED_TIMESTAMP}${firebaseId}`)
}

// store ETH public key
export const storeEthPublicKey = async (value, firebaseId, callback) => {
  try {
    await AsyncStorage.setItem(`ethPublicKey${firebaseId}`, value)
    callback(value)
  } catch (e) {
    console.log('error in storeEthPublicKey:', e)
  }
}

export const getEthPublicKey = async firebaseId => {
  try {
    const value = await AsyncStorage.getItem(`ethPublicKey${firebaseId}`)
    if (value === undefined || value === null) {
      return ''
    } else {
      return value
    }
  } catch (e) {
    console.log('error in getEthPublicKey:', e)
  }
}
