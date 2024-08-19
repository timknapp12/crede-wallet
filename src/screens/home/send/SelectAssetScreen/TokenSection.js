import PropTypes from 'prop-types'
import { StyleSheet, TouchableOpacity } from 'react-native'

import { useGetBalance } from 'api'

import { PrimaryText, Row, TokenCard } from 'components'

import { useAppContext } from 'contexts/AppContext'

const TokenSection = ({ network, token, onPress }) => {
  const { ethPublicKey } = useAppContext()
  const tokenBalanceQuery = useGetBalance({
    publicAddress: ethPublicKey,
    chainId: network.chainId,
    contractAddress: token.contractAddress,
  })

  const disabled =
    !tokenBalanceQuery?.data?.balance || tokenBalanceQuery?.data?.balance === 0

  return (
    <TouchableOpacity
      onPress={() => onPress(network, token)}
      style={{ opacity: disabled ? 0.25 : 1, width: '100%' }}
      key={token?.id}
      disabled={disabled}
    >
      <Row $align='center' $width='auto' style={styles.networkRow}>
        <TokenCard uri={token?.svg} />
        <PrimaryText>{token?.symbol}</PrimaryText>
      </Row>
    </TouchableOpacity>
  )
}

TokenSection.propTypes = {
  network: PropTypes.object.isRequired,
  token: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
}

export default TokenSection

const styles = StyleSheet.create({
  networkRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
})
