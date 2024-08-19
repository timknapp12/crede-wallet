import Fuse from 'fuse.js'
import PropTypes from 'prop-types'
import * as React from 'react'
import { Dimensions, TouchableOpacity, View } from 'react-native'

import { useGetAllBalances } from 'api'

import { useAppContext } from 'contexts/AppContext'
import { useHomeContext } from 'contexts/HomeContext'

import i18n from 'translations/config'

import { Switch } from '../Switch'
import { ScrollView, TokenCard } from '../containers'
import { Input } from '../inputs'
import { CloseIcon, SearchIcon } from '../svgs'
import { H3, PrimaryText } from '../texts'
import { Drawer } from './showHideTokensDrawer.styles'

const { t } = i18n

export const ShowHideTokensDrawer = ({ ...props }) => {
  const { theme, ethPublicKey } = useAppContext()
  const {
    closeShowHideTokensDrawer,
    isShowHideTokensDrawerOpen,
    tokensDrawerHeightAnim,
    networks,
    updateIsHideAllZeroBalances,
    updateAllTokens,
    isHideAllZeroBalances,
  } = useHomeContext()
  const [searchTerm, setSearchTerm] = React.useState('')

  const filteredNetworks =
    networks?.filter(network => network.id !== 'all networks') || []

  const allBalancesQuery = useGetAllBalances({
    networks: filteredNetworks,
    publicAddress: ethPublicKey,
  })

  const isAllBalancesLoading = allBalancesQuery?.some(currQuery => {
    return currQuery?.isLoading && currQuery.isFetching
  })

  const fuseOptions = {
    threshold: 0.1,
    keys: ['tokens.name', 'tokens.symbol'],
  }
  const fuse = new Fuse(filteredNetworks, fuseOptions)
  const searchedNetworksList = fuse.search(searchTerm)
  const searchedNetworkList = searchTerm
    ? searchedNetworksList?.map(item => item?.item)
    : filteredNetworks

  const screenHeight = Dimensions.get('screen').height

  const toggleHideAllZeroBalances = value => {
    if (value) {
      // get balances
      // set in state the tokens with 0's to hidden
      const nonZeroBalanceTokensQueries = allBalancesQuery?.filter(
        currQuery => currQuery?.data?.balance > 0
      )
      const nonZeroBalanceTokens = nonZeroBalanceTokensQueries?.map(query => query?.data)
      updateAllTokens({
        updatedTokens: nonZeroBalanceTokens,
        isHideAllZeroBalances: true,
      })
    } else {
      // turn off hide all zero balances, and leave current hidden and shown tokens as they are
      updateIsHideAllZeroBalances(false)
    }
  }

  const handleOnClose = () => {
    setSearchTerm('')
    closeShowHideTokensDrawer()
  }

  if (!isShowHideTokensDrawerOpen) return null
  return (
    <Drawer
      style={{
        height: tokensDrawerHeightAnim?.interpolate({
          inputRange: [0, 1],
          outputRange: [0, screenHeight * 0.9],
        }),
        display: 'flex',
        flexDirection: 'column',
        rowGap: 32,
      }}
      {...props}
    >
      <View
        style={{
          width: '100%',
          alignItems: 'center',
        }}
      >
        <H3>{t('Show/Hide Tokens')}</H3>
      </View>
      <TouchableOpacity
        onPress={handleOnClose}
        style={{ position: 'absolute', right: 24, top: 24 }}
      >
        <CloseIcon />
      </TouchableOpacity>
      <View>
        <ScrollView>
          <View
            onStartShouldSetResponder={() => true}
            style={{ rowGap: 32, paddingBottom: 200 }}
          >
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <H3>{t('Hide all zero balances')}</H3>
              <Switch
                value={isHideAllZeroBalances}
                onValueChange={value => toggleHideAllZeroBalances(value)}
                disabled={isAllBalancesLoading}
              />
            </View>
            <Input
              placeholder={t('Search your tokens...')}
              placeholderTextColor={theme.textDisabled}
              icon={<SearchIcon />}
              value={searchTerm}
              onChangeText={text => setSearchTerm(text)}
              style={{ backgroundColor: theme.neutralSurface }}
            />
            {searchedNetworkList?.map(network => (
              <NetworkRow
                key={network?.chainId}
                network={network}
                searchTerm={searchTerm}
                updateIsHideAllZeroBalances={updateIsHideAllZeroBalances}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </Drawer>
  )
}

function NetworkRow({ network, searchTerm, updateIsHideAllZeroBalances }) {
  const { theme } = useAppContext()
  const { updateNetwork, getIsTokenShown } = useHomeContext()

  const fuseOptions = {
    threshold: 0.1,
    keys: ['name', 'symbol'],
  }

  const fuse = new Fuse(network.tokens, fuseOptions)
  const searchedTokensResults = fuse.search(searchTerm)
  const searchedTokensList = searchTerm
    ? searchedTokensResults?.map(item => item?.item)
    : network.tokens

  const sortedTokens = searchedTokensList
    ?.map(token => token)
    ?.sort((a, b) => a.symbol.localeCompare(b.symbol))

  return (
    <View style={{ width: '100%', rowGap: 16 }}>
      <PrimaryText style={{ fontWeight: 700 }}>{network.name}</PrimaryText>
      <View style={{ rowGap: 24 }}>
        {sortedTokens?.map(token => {
          const isShown = getIsTokenShown(network.chainId, token.contractAddress)
          const onPress = async () => {
            await updateIsHideAllZeroBalances(false)
            await updateNetwork({
              networkChainId: network.chainId,
              tokenContractAddress: token.contractAddress,
              hidden: isShown,
            })
          }
          return (
            <TokenRow
              key={token?.contractAddress}
              token={token}
              isShown={isShown}
              onPress={onPress}
              theme={theme}
            />
          )
        })}
      </View>
    </View>
  )
}

function TokenRow({ token, onPress, isShown, theme }) {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <TokenCard uri={token?.icon[theme.name].svg} />
        <PrimaryText>{token?.symbol}</PrimaryText>
      </View>
      <Switch value={isShown} onValueChange={onPress} />
    </View>
  )
}

NetworkRow.propTypes = {
  network: PropTypes.object,
  searchTerm: PropTypes.string.isRequired,
  updateIsHideAllZeroBalances: PropTypes.func.isRequired,
}

TokenRow.propTypes = {
  token: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
  isShown: PropTypes.bool.isRequired,
  theme: PropTypes.object,
}

ShowHideTokensDrawer.propTypes = {
  homeScreen: PropTypes.bool,
}
