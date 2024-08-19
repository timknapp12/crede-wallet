import { useNavigation } from '@react-navigation/native'
import { useQueryClient } from '@tanstack/react-query'
import PropTypes from 'prop-types'
import { useCallback, useEffect } from 'react'
import { TouchableWithoutFeedback } from 'react-native'

import { useGetAllBalances } from 'api'

import { Column, ScreenContainer } from 'components'

import { useAppContext } from 'contexts/AppContext'
import { useHomeContext } from 'contexts/HomeContext'

import BottomTabs from './BottomTabs'
import HistoryView from './HistoryView'
import HomeView from './HomeView'
import SideNav from './HomeView/SideNav'
import NotificationsView from './NotificationsView'

const HomeScreen = () => {
  const queryClient = useQueryClient()
  const { ethPublicKey, networks } = useAppContext()
  const {
    homeView,
    widthAnim,
    opacityAnim,
    rightAnim,
    fadeOutSideNav,
    isSelectOpen,
    closeNetworkDrawer,
    onToggleNetworkDrawer,
    selectedNetwork,
    addedNetworks,
    isHideAllZeroBalances,
    updateAllTokens,
  } = useHomeContext()

  const closeMenus = () => {
    closeNetworkDrawer()
    fadeOutSideNav()
  }

  const navigation = useNavigation()

  useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        e.preventDefault()
      }),
    [navigation]
  )

  const filteredNetworks =
    selectedNetwork.name === 'All Networks'
      ? addedNetworks?.filter(network => network.id !== 'all networks')
      : addedNetworks?.filter(network => selectedNetwork.name === network.name)

  const allBalancesQuery = useGetAllBalances({
    networks: networks,
    publicAddress: ethPublicKey,
  })

  const validChainIds = new Set(filteredNetworks?.map(network => network.chainId) || [])
  const allFilteredBalancesQueries = allBalancesQuery?.filter(balanceQuery =>
    validChainIds?.has(balanceQuery?.data?.chainId)
  )

  const currencyTotal = allFilteredBalancesQueries?.reduce((total, currQuery) => {
    return (total += currQuery?.data?.usdAmount || 0)
  }, 0)

  const refreshing = allBalancesQuery?.some(currQuery => {
    return currQuery?.isLoading || currQuery?.isFetching || !currQuery?.isFetched
  })

  const refetch = async () => {
    await queryClient.invalidateQueries({ queryKey: ['getBalance', ethPublicKey] })
  }

  const onRefresh = useCallback(() => {
    refetch()
  }, [])

  const updateContextAddedNetworks = () => {
    // Retrieve updated balances from the cache
    const updatedBalancesQueries = queryClient.getQueriesData([
      'getBalance',
      ethPublicKey,
    ])
    const updatedBalancesQueriesData = updatedBalancesQueries?.map(
      resultArray => resultArray?.[1]
    )

    if (isHideAllZeroBalances && !!updatedBalancesQueriesData?.length) {
      const nonZeroBalanceTokens = updatedBalancesQueriesData?.filter(
        balanceObj => balanceObj?.balance > 0
      )
      updateAllTokens({
        updatedTokens: nonZeroBalanceTokens,
        isHideAllZeroBalances: true,
      })
    }
  }

  useEffect(() => {
    if (isHideAllZeroBalances && !refreshing) {
      updateContextAddedNetworks()
    }
  }, [refreshing, isHideAllZeroBalances])

  return (
    <>
      <SideNav
        style={{
          width: widthAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '90%'],
          }),
          right: rightAnim,
        }}
        opacity={opacityAnim}
      />
      <TouchableWithoutFeedback onPress={closeMenus}>
        <ScreenContainer
          homeScreen
          footerChildren={<BottomTabs closeMenus={closeMenus} />}
          refreshing={refreshing}
          onRefresh={onRefresh}
          enableRefresh
        >
          <Column $justify='space-between' $height='100%' $padding='0px'>
            {homeView === 'home' && (
              <HomeView
                closeNetworkDrawer={closeNetworkDrawer}
                closeMenus={closeMenus}
                isSelectOpen={isSelectOpen}
                onToggle={onToggleNetworkDrawer}
                currencyTotal={currencyTotal}
                refreshing={refreshing}
              />
            )}
            {homeView === 'history' && <HistoryView />}
            {homeView === 'notifications' && <NotificationsView />}
          </Column>
        </ScreenContainer>
      </TouchableWithoutFeedback>
    </>
  )
}

HomeScreen.propTypes = {
  route: PropTypes.object,
}

export default HomeScreen
