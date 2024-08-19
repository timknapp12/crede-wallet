import * as Linking from 'expo-linking'
import { StyleSheet } from 'react-native'

import { BorderlessButtonText, Column, PrimaryText, ScreenContainer } from 'components'

import { useHomeContext } from 'contexts/HomeContext'

import i18n from 'translations/config'

const { t } = i18n

const NetworkDetailsScreen = () => {
  const { selectedNetworkDetails } = useHomeContext()
  const nativeToken = selectedNetworkDetails?.tokens?.find(
    token => token?.contractAddress === 'Native'
  )
  return (
    <ScreenContainer paddingTop='10px'>
      <Column style={styles.outerColumn}>
        <Column style={styles.innerColumn}>
          <PrimaryText style={styles.headerText}>{t('Network Name')}</PrimaryText>
          <PrimaryText>{selectedNetworkDetails?.name}</PrimaryText>
        </Column>
        <Column style={styles.innerColumn}>
          <PrimaryText style={styles.headerText}>{t('Chain ID')}</PrimaryText>
          <PrimaryText>{selectedNetworkDetails?.chainId}</PrimaryText>
        </Column>
        <Column style={styles.innerColumn}>
          <PrimaryText style={styles.headerText}>{t('Native Token')}</PrimaryText>
          <PrimaryText>{nativeToken?.symbol}</PrimaryText>
        </Column>
        <Column style={styles.innerColumn}>
          <PrimaryText style={styles.headerText}>{t('Block Explorer URL')}</PrimaryText>
          <BorderlessButtonText
            onPress={() => Linking.openURL(selectedNetworkDetails?.explorerUrl)}
          >
            {selectedNetworkDetails?.explorerUrl}
          </BorderlessButtonText>
        </Column>
      </Column>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  innerColumn: {
    gap: 4,
    width: 'auto',
    alignItems: 'flex-start',
  },
  outerColumn: {
    gap: 24,
    width: '100%',
    alignItems: 'flex-start',
  },
  headerText: {
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 16,
  },
})

export default NetworkDetailsScreen
