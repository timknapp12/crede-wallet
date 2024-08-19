import { useNavigation } from '@react-navigation/native'
import { BigNumber, ethers } from 'ethers'
import PropTypes from 'prop-types'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import { useGetBalance } from 'api'

import {
  Column,
  DecreaseIcon,
  IncreaseIcon,
  PrimaryText,
  Row,
  SkeletonLoader,
  TokenCard,
} from 'components'

import { useAppContext } from 'contexts/AppContext'
import { useHomeContext } from 'contexts/HomeContext'

import { size } from 'styles/constants'

import formatCurrency, { formatNumber } from 'utils/formatCurrency'

import {
  PercRow,
  PrimaryTextBold,
  PrimaryTextPerc,
  UnderlineButton,
  UnderlineText,
} from '../homeScreen.styles'

const { s4, s8, s16 } = size

const NetworkSection = ({ network, closeMenus, ...props }) => {
  const { setSelectedNetworkDetails, setSelectedTokenFromHome } = useHomeContext()

  const navigation = useNavigation()

  const onSelectNetwork = () => {
    navigation.navigate('NetworkDetailsScreen', {
      title: network?.name,
      icon: network?.svg,
    })
    setSelectedNetworkDetails(network)
  }

  const onSelectToken = token => {
    navigation.navigate('HomeTokenBalanceScreen', {
      title: token?.name,
      icon: token?.svg,
    })
    setSelectedTokenFromHome(token)
    setSelectedNetworkDetails(network)
    closeMenus()
  }

  return (
    <>
      <Column $align='flex-start' {...props} $gap={s16}>
        <UnderlineButton onPress={onSelectNetwork}>
          <UnderlineText>{network?.name}</UnderlineText>
        </UnderlineButton>
        {network?.tokens?.map(
          token =>
            !token?.hidden && (
              <TokenSection
                key={token.contractAddress}
                token={token}
                onSelectToken={onSelectToken}
                network={network}
              />
            )
        )}
      </Column>
    </>
  )
}

function TokenSection({ token, onSelectToken, network }) {
  const { ethPublicKey, currentLanguage, currentCurrency } = useAppContext()
  const tokenBalanceQuery = useGetBalance({
    publicAddress: ethPublicKey,
    chainId: network.chainId,
    contractAddress: token.contractAddress,
  })

  const tokenBalanceInWei =
    tokenBalanceQuery?.data?.balance?.toString() || BigNumber.from('0000000000000000000')
  const tokenBalance = ethers.utils.formatUnits(tokenBalanceInWei, token?.decimals)

  const currencyBalance = tokenBalanceQuery?.data?.usdAmount || 0

  const percentage = tokenBalanceQuery?.data?.price?.percentChange24h
  const isIncreased = percentage > 0

  return (
    <TouchableOpacity style={styles.container} onPress={() => onSelectToken(token)}>
      <Row $justify='space-between'>
        <Row $width='auto' $justify='flex-start' $align='center' $gap={s8}>
          <TokenCard uri={token?.svg} />
          <Column $gap={s4} $width='auto' $align='flex-start'>
            <PrimaryTextBold>{token?.symbol}</PrimaryTextBold>
            {percentage ? (
              <PercRow $isIncreased={isIncreased}>
                {isIncreased ? <IncreaseIcon /> : <DecreaseIcon />}
                <PrimaryTextPerc $isIncreased={isIncreased}>
                  {percentage?.toFixed(2)}%
                </PrimaryTextPerc>
              </PercRow>
            ) : (
              <View></View>
            )}
          </Column>
        </Row>
        <Column $gap={s4} $width='auto' $align='flex-end' style={styles.priceColumn}>
          <SkeletonLoader
            isLoading={tokenBalanceQuery?.isLoading || tokenBalanceQuery?.isFetching}
            height={16}
            width={100}
          >
            <PrimaryTextBold style={styles.priceText}>
              {formatNumber(tokenBalance, currentLanguage)}
            </PrimaryTextBold>
          </SkeletonLoader>
          <SkeletonLoader
            isLoading={tokenBalanceQuery?.isLoading || tokenBalanceQuery?.isFetching}
            height={16}
            width={100}
          >
            <PrimaryText>
              {formatCurrency(currencyBalance, currentCurrency, currentLanguage)}
            </PrimaryText>
          </SkeletonLoader>
        </Column>
      </Row>
    </TouchableOpacity>
  )
}

TokenSection.propTypes = {
  token: PropTypes.object.isRequired,
  network: PropTypes.object.isRequired,
  onSelectToken: PropTypes.func.isRequired,
}

NetworkSection.propTypes = {
  network: PropTypes.object.isRequired,
  closeMenus: PropTypes.func.isRequired,
}

export default NetworkSection

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  networkButton: {
    padding: 4,
  },
  priceColumn: {
    flex: 1,
  },
  priceText: {
    flexWrap: 'wrap',
    textAlign: 'right',
  },
})
