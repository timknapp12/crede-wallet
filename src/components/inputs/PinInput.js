import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  Animated as Animatable,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

// used code from this repo, see for docs: https://github.com/xamous/react-native-smooth-pincode-input

const styles = StyleSheet.create({
  containerDefault: {},
  cellDefault: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
  },
  cellFocusedDefault: {
    borderWidth: 2,
  },
  textStyleDefault: {
    color: 'gray',
    fontSize: 24,
  },
  textStyleFocusedDefault: {
    color: 'black',
  },
})

class SmoothPinCodeInputClass extends Component {
  state = {
    maskDelay: false,
    focused: false,
  }
  ref = React.createRef()
  inputRef = React.createRef()

  componentDidMount() {
    if (Platform.OS === 'android' && this.props.autoFocus) {
      setTimeout(() => {
        if (this.inputRef.current) {
          this.inputRef.current.blur()
          this.inputRef.current.focus()
        }
      }, 100)
    }
  }

  animate = ({ animation = 'shake', duration = 650 }) => {
    if (!this.props.animated) {
      return new Promise((resolve, reject) =>
        reject(new Error('Animations are disabled'))
      )
    }
    return this.ref.current[animation](duration)
  }

  shake = () => this.animate({ animation: 'shake' })

  focus = () => {
    return this.inputRef.current.focus()
  }

  blur = () => {
    return this.inputRef.current.blur()
  }

  clear = () => {
    return this.inputRef.current.clear()
  }

  _inputCode = code => {
    const { password, codeLength = 4, onTextChange, onFulfill } = this.props

    if (this.props.restrictToNumbers) {
      code = (code.match(/[0-9]/g) || []).join('')
    }

    if (onTextChange) {
      onTextChange(code)
    }
    if (code.length === codeLength && onFulfill) {
      onFulfill(code)
    }

    // handle password mask
    const maskDelay = password && code.length > this.props.value.length // only when input new char
    this.setState({ maskDelay })

    if (maskDelay) {
      // mask password after delay
      clearTimeout(this.maskTimeout)
      this.maskTimeout = setTimeout(() => {
        this.setState({ maskDelay: false })
      }, this.props.maskDelay)
    }
  }

  _keyPress = event => {
    if (event.nativeEvent.key === 'Backspace') {
      const { value, onBackspace } = this.props
      if (value === '' && onBackspace) {
        onBackspace()
      }
    }
  }

  _onFocused = () => {
    this.setState({ focused: true })
    if (typeof this.props.onFocus === 'function') {
      this.props.onFocus()
    }
  }

  _onBlurred = () => {
    this.setState({ focused: false })
    if (typeof this.props.onBlur === 'function') {
      this.props.onBlur()
    }
  }

  componentWillUnmount() {
    clearTimeout(this.maskTimeout)
  }

  render() {
    const {
      value,
      codeLength,
      cellSize,
      placeholder,
      password,
      mask,
      autoFocus,
      containerStyle,
      cellStyleFilled,
      textStyleFocused,
      keyboardType,
      animationFocused,
      animated,
      testID,
      editable,
      inputProps,
      disableFullscreenUI,
      theme,
    } = this.props
    const { maskDelay, focused } = this.state
    return (
      <Animatable.View
        ref={this.ref}
        style={[
          {
            alignItems: 'stretch',
            flexDirection: 'row',
            justifyContent: 'center',
            position: 'relative',
            width: '100%',
            height: cellSize,
          },
          containerStyle,
        ]}
      >
        <View
          style={{
            position: 'absolute',
            width: '100%',
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            gap: 8,
          }}
        >
          {Array.apply(null, Array(codeLength)).map((_, idx) => {
            const cellFocused = focused && idx === value.length
            const filled = idx < value.length
            const last = idx === value.length - 1
            const showMask = filled && password && (!maskDelay || !last)
            const isPlaceholderText = typeof placeholder === 'string'
            const isMaskText = typeof mask === 'string'
            const pinCodeChar = value.charAt(idx)

            let cellText = null
            if (filled || placeholder !== null) {
              if (showMask && isMaskText) {
                cellText = mask
              } else if (!filled && isPlaceholderText) {
                cellText = placeholder
              } else if (pinCodeChar) {
                cellText = pinCodeChar
              }
            }

            const placeholderComponent = !isPlaceholderText ? placeholder : null
            const maskComponent = showMask && !isMaskText ? mask : null
            const isCellText = typeof cellText === 'string'

            return (
              <Animatable.View
                key={idx}
                style={[
                  {
                    flex: 1,
                    padding: 8,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 40,
                  },
                  {
                    borderColor: theme.borderDefault,
                    borderWidth: 1,
                    borderRadius: 8,
                  },
                  cellFocused
                    ? {
                        borderColor: theme.brandDefault,
                        borderWidth: 2,
                        padding: 7,
                      }
                    : {},
                  filled ? cellStyleFilled : {},
                ]}
                animation={
                  idx === value.length && focused && animated ? animationFocused : null
                }
                iterationCount='infinite'
                duration={500}
              >
                {isCellText && !maskComponent && (
                  <Text
                    style={[
                      { color: theme.textWeak, fontSize: 16 },
                      cellFocused ? textStyleFocused : {},
                    ]}
                  >
                    {cellText}
                  </Text>
                )}

                {!isCellText && !maskComponent && placeholderComponent}
                {isCellText && maskComponent}
              </Animatable.View>
            )
          })}
        </View>
        <TextInput
          disableFullscreenUI={disableFullscreenUI}
          value={value}
          ref={this.inputRef}
          onChangeText={this._inputCode}
          onKeyPress={this._keyPress}
          onFocus={() => this._onFocused()}
          onBlur={() => this._onBlurred()}
          spellCheck={false}
          autoFocus={autoFocus}
          keyboardType={keyboardType}
          numberOfLines={1}
          caretHidden
          maxLength={codeLength}
          selection={{
            start: value.length,
            end: value.length,
          }}
          style={{
            flex: 1,
            opacity: 0,
            textAlign: 'center',
          }}
          testID={testID || undefined}
          editable={editable}
          {...inputProps}
        />
      </Animatable.View>
    )
  }

  static defaultProps = {
    value: '',
    codeLength: 4,
    cellSize: 48,
    cellSpacing: 4,
    placeholder: '',
    password: true,
    mask: '*',
    maskDelay: 200,
    keyboardType: 'numeric',
    autoFocus: false,
    restrictToNumbers: false,
    containerStyle: styles.containerDefault,
    cellStyle: styles.cellDefault,
    cellStyleFocused: styles.cellFocusedDefault,
    textStyle: styles.textStyleDefault,
    textStyleFocused: styles.textStyleFocusedDefault,
    animationFocused: 'pulse',
    animated: true,
    editable: true,
    inputProps: {},
    disableFullscreenUI: true,
    theme: {},
  }
}

SmoothPinCodeInputClass.propTypes = {
  value: PropTypes.string,
  codeLength: PropTypes.number,
  cellSize: PropTypes.number,
  cellSpacing: PropTypes.number,
  disableFullscreenUI: PropTypes.bool,
  placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  mask: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  maskDelay: PropTypes.number,
  password: PropTypes.bool,

  autoFocus: PropTypes.bool,

  restrictToNumbers: PropTypes.bool,

  containerStyle: PropTypes.object,

  cellStyle: PropTypes.object,
  cellStyleFocused: PropTypes.object,
  cellStyleFilled: PropTypes.object,

  textStyle: Text.propTypes.style,
  textStyleFocused: Text.propTypes.style,

  animated: PropTypes.bool,
  animationFocused: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

  onFulfill: PropTypes.func,
  onChangeText: PropTypes.func,
  onBackspace: PropTypes.func,
  onTextChange: PropTypes.func,
  testID: PropTypes.any,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  keyboardType: PropTypes.string,
  editable: PropTypes.bool,
  inputProps: PropTypes.exact(TextInput.propTypes),
  theme: PropTypes.object.isRequired,
}

export const SmoothPinCodeInput = SmoothPinCodeInputClass
