import { Animated } from 'react-native'
import styled from 'styled-components/native'

import { PrimaryText, PrimaryTextSmall, Row } from 'components'

import { size } from 'styles/constants'

const { s48 } = size

export const StyledView = styled.View`
  height: 100%;
  background-color: ${({ theme }) => theme.backgroundMedium};
`

const paddingTop = s48
const paddingBottom = s48

export const InnerContainer = styled.View`
  width: 100%;
  height: 100%;
  padding-top: ${({ $paddingTop }) => $paddingTop || paddingTop};
  padding-bottom: ${({ $paddingBottom }) => $paddingBottom || paddingBottom};
  align-items: space-between;
  justify-content: space-between;
`

// BottomTabs.js
export const TabContainer = styled.View`
  align-items: center;
  justify-content: center;
`

export const Tab = styled.TouchableOpacity`
  padding: ${({ theme, $padding }) =>
    $padding || `${theme.s24} ${theme.s32} ${theme.s24} ${theme.s32}`};
  color: ${({ $selected, theme }) =>
    $selected ? theme.brandDefault : theme.textDefault};
`

export const UnderlineButton = styled.TouchableOpacity`
  padding: ${({ theme }) => `${theme.s8} 2px`};
  flex-direction: row;
  gap: ${({ theme }) => theme.s8};
  align-items: center;
  border-bottom-color: ${({ theme, $color }) => $color || theme.borderDefault};
  border-bottom-style: solid;
  border-bottom-width: 1px;
`

export const UnderlineButtonPrimary = styled(UnderlineButton)`
  border-bottom-color: ${({ theme }) => theme.brandSecondary};
  color: ${({ theme }) => theme.brandSecondary};
`

// NetworkSection.js
export const UnderlineText = styled(PrimaryText)`
  font-weight: 700;
`

export const PrimaryTextBold = styled(PrimaryText)`
  font-weight: 700;
  line-height: ${({ theme }) => theme.s16};
`

export const PercRow = styled(Row)`
  align-items: center;
  width: auto;
  background-color: ${({ $isIncreased, theme }) =>
    $isIncreased ? theme.successWeak : theme.dangerWeak};
  border-radius: ${({ theme }) => theme.s8};
  padding: 3px;
`

export const PrimaryTextPerc = styled(PrimaryTextSmall)`
  color: ${({ $isIncreased, theme }) =>
    $isIncreased ? theme.successStrong : theme.dangerStrong};
`

// SideNav.js
export const Container = styled(Animated.View)`
  z-index: 3;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.s64} ${theme.s24}`};
  background-color: ${({ theme }) => theme.backgroundMedium};
  border-top-left-radius: ${({ theme }) => theme.s16};
  border-bottom-left-radius: ${({ theme }) => theme.s16};
  position: absolute;
  right: 0px;
`

export const InsideContainer = styled(Animated.View)`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: space-between;
`

export const NavButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: ${({ theme }) => `${theme.s8} 0`};
  gap: ${({ theme }) => theme.s4};
`
