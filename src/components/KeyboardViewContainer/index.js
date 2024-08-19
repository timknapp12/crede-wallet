import PropTypes from 'prop-types'
import {
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  useColorScheme,
} from 'react-native'

import { useAppContext } from 'contexts/AppContext'

export const KeyboardViewContainer = ({ children, style = {}, iosOffset = 0 }) => {
  const { colorTheme, theme } = useAppContext()
  const deviceColorScheme = useColorScheme()

  return (
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
      style={{ ...styles.image, backgroundColor: theme.backgroundDefault }}
    >
      <KeyboardAvoidingView
        behavior='padding'
        style={{
          ...styles.container,
          ...style,
        }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? iosOffset : null}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {children}
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
})

KeyboardViewContainer.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
  iosOffset: PropTypes.number,
}
