import PropTypes from 'prop-types'
import * as React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { useAppContext } from 'contexts/AppContext'

export const Switch = ({ value, onValueChange, disabled = false }) => {
  const { theme } = useAppContext()
  const handleWidth = 20 // width of the handle
  const switchWidth = 50 // total width of the switch
  const padding = 5 // padding inside the switch
  const travelDistance = switchWidth - handleWidth - 2 * padding // maximum translation distance for the handle

  const translateX = useSharedValue(value ? travelDistance : 0)

  const handleSwitch = () => {
    const newValue = !value
    onValueChange(newValue)
  }

  React.useEffect(() => {
    // This will animate the handle whenever the `value` prop changes
    translateX.value = withTiming(value ? travelDistance : 0, {
      duration: 100, // animation duration in milliseconds
    })
  }, [value, travelDistance]) // Depend on `value` to re-run the effect when it changes

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    }
  })

  return (
    <TouchableOpacity
      onPress={disabled ? () => {} : handleSwitch}
      style={{
        ...styles.switch,
        ...{ backgroundColor: value ? theme.brandSecondary : theme.backgroundDefault },
        ...(!value && {
          borderRadius: 20,
          borderWidth: 2,
          borderColor: theme.textDefault,
        }),
        ...(disabled && {
          opacity: 0.5,
        }),
      }}
    >
      <Animated.View
        style={[
          styles.handle,
          {
            backgroundColor: value ? theme.backgroundDefault : theme.textDefault,
          },
          animatedStyle,
        ]}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  switch: {
    width: 50,
    borderRadius: 25,
    height: 30,
    padding: 2,
    justifyContent: 'center',
  },
  handle: {
    width: 26,
    height: 25,
    borderRadius: 25,
  },
})

Switch.propTypes = {
  value: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  onValueChange: PropTypes.func.isRequired,
}
