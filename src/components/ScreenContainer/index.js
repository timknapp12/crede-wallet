import { useHeaderHeight } from '@react-navigation/elements'
import PropTypes from 'prop-types'
import { ImageBackground, RefreshControl, StyleSheet, useColorScheme } from 'react-native'

import { useAppContext } from 'contexts/AppContext'

import { NetworkDrawer } from '../NetworkDrawer'
import { ShowHideTokensDrawer } from '../ShowHideTokensDrawer'
import { ScrollView } from '../containers'
import { FooterContainer, InnerContainer, StyledView } from './screenContainer.styles'

export const ScreenContainer = ({
  children,
  footerChildren,
  padding,
  paddingTop,
  paddingBottom,
  homeScreen = false,
  transparentFooterBackground = false,
  refreshing = false,
  onRefresh = () => {},
  enableRefresh = false,
  ...props
}) => {
  const headerHeight = useHeaderHeight()
  const { colorTheme } = useAppContext()
  const deviceColorScheme = useColorScheme()

  return (
    <StyledView {...props}>
      <ImageBackground
        source={
          colorTheme === 'device'
            ? deviceColorScheme === 'light'
              ? require('../../../assets/background-light.png')
              : require('../../../assets/background-dark.png')
            : colorTheme === 'light'
              ? require('../../../assets/background-light.png')
              : require('../../../assets/background-dark.png')
        }
        style={styles.image}
      >
        <ScrollView
          $headerHeight={headerHeight}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps={'always'}
          refreshControl={
            enableRefresh && (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                progressViewOffset={40}
              />
            )
          }
        >
          <InnerContainer
            $padding={padding}
            $paddingTop={paddingTop}
            $paddingBottom={paddingBottom}
          >
            {children}
          </InnerContainer>
        </ScrollView>
        {footerChildren && (
          <FooterContainer $transparentFooterBackground={transparentFooterBackground}>
            {footerChildren}
          </FooterContainer>
        )}
        <NetworkDrawer homeScreen={homeScreen} />
        <ShowHideTokensDrawer />
      </ImageBackground>
    </StyledView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#000000a0',
  },
})

ScreenContainer.propTypes = {
  children: PropTypes.node.isRequired,
  footerChildren: PropTypes.node,
  padding: PropTypes.string,
  paddingTop: PropTypes.string,
  paddingBottom: PropTypes.string,
  homeScreen: PropTypes.bool,
  transparentFooterBackground: PropTypes.bool,
  refreshing: PropTypes.bool,
  onRefresh: PropTypes.func,
  enableRefresh: PropTypes.bool,
}
