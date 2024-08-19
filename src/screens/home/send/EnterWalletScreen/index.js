import { useHeaderHeight } from '@react-navigation/elements'
import { ethers } from 'ethers'
import * as Clipboard from 'expo-clipboard'
import * as React from 'react'
import { Platform, StyleSheet, TextInput, View } from 'react-native'

import {
  Button,
  Column,
  KeyboardViewContainer,
  PrimaryText,
  Row,
  SecondaryText,
  Toast,
} from 'components'

import { useAppContext } from 'contexts/AppContext'
import { useSendContext } from 'contexts/SendContext'

import i18n from 'translations/config'

const { t } = i18n

const EnterWalletScreen = () => {
  const { theme, navigateAndLog, setDontBlurScreen, logEvent } = useAppContext()
  const { setWalletAddress, selectedAsset } = useSendContext()
  const [address, setAddress] = React.useState('')
  const [isAddressError, setIsAddressError] = React.useState(false)
  const headerHeight = useHeaderHeight()

  const handleConfirmAddress = () => {
    const isValid = ethers.utils.isAddress(address)
    if (isValid) {
      setWalletAddress(address)
      navigateAndLog('SendAmountScreen', 'send_nav_to_amount_screen')
    } else {
      setIsAddressError(true)
    }
  }

  const fetchCopiedText = async () => {
    const text = await Clipboard.getStringAsync()
    logEvent('paste_address_from_clipboard')
    setIsAddressError(false)
    setAddress(text)
  }

  return (
    <KeyboardViewContainer style={{ paddingTop: headerHeight }}>
      <View style={{ flex: 1 }}>
        <View style={styles.inner}>
          <Column style={{ gap: 24 }}>
            <Row $justify='space-between'>
              <PrimaryText style={{ fontWeight: 700 }}>{t('Token')}</PrimaryText>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: theme.textWeak,
                }}
              >
                <SecondaryText
                  style={{
                    fontWeight: 700,
                  }}
                >
                  {selectedAsset?.name} {selectedAsset?.symbol}
                </SecondaryText>
              </View>
            </Row>
            <Column style={{ gap: 4 }}>
              <PrimaryText style={{ fontWeight: 700, alignSelf: 'flex-start' }}>
                {t('Wallet Address')}
              </PrimaryText>
              <View
                style={{
                  ...styles.inputView,
                  borderColor: theme.textDisabled,
                  backgroundColor: theme.backgroundDefault,
                }}
              >
                <TextInput
                  value={address}
                  onChangeText={addressValue => {
                    setIsAddressError(false)
                    setAddress(addressValue)
                  }}
                  returnKeyType='default'
                  style={{
                    color: theme.textDefault,
                    width: '100%',
                  }}
                  placeholder='0xED4D...'
                  placeholderTextColor={theme.textDisabled}
                  multiline
                  numberOfLines={Platform.OS === 'ios' ? null : 2}
                  minHeight={Platform.OS === 'ios' ? 40 : null}
                  textAlignVertical='top'
                />
              </View>
              <SecondaryText style={{ fontSize: 12 }}>
                {t(
                  'Ensure that the address belongs to the same network as the asset you intend to send.'
                )}
              </SecondaryText>
            </Column>
            <Column style={{ gap: 16 }}>
              {isAddressError && (
                <Toast showToast variant='error'>
                  {t('Enter a valid public address')}
                </Toast>
              )}
              <Button onPress={fetchCopiedText}>{t('Paste From Clipboard')}</Button>
              <Button
                onPress={() => {
                  setDontBlurScreen(true)
                  navigateAndLog('ScanWalletScreen', 'send_scan_qr_code')
                }}
              >
                {t('Scan QR Code')}
              </Button>
            </Column>
          </Column>
        </View>
        <View
          style={{
            ...styles.buttonContainer,
            backgroundColor: theme.backgroundDefault,
          }}
        >
          <Button primary disabled={!address} onPress={handleConfirmAddress}>
            {t('Confirm Address')}
          </Button>
        </View>
      </View>
    </KeyboardViewContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputView: {
    borderWidth: 1,
    borderRadius: 8,
    width: '100%',
    padding: 12,
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonContainer: {
    padding: 24,
    paddingTop: 16,
  },
})

export default EnterWalletScreen
