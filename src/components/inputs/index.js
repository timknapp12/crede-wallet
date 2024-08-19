import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import { Pressable, TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons'
import styled from 'styled-components/native'

import { useHomeContext } from 'contexts/HomeContext'

import { size } from 'styles/constants'

import { Row } from '../containers'
import { ChevronDownIcon, ChevronUpIcon } from '../svgs'
import { PrimaryText } from '../texts'

export * from './PinInput'

const { s24 } = size

export const Label = styled.Text`
  color: ${props =>
    props.validationError
      ? props.theme.errorMain
      : props.focused
        ? props.theme.brandDefault
        : props.theme.textWeak};
  font-family: 'Lato';
  font-size: ${({ theme }) => theme.s12};
  line-height: ${({ theme }) => theme.s12};
  letter-spacing: 0.15px;
`

// Standard Input with Password able to be shown or hidden
const StyledTextInputContainer = styled.View`
  width: 100%;
  align-items: flex-end;
  flex-direction: row;
  height: ${({ theme, $height }) => $height || theme.s40};
  padding: ${({ theme }) => `0 ${theme.s8}`};
  border-radius: ${({ theme }) => theme.s8};
  align-items: ${({ $align }) => $align || 'center'};
  background-color: ${({ theme }) => theme.backgroundDefault};
  border-width: ${props => (props.focused || props.validationError ? '3px' : '1px')};
  border-color: ${props =>
    props.validationError
      ? props.theme.errorMain
      : props.focused
        ? props.theme.brandDefault
        : 'transparent'};
`

const StyledLabelContainer = styled.View`
  padding: ${({ theme }) => theme.s4};
`

const StyledInput = styled.TextInput`
  color: ${props => props.theme.textDefault};
  flex: 1;
  font-size: ${({ theme }) => theme.s16};
  font-family: 'Roboto-Regular';
`

const StyledIcon = styled(Ionicons)`
  color: ${props => props.theme.textDisabled};
`

// eslint-disable-next-line react/display-name
export const Input = React.forwardRef(
  (
    {
      focused,
      textContentType,
      label = '',
      validationError = false,
      onFocus = () => {},
      style,
      disabled,
      icon,
      height,
      align,
      ...props
    },
    ref
  ) => {
    const inputRef = useRef()

    const [secureTextEntry, setSecureTextEntry] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    useEffect(() => {
      if (focused) {
        setIsFocused(true)
      }
      return () => {
        setIsFocused(false)
      }
    }, [focused])

    useEffect(() => {
      if (textContentType === 'password') {
        setSecureTextEntry(true)
      }
    }, [textContentType])

    const onLabelTouch = () => {
      if (inputRef.current) {
        return inputRef.current.focus()
      }
      if (ref.current) {
        ref.current.focus()
      }
    }

    return (
      <TouchableOpacity style={style} activeOpacity={1} onPress={onLabelTouch}>
        <>
          {label ? (
            <StyledLabelContainer>
              <Label focused={isFocused} validationError={validationError}>
                {label}
              </Label>
            </StyledLabelContainer>
          ) : null}
          <StyledTextInputContainer
            $height={height}
            $align={align}
            focused={isFocused}
            validationError={validationError}
          >
            {icon && (
              <Row $width='auto' style={{ paddingRight: 4 }}>
                {icon}
              </Row>
            )}
            <StyledInput
              ref={ref || inputRef}
              secureTextEntry={secureTextEntry}
              onBlur={() => setIsFocused(false)}
              editable={!disabled}
              onFocus={() => {
                setIsFocused(true)
                onFocus()
              }}
              {...props}
            />
            {textContentType === 'password' ? (
              <Pressable
                testID='show-passord-button'
                hitSlop={8}
                onPress={() => setSecureTextEntry(state => !state)}
              >
                {secureTextEntry ? (
                  <StyledIcon size={24} name='eye' />
                ) : (
                  <StyledIcon size={24} name='eye-off' />
                )}
              </Pressable>
            ) : null}
          </StyledTextInputContainer>
        </>
      </TouchableOpacity>
    )
  }
)

Input.propTypes = {
  focused: PropTypes.bool,
  textContentType: PropTypes.string,
  validationError: PropTypes.bool,
  label: PropTypes.string,
  // onFocus prop is used in AddFolderModal.js and UploadAssetModal.js
  onFocus: PropTypes.func,
  style: PropTypes.object,
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  height: PropTypes.string,
  align: PropTypes.string,
}

// Select
const Container = styled.View`
  flex: 1;
  width: 100%;
  position: relative;
`

const SelectBox = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.backgroundDefault};
  border: 1px solid;
  border-color: ${({ theme }) => theme.textDefault};
  border-radius: 16px 4px 16px 4px;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.s8};
`

export const SelectedItem = ({ selectedNetwork }) => {
  return (
    <Row $width='auto' $gap={s24}>
      <PrimaryText>{selectedNetwork?.name}</PrimaryText>
    </Row>
  )
}

SelectedItem.propTypes = {
  icon: PropTypes.node,
  selectedNetwork: PropTypes.object.isRequired,
  displayedInSelectBox: PropTypes.bool,
  isAllSelected: PropTypes.bool,
}

export const Select = ({ selectedNetwork, ...props }) => {
  const { isSelectOpen, onToggleNetworkDrawer } = useHomeContext()
  return (
    <Container>
      <SelectBox {...props} onPress={onToggleNetworkDrawer} $isOpen={isSelectOpen}>
        <Row $padding='0px' $justify='space-between'>
          <SelectedItem selectedNetwork={selectedNetwork} />
          {isSelectOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </Row>
      </SelectBox>
    </Container>
  )
}

Select.propTypes = {
  selectedNetwork: PropTypes.object,
}
