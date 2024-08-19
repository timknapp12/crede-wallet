import PropTypes from 'prop-types'
import { useState } from 'react'
import { KeyboardAvoidingView, Modal, Platform, StyleSheet, View } from 'react-native'

import {
  Button,
  Column,
  Gap,
  H2,
  PrimaryText,
  SmoothPinCodeInput,
  Toast,
} from 'components'

import { useAppContext } from 'contexts/AppContext'

import { size } from 'styles/constants'

import i18n from 'translations/config'

import { reconstructMnemonic } from 'utils/api/wallet/cryptography'
import { getTwoRawShares } from 'utils/asyncStorage'

const { t } = i18n
const { s8, s24 } = size

const ConfirmPinModal = ({ isOpen, onClose, handleSendTransaction }) => {
  const { theme, firebaseId } = useAppContext()
  const [error, setError] = useState('')
  const [pin, setPin] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const getEthPrivateKey = async () => {
    try {
      const shares = await getTwoRawShares(pin, firebaseId)
      const { ethPrivateKey } = await reconstructMnemonic(shares)
      return ethPrivateKey
      //   return Promise.resolve()
    } catch (error) {
      setPin('')
      setError(error.message)
      return Promise.reject(error)
    }
  }

  const disabled = pin?.length !== 4

  const onContinue = async () => {
    setIsLoading(true)
    try {
      const privateKey = await getEthPrivateKey()
      await handleSendTransaction(privateKey)
    } catch (error) {
      // Error handling if necessary, already handled inside getEthPrivateKey
    } finally {
      setPin('')
      setIsLoading(false)
    }
  }

  return (
    <Modal animationType='slide' visible={isOpen} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{
          ...styles.container,
          backgroundColor: theme.backgroundMedium,
        }}
      >
        <Gap $height={s8} />
        <Column $gap='0px' $justify='space-between' style={styles.column}>
          <Column $align='flex-start' $gap='0px' $padding={s24}>
            <H2>{t('Enter pin to authorize transaction')}</H2>
            <Gap $height={s24} />
            <Column $gap='4px' $align='flex-start'>
              <PrimaryText style={styles.primaryText}>{t('Pin')}</PrimaryText>
              <SmoothPinCodeInput
                value={pin}
                onTextChange={code => {
                  setPin(code)
                  setError('')
                }}
                autoFocus
                theme={theme}
              />
            </Column>
            {error ? (
              <Toast showToast={!!error} onClose={() => setError('')} variant='error'>
                {error}
              </Toast>
            ) : null}
          </Column>
          <View
            style={{
              ...styles.buttonContainer,
              backgroundColor: theme.backgroundMedium,
            }}
          >
            <View style={styles.buttonRow}>
              <Button style={styles.button} onPress={onClose} disabled={isLoading}>
                {t('Cancel')}
              </Button>
              <Button
                style={styles.button}
                primary
                disabled={disabled}
                isLoading={isLoading}
                onPress={onContinue}
              >
                {t('Continue')}
              </Button>
            </View>
          </View>
        </Column>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  column: {
    flex: 1,
  },
  primaryText: { fontSize: 16, fontWeight: 700 },
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
  },
  buttonContainer: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 28 : 24,
    width: '100%',
    gap: 16,
  },
  button: { width: '48%' },
})

ConfirmPinModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  handleSendTransaction: PropTypes.func.isRequired,
}

export default ConfirmPinModal
