import AsyncStorage from '@react-native-async-storage/async-storage'
import PropTypes from 'prop-types'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Animated } from 'react-native'

import { checkmarkDark, checkmarkLight } from 'styles/constants'

import i18n from 'translations/config'

import { useAppContext } from './AppContext'

const { t } = i18n

const HomeContext = createContext({})
export const useHomeContext = () => useContext(HomeContext)

const HomeContextProvider = ({ children }) => {
  const { theme, firebaseId, networks } = useAppContext()
  const ALL_NETWORKS_KEY = `ALL_NETWORKS_LOCAL_STORAGE${firebaseId}`
  const HIDE_ZER0_BALANCE_BOOL_KEY = `HIDE_ZER0_BALANCE_BOOL_KEY${firebaseId}`

  const [homeView, setHomeView] = useState('home')
  const initialNetwork = {
    id: 'all networks',
    name: t('All Networks'),
    svg: theme.name === 'lightTheme' ? checkmarkLight : checkmarkDark,
  }
  // used for network dropdown on home screen
  const [selectedNetwork, setSelectedNetwork] = useState(initialNetwork)
  // used for network dropdown on token screen
  const [selectedNetworkTokenScreen, setSelectedNetworkTokenScreen] =
    useState(initialNetwork)
  const [isSelectOpen, setIsSelectOpen] = useState(false)
  const [isShowHideTokensDrawerOpen, setIsShowHideTokensDrawerOpen] = useState(false)

  const [selectedNetworkDetails, setSelectedNetworkDetails] = useState(null)
  const [selectedTokenFromHome, setSelectedTokenFromHome] = useState(null)

  const [recoveryPin, setRecoveryPin] = useState('')
  const [addedNetworks, setAddedNetworks] = useState([])
  const [hiddenNetworks, setHiddenNetworks] = useState([])

  const [isHideAllZeroBalances, setIsHideAllZeroBalances] = useState(false)

  // tokens
  const [selectedToken, setSelectedToken] = useState(null)
  const [selectedNetworkForManageTokens, setSelectedNetworkForManageTokens] =
    useState(null)

  // receive tokens
  const [selectedNetworkReceiveTokens, setSelectedNetworkReceiveTokens] = useState(null)

  useEffect(() => {
    if (!networks) return
    // first time users see all networks by default, add to local storage with 'hidden: false'
    const setNetworksInLocalStorage = async () => {
      const localStorageAllNetworks = await AsyncStorage.getItem(ALL_NETWORKS_KEY)
      if (!localStorageAllNetworks) {
        // all networks default to hidden false. tokens default to false except for erc20 tokens we added hidden=true in the constants file
        const showAllNetworksListIds = networks.map(network => {
          const tokensList = network.tokens?.map(token => ({
            id: token.contractAddress,
            hidden: !!token?.hidden,
          }))
          return {
            id: network.chainId,
            ...(network?.tokens && { tokens: JSON.stringify(tokensList) }),
            hidden: false,
          }
        })
        const showAllNetworksList = networks.map(network => ({
          ...network,
          svg: network.icon[theme.name].svg,
          png: network.icon[theme.name].png,
          tokens: network.tokens?.map(token => ({
            ...token,
            svg: token.icon[theme.name].svg,
            hidden: false,
          })),
          hidden: false,
        }))
        setAddedNetworks(showAllNetworksList)
        await AsyncStorage.setItem(
          ALL_NETWORKS_KEY,
          JSON.stringify(showAllNetworksListIds)
        )
      } else {
        const parsedNetworks = JSON.parse(localStorageAllNetworks)
        const parsedNetworksWithTokens = parsedNetworks?.map(network => {
          const parsedTokens = JSON.parse(network?.tokens || '[]')
          const updatedTokens = parsedTokens?.map(token => ({
            ...token,
            id: token?.id,
          }))
          return {
            ...network,
            id: network.id,
            ...(network?.tokens && { tokens: updatedTokens }),
          }
        })
        updateNetworkState(parsedNetworksWithTokens)
      }
    }
    setNetworksInLocalStorage()
  }, [theme, networks])

  // go to local storage, update 'hidden' attribute, and reset added and hidden network lists in state
  const updateNetwork = async ({
    networkChainId,
    tokenContractAddress = undefined,
    hidden,
  }) => {
    const updatedNetworks = await updateNetworkLocalStorage(
      networkChainId,
      tokenContractAddress,
      hidden
    )
    updateNetworkState(updatedNetworks)
  }

  const updateAllTokens = async ({ updatedTokens, isHideAllZeroBalances = false }) => {
    const updatedShownTokensIds = updatedTokens?.map(
      token => `${token?.chainId}${token?.contractAddress}`
    )

    // add networks and tokens with data to state
    const networksWithData = networks?.map(network => {
      const updatedTokens = network?.tokens?.map(token => ({
        ...token,
        svg: token.icon[theme.name].svg,
        hidden: updatedShownTokensIds?.includes(
          `${network.chainId}${token.contractAddress}`
        )
          ? false
          : true,
      }))

      // if a token is being hidden, and its the only token in a network, then hide the network.
      return {
        ...network,
        svg: network.icon[theme.name].svg,
        png: network.icon[theme.name].png,
        tokens: updatedTokens,
        hidden: updatedTokens?.every(token => token?.hidden),
      }
    })

    const addedNetworks = networksWithData?.filter(network => network?.hidden === false)
    const hiddenNetworks = networksWithData?.filter(network => network?.hidden === true)
    setHiddenNetworks(hiddenNetworks)
    setAddedNetworks(addedNetworks)

    // add networks and tokens with just id's and hiddens to local storage
    const showAllNetworksListIds = networksWithData.map(network => ({
      id: network.chainId,
      ...(network?.tokens && {
        tokens: JSON.stringify(
          network?.tokens?.map(token => ({
            id: token?.contractAddress,
            hidden: token?.hidden,
          }))
        ),
      }),
      hidden: network.hidden,
    }))
    setIsHideAllZeroBalances(isHideAllZeroBalances)
    await AsyncStorage.setItem(
      HIDE_ZER0_BALANCE_BOOL_KEY,
      isHideAllZeroBalances.toString()
    )
    await AsyncStorage.setItem(ALL_NETWORKS_KEY, JSON.stringify(showAllNetworksListIds))
  }

  const updateNetworkLocalStorage = async (
    networkChainId,
    tokenContractAddress,
    hidden
  ) => {
    let localStorageAllNetworks = await AsyncStorage.getItem(ALL_NETWORKS_KEY)
    localStorageAllNetworks = JSON.parse(localStorageAllNetworks)
    const localStorageAllNetworksWithTokens = localStorageAllNetworks?.map(network => ({
      ...network,
      ...(network?.tokens && { tokens: JSON.parse(network?.tokens) }),
    }))
    // hide the token if a tokenId is passed in
    const updatedNetworks = localStorageAllNetworksWithTokens.map(network => {
      const updatedTokens = network?.tokens?.map(token => ({
        ...token,
        ...(token?.id === tokenContractAddress &&
          network.id === networkChainId && { hidden: hidden }),
      }))

      // hide a network if all tokens inside are hidden
      const isNetworkHidden = updatedTokens?.every(token => token.hidden === true)
      return {
        ...network,
        tokens: updatedTokens,
        hidden: network.id === networkChainId ? isNetworkHidden : network.hidden,
      }
    })

    // re stringify tokens for local storage
    const networksListWithIds = updatedNetworks.map(network => ({
      id: network.id,
      ...(network?.tokens && { tokens: JSON.stringify(network?.tokens) }),
      hidden: network.hidden,
    }))

    await AsyncStorage.setItem(ALL_NETWORKS_KEY, JSON.stringify(networksListWithIds))
    return updatedNetworks
  }

  const updateNetworkState = updatedNetworks => {
    const networksWithData = networks?.map(network => {
      const correspondingNetwork = updatedNetworks?.find(
        currNetwork => currNetwork?.id === network.chainId
      )
      const tokens = network?.tokens?.map(token => {
        const correspondingToken = correspondingNetwork?.tokens?.find(
          currToken => currToken.id === token.contractAddress
        )
        return {
          ...token,
          id: token.contractAddress,
          svg: token.icon[theme.name].svg,
          hidden: correspondingToken?.hidden,
        }
      })

      return {
        ...network,
        id: network.chainId,
        svg: network.icon[theme.name].svg,
        png: network.icon[theme.name].png,
        hidden: correspondingNetwork?.hidden,
        ...(correspondingNetwork?.tokens && { tokens: tokens }),
      }
    })

    const addedNetworks = networksWithData?.filter(network => network?.hidden === false)
    const hiddenNetworks = networksWithData?.filter(network => network?.hidden === true)
    setHiddenNetworks(hiddenNetworks)
    setAddedNetworks(addedNetworks)
  }

  const getIsTokenShown = (networkChainId, tokenContractAddress) => {
    let isShown = false
    addedNetworks.some(network => {
      if (network.chainId === networkChainId) {
        network.tokens.some(token => {
          if (token.contractAddress === tokenContractAddress) {
            if (!token.hidden) {
              isShown = true
            }
          }
          return false
        })
        return true
      }
      return false
    })
    return isShown
  }

  // upon opening the app, initalize in state whether hide all zero balances is toggled on
  useEffect(() => {
    const getIsHiddenAllZeroBalances = async () => {
      const isAllZeroBalances = await AsyncStorage.getItem(HIDE_ZER0_BALANCE_BOOL_KEY)
      setIsHideAllZeroBalances(isAllZeroBalances === 'true')
    }
    getIsHiddenAllZeroBalances()
  }, [])

  const updateIsHideAllZeroBalances = async value => {
    setIsHideAllZeroBalances(value)
    await AsyncStorage.setItem(HIDE_ZER0_BALANCE_BOOL_KEY, value.toString())
  }

  const widthAnim = useRef(new Animated.Value(0)).current
  const opacityAnim = useRef(new Animated.Value(0)).current
  const rightAnim = useRef(new Animated.Value(-60)).current

  const fadeInSideNav = () => {
    Animated.parallel([
      Animated.timing(widthAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
        delay: 200,
      }),
      Animated.timing(rightAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start()
  }

  const fadeOutSideNav = () => {
    Animated.parallel([
      Animated.timing(widthAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(rightAnim, {
        toValue: -60,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start()
  }

  const networkHeightAnim = useRef(new Animated.Value(0)).current
  const tokensDrawerHeightAnim = useRef(new Animated.Value(0)).current

  const openNetworkDrawer = () => {
    setIsSelectOpen(true)
    Animated.timing(networkHeightAnim, {
      toValue: 1,
      duration: 300,
      delay: 100,
      useNativeDriver: false,
    }).start()
  }

  const closeNetworkDrawer = () => {
    Animated.timing(networkHeightAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setIsSelectOpen(false))
  }

  const openShowHideTokensDrawer = () => {
    setIsShowHideTokensDrawerOpen(true)
    Animated.timing(tokensDrawerHeightAnim, {
      toValue: 1,
      duration: 300,
      delay: 100,
      useNativeDriver: false,
    }).start()
  }

  const closeShowHideTokensDrawer = () => {
    Animated.timing(tokensDrawerHeightAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setIsShowHideTokensDrawerOpen(false))
  }

  const onToggleNetworkDrawer = () =>
    isSelectOpen ? closeNetworkDrawer() : openNetworkDrawer()

  const onToggleShowHideTokensDrawer = () =>
    isShowHideTokensDrawerOpen ? closeShowHideTokensDrawer() : openShowHideTokensDrawer()

  return (
    <HomeContext.Provider
      value={{
        networks,
        homeView,
        setHomeView,
        initialNetwork,
        selectedNetwork,
        setSelectedNetwork,
        selectedTokenFromHome,
        setSelectedTokenFromHome,
        fadeInSideNav,
        fadeOutSideNav,
        widthAnim,
        opacityAnim,
        rightAnim,
        selectedNetworkDetails,
        setSelectedNetworkDetails,
        updateNetwork,
        addedNetworks,
        hiddenNetworks,
        recoveryPin,
        setRecoveryPin,
        selectedToken,
        setSelectedToken,
        selectedNetworkForManageTokens,
        setSelectedNetworkForManageTokens,
        selectedNetworkReceiveTokens,
        setSelectedNetworkReceiveTokens,
        isSelectOpen,
        setIsSelectOpen,
        networkHeightAnim,
        openNetworkDrawer,
        closeNetworkDrawer,
        onToggleNetworkDrawer,
        selectedNetworkTokenScreen,
        setSelectedNetworkTokenScreen,
        onToggleShowHideTokensDrawer,
        openShowHideTokensDrawer,
        closeShowHideTokensDrawer,
        isShowHideTokensDrawerOpen,
        setIsShowHideTokensDrawerOpen,
        tokensDrawerHeightAnim,
        getIsTokenShown,
        updateAllTokens,
        isHideAllZeroBalances,
        updateIsHideAllZeroBalances,
      }}
    >
      {children}
    </HomeContext.Provider>
  )
}

HomeContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default HomeContextProvider
