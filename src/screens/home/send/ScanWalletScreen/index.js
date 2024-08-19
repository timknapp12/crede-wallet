import { useIsFocused } from '@react-navigation/native'
import { ethers } from 'ethers'
import { CameraView, useCameraPermissions } from 'expo-camera/next'
import * as React from 'react'
import { StyleSheet, View } from 'react-native'

import {
  Button,
  Column,
  PrimaryText,
  ScreenContainer,
  SkeletonLoader,
  Toast,
} from 'components'

import { useAppContext } from 'contexts/AppContext'
import { useSendContext } from 'contexts/SendContext'

import i18n from 'translations/config'

const { t } = i18n
const PUBLIC_ADDRESS_LENGTH = 42

const ScanWalletScreen = () => {
  const [permission, requestPermission] = useCameraPermissions()
  const { setWalletAddress } = useSendContext()
  const { navigateAndLog, setDontBlurScreen } = useAppContext()
  const isFocused = useIsFocused()
  const [isAddressError, setIsAddressError] = React.useState(false)
  // set isCodeScanned to prevent repeatedly calling the function while camera is looking at qrcode
  const [isCodeScanned, setIsCodeScanned] = React.useState(false)

  React.useEffect(() => {
    if (!permission?.granted) {
      requestPermission()
    }
  }, [])

  const onCodeScanned = scanResult => {
    setIsCodeScanned(true)
    setIsAddressError(false)
    const walletAddressString = scanResult?.data
    let substringStartIndex = walletAddressString.indexOf('0x')
    let walletAddress = walletAddressString.substring(
      substringStartIndex,
      substringStartIndex + PUBLIC_ADDRESS_LENGTH
    )
    const isValid = ethers.utils.isAddress(walletAddress)

    if (isValid) {
      setWalletAddress(walletAddress)
      setIsCodeScanned(false)
      navigateAndLog('SendAmountScreen', 'send_qr_code_scan_success')
      setDontBlurScreen(false)
    } else {
      setIsAddressError(true)
      setTimeout(() => {
        setIsCodeScanned(false)
      }, 2000)
    }
  }

  return (
    <ScreenContainer paddingTop='8px' paddingBottom='0px'>
      {!permission ? (
        <SkeletonLoader height={341} width='100%' isLoading />
      ) : !permission.granted ? (
        <Column $height='100%' $justify='center' $gap='16px'>
          <PrimaryText style={{ textAlign: 'center' }}>
            {t('Allow camera access to use the QR code scanner')}
          </PrimaryText>
          <Button onPress={() => requestPermission()}>{t('Allow Camera Access')}</Button>
        </Column>
      ) : (
        isFocused && (
          <Column style={styles.columnContainer}>
            <Column>
              <View style={styles.cameraContainer}>
                <CameraView
                  style={styles.camera}
                  facing='back'
                  onBarcodeScanned={isCodeScanned ? undefined : onCodeScanned}
                />
              </View>
              <PrimaryText style={styles.qrCodeText}>
                {t('Looking for QR Code...')}
              </PrimaryText>
            </Column>
            <View
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                rowGap: 16,
              }}
            >
              {isAddressError && (
                <Toast showToast variant='error'>
                  {t('Enter a valid public address')}
                </Toast>
              )}
              <Button
                onPress={() => {
                  navigateAndLog('EnterWalletScreen', 'send_manually_enter_address')
                  setDontBlurScreen(false)
                }}
              >
                {t('Enter Wallet Address')}
              </Button>
            </View>
          </Column>
        )
      )}
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  cameraContainer: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  camera: {
    width: '100%',
    height: 341,
  },
  permissionContainer: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    gap: 16,
  },
  columnContainer: {
    justifyContent: 'space-between',
    height: '100%',
    paddingBottom: 44,
  },
  qrCodeText: {
    fontSize: 12,
  },
})

export default ScanWalletScreen
