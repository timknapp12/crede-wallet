import * as WebBrowser from 'expo-web-browser'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'

import {
  Button,
  Column,
  ExternalLinkIcon,
  Line,
  PrimaryText,
  Row,
  ScreenContainer,
  SecondaryText,
} from 'components'

import { useAppContext } from 'contexts/AppContext'

import i18n from 'translations/config'

import { formatNumber } from 'utils/formatCurrency'
import { formatLongDate } from 'utils/formatters'

const { t } = i18n

const TransactionDetailsScreen = ({ route }) => {
  const { logEvent, theme, currentLanguage } = useAppContext()
  const transaction = route?.params?.transaction
  const networkNativeSymbol = route?.params?.networkNativeSymbol
  const txHistoryBaseUrl = route?.params?.txHistoryBaseUrl
  const txHistoryUrl = txHistoryBaseUrl + transaction?.transactionHash
  const isNativeToken = networkNativeSymbol === transaction?.token

  const openInWeb = async () => {
    await WebBrowser.openBrowserAsync(txHistoryUrl)
    logEvent('open_to_tx_hash_link')
  }

  return (
    <ScreenContainer paddingTop='8px' paddingBottom='24px'>
      <Column style={styles.containerColumn}>
        <Column style={styles.columnSection}>
          <DetailsRow
            title={t('Status')}
            value={transaction?.status === 'success' ? 'Success' : 'Failed'}
            color={transaction?.status === 'success' ? theme.success : theme.danger}
          />
          <Line />
          <DetailsRow title={t('Date')} value={formatLongDate(transaction?.date)} />
          <Line />
          <DetailsRow title={t('Tx Hash')} value={transaction?.transactionHash} />
          <Line />
          <DetailsRow title={t('Sent')} value={transaction?.token} />
          <Line />
          <DetailsRow title={t('To')} value={transaction?.to} />
          <Line />
          <DetailsRow title={t('Network')} value={transaction?.network} />
          <Line />
          <AmountDetailsRow
            title={t('Asset')}
            tokenValue={formatNumber(transaction?.value, currentLanguage)}
            symbol={transaction?.token}
          />
          <Line />
          <AmountDetailsRow
            title={t('Gas Fee')}
            tokenValue={formatNumber(transaction?.gasFeesPaid, currentLanguage)}
            symbol={networkNativeSymbol}
          />
          <Line />
          <AmountDetailsRow
            title={t('Send Total')}
            tokenValue={
              isNativeToken
                ? formatNumber(
                    Number(transaction?.value) + Number(transaction?.gasFeesPaid),
                    currentLanguage
                  )
                : formatNumber(transaction?.value, currentLanguage)
            }
            symbol={transaction?.token}
            color={theme.danger}
          />
        </Column>
        <Column style={{ gap: 16 }}>
          <Button endIcon={<ExternalLinkIcon />} onPress={openInWeb}>
            {t('View on Block Explorer')}
          </Button>
        </Column>
      </Column>
    </ScreenContainer>
  )
}

function DetailsRow({ title, value, color }) {
  return (
    <Row style={styles.rowContainer}>
      <SecondaryText style={{ flex: 1, fontSize: 14 }}>{title}</SecondaryText>
      <SecondaryText style={{ flex: 3, fontSize: 14, ...(color && { color }) }}>
        {value}
      </SecondaryText>
    </Row>
  )
}

function AmountDetailsRow({ title, tokenValue, symbol, color }) {
  return (
    <Row
      style={{
        ...styles.rowContainer,
        justifyContent: 'space-between',
      }}
    >
      <SecondaryText style={{ fontSize: 14 }}>{title}</SecondaryText>
      <View style={{ ...styles.viewInnerContainer, gap: 6 }}>
        <PrimaryText
          style={{
            fontSize: 14,
            fontWeight: 700,
            ...(color && { color }),
          }}
        >
          {tokenValue}
        </PrimaryText>
        <PrimaryText
          style={{
            fontSize: 14,
            fontWeight: 700,
            ...(color && { color }),
          }}
        >
          {symbol}
        </PrimaryText>
      </View>
    </Row>
  )
}

const styles = StyleSheet.create({
  containerColumn: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 32,
  },
  columnSection: {
    gap: 8,
  },
  viewInnerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  innerBottomContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  innerInnerBottomContainer: {
    gap: 4,
    alignItems: 'flex-end',
  },
  rowContainer: {
    paddingBottom: 4,
    paddingTop: 4,
    alignItems: 'flex-start',
  },
  gasError: {
    fontWeight: 400,
  },
})

TransactionDetailsScreen.propTypes = {
  route: PropTypes.object.isRequired,
}

DetailsRow.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  color: PropTypes.string,
}

AmountDetailsRow.propTypes = {
  title: PropTypes.string.isRequired,
  tokenValue: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  color: PropTypes.string,
}

export default TransactionDetailsScreen
