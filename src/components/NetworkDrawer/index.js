import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
// animations
import { Directions, Gesture, GestureDetector } from 'react-native-gesture-handler'
import Ionicons from 'react-native-vector-icons/MaterialIcons'

import { useAppContext } from 'contexts/AppContext'
import { useHomeContext } from 'contexts/HomeContext'

import i18n from 'translations/config'

import { Button } from '../Button'
import { Column, ScrollView } from '../containers'
import { Drawer, DrawerButton, DrawerItem, DrawerRow } from './networkDrawer.styles'

const { t } = i18n

export const NetworkDrawer = ({ homeScreen, ...props }) => {
  const { theme } = useAppContext()
  const {
    isSelectOpen,
    setIsSelectOpen,
    addedNetworks,
    selectedNetwork: network,
    setSelectedNetwork: setNetwork,
    networkHeightAnim,
    closeNetworkDrawer,
    selectedNetworkTokenScreen,
    setSelectedNetworkTokenScreen,
    openShowHideTokensDrawer,
    initialNetwork,
  } = useHomeContext()
  const selectedNetwork = homeScreen ? network : selectedNetworkTokenScreen
  const setSelectedNetwork = homeScreen ? setNetwork : setSelectedNetworkTokenScreen

  const handleManageNetworks = () => {
    setIsSelectOpen(false)
    openShowHideTokensDrawer(true)
  }

  const flingGesture = Gesture.Fling()
    .runOnJS(true)
    .direction(Directions.DOWN)
    .onStart(() => closeNetworkDrawer())

  const screenHeight = Dimensions.get('screen').height

  const [allNetworks, setAllNetworks] = useState([])

  useEffect(() => {
    if (!initialNetwork || !addedNetworks) return
    const allNetworks = [initialNetwork, ...addedNetworks]
    setAllNetworks(allNetworks)
  }, [initialNetwork, addedNetworks])

  if (!isSelectOpen) return null
  return (
    <GestureDetector gesture={flingGesture}>
      <Drawer
        style={{
          maxHeight: networkHeightAnim?.interpolate({
            inputRange: [0, 1],
            outputRange: [0, screenHeight * 0.6],
          }),
        }}
        {...props}
      >
        <View
          style={{
            width: '100%',
            alignItems: 'flex-end',
          }}
        >
          <Ionicons name='drag-handle' color={theme.textDefault} size={24} />
        </View>
        <ScrollView>
          {allNetworks?.map(item => (
            <DrawerButton
              key={item?.id}
              onPress={() => {
                setSelectedNetwork(item)
                closeNetworkDrawer()
              }}
            >
              <DrawerRow $isSelected={selectedNetwork?.name === item?.name}>
                <DrawerItem network={item} selectedNetwork={selectedNetwork} />
              </DrawerRow>
            </DrawerButton>
          ))}
          <Column style={styles.buttonContainer}>
            <Button onPress={handleManageNetworks}>{t('Manage Networks')}</Button>
          </Column>
        </ScrollView>
      </Drawer>
    </GestureDetector>
  )
}

NetworkDrawer.propTypes = {
  homeScreen: PropTypes.bool,
}

const styles = StyleSheet.create({
  buttonContainer: {
    paddingTop: 16,
    paddingBottom: 16,
  },
})
