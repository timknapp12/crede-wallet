import PropTypes from 'prop-types'
import React, { useRef } from 'react'
import { Animated, View } from 'react-native'

import { useAppContext } from 'contexts/AppContext'

const START_VALUE = 0.6
const END_VALUE = 0.2
const useNativeDriver = true
const isInteraction = false

export const SkeletonLoader = ({
  isLoading,
  height = 25,
  width = 150,
  flex,
  children,
}) => {
  const { theme } = useAppContext()

  const computedStyle = {
    borderRadius: 8,
    height: height,
    width: width,
    flex: flex,
  }

  const animation = useRef(new Animated.Value(START_VALUE))

  const start = () => {
    Animated.sequence([
      Animated.timing(animation.current, {
        duration: 800,
        isInteraction,
        toValue: END_VALUE,
        useNativeDriver,
      }),
      Animated.timing(animation.current, {
        duration: 800,
        isInteraction,
        toValue: START_VALUE,
        useNativeDriver,
      }),
    ]).start(e => {
      if (e.finished) {
        start()
      }
    })
  }

  React.useEffect(() => {
    start()
  }, [])

  const animationStyle = {
    backgroundColor: theme.disabledButtonBackground,
    height: '100%',
    opacity: animation.current,
    borderRadius: 8,
  }
  if (isLoading) {
    return (
      <View style={[computedStyle]}>
        <Animated.View style={animationStyle} />
      </View>
    )
  } else {
    return children
  }
}

SkeletonLoader.propTypes = {
  isLoading: PropTypes.bool,
  height: PropTypes.number,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  flex: PropTypes.number,
  children: PropTypes.node,
}
