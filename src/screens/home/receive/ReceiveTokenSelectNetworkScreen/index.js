import { StyleSheet, TouchableOpacity } from 'react-native'

import { Column, H4, PrimaryText, Row, ScreenContainer, TokenCard } from 'components'

// hooks
import { useAppContext } from 'contexts/AppContext'
import { useHomeContext } from 'contexts/HomeContext'

import { size } from 'styles/constants'

// utils
import encodeAddress from 'utils/encodeAddress'

const { s24 } = size

const ReceiveTokenSelectNetworkScreen = () => {
  const { navigateAndLog, ethPublicKey, networks, theme } = useAppContext()
  const { setSelectedNetworkReceiveTokens } = useHomeContext()

  const onSelectNetwork = network => {
    setSelectedNetworkReceiveTokens(network)
    const nameWithoutSpaces = network?.name.replace(/\s+/g, '')
    navigateAndLog('ReceiveTokenScreen', `receive_token_to_${nameWithoutSpaces}`)
  }

  const reshapedNetworks = networks?.map(network =>
    network.name === 'Bitcoin'
      ? // TODO - put in BTC public address
        { ...network, publicAddress: ethPublicKey }
      : { ...network, publicAddress: ethPublicKey }
  )

  return (
    <ScreenContainer paddingTop={s24}>
      <Column>
        {reshapedNetworks.map(network => (
          <TouchableOpacity
            onPress={() => onSelectNetwork(network)}
            style={styles.fullWidth}
            key={network?.chainId}
          >
            <Row $justify='flex-start'>
              <TokenCard uri={network.icon[theme.name].svg} />
              <Column $gap='0px' $align='flex-start' $justify='center'>
                <H4>{network?.name}</H4>
                <PrimaryText>{encodeAddress(network?.publicAddress) || ''}</PrimaryText>
              </Column>
            </Row>
          </TouchableOpacity>
        ))}
      </Column>
    </ScreenContainer>
  )
}

export default ReceiveTokenSelectNetworkScreen

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
})
