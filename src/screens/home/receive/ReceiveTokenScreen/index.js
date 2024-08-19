import * as Clipboard from 'expo-clipboard'
import { useState } from 'react'
import { Dimensions } from 'react-native'
import QRCode from 'react-native-qrcode-svg'

import {
  Button,
  Column,
  CopyIcon,
  PrimaryText,
  Row,
  ScreenContainer,
  Toast,
  TokenCard,
} from 'components'

// hooks
import { useAppContext } from 'contexts/AppContext'
import { useHomeContext } from 'contexts/HomeContext'

import { size } from 'styles/constants'

// utils
import i18n from 'translations/config'

const { s12, s48 } = size
const { t } = i18n
const { width } = Dimensions.get('screen')
const qrCodeWidth = width - 80

const ReceiveTokenScreen = () => {
  const { theme, navigateAndLog, logEvent } = useAppContext()
  const { selectedNetworkReceiveTokens } = useHomeContext()

  const [showToast, setShowToast] = useState(false)

  const goBack = () =>
    navigateAndLog(
      'ReceiveTokenSelectNetworkScreen',
      'nav_go_back_to_select_network_screen'
    )

  const onCopy = async () => {
    await Clipboard.setStringAsync(selectedNetworkReceiveTokens?.publicAddress)
    logEvent('copied_address_to_clipboard')
    setShowToast(true)
  }

  const copyButtonText = t('Copy {name} Address').replace(
    '{name}',
    selectedNetworkReceiveTokens?.name
  )

  return (
    <ScreenContainer paddingTop={s12}>
      <Column $align='flex-start'>
        <Row $width='auto'>
          <TokenCard uri={selectedNetworkReceiveTokens?.icon[theme.name].svg} />
          <PrimaryText>{selectedNetworkReceiveTokens?.name}</PrimaryText>
        </Row>
        <Column $gap={s48}>
          <Button onPress={goBack}>{t('Change Network')}</Button>
          <QRCode
            size={qrCodeWidth}
            value={selectedNetworkReceiveTokens?.publicAddress}
            backgroundColor={theme.backgroundDefault}
            color={theme.textDefault}
            logo={selectedNetworkReceiveTokens?.icon[theme.name].png}
            logoBackgroundColor={theme.backgroundDefault}
          />
          <Column $gap={s12}>
            <PrimaryText>{selectedNetworkReceiveTokens?.publicAddress}</PrimaryText>
            <Button
              primary
              icon={<CopyIcon color={theme.backgroundDefault} />}
              onPress={onCopy}
            >
              {copyButtonText}
            </Button>
            <Toast
              showToast={showToast}
              onClose={() => setShowToast(false)}
              variant='success'
            >
              {t(`Copied to clipboard`)}
            </Toast>
          </Column>
        </Column>
      </Column>
    </ScreenContainer>
  )
}

export default ReceiveTokenScreen
