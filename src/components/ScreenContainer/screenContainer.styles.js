import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { size } from 'styles/constants'

const { s24, s32, s40, s48, s72 } = size

export const StyledView = styled.View`
  height: 100%;
  background-color: ${({ theme }) => theme.backgroundDefault};
  justify-content: space-between;
  padding-top: ${({ $headerHeight }) => $headerHeight || 0};
`

const padding = Platform.OS === 'ios' ? s24 : s32
const paddingTop = Platform.OS === 'ios' ? s48 : s72
const paddingBottom = Platform.OS === 'ios' ? s40 : s48

export const InnerContainer = styled.View`
  width: 100%;
  padding: ${({ $padding }) => $padding || padding};
  padding-top: ${({ $paddingTop }) => $paddingTop || paddingTop};
  padding-bottom: ${({ $paddingBottom }) => $paddingBottom || paddingBottom};
  align-items: center;
  flex: 1;
`

const footerPaddingBottom = Platform.OS === 'ios' ? s40 : s24
export const FooterContainer = styled.View`
  width: 100%;
  background-color: ${({ theme, $transparentFooterBackground }) =>
    $transparentFooterBackground ? 'transparent' : theme.backgroundDefault};
  display: flex;
  padding: 24px;
  padding-top: 16px;
  padding-bottom: ${footerPaddingBottom};
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;

  elevation: 2;
  shadow-opacity: 0.75;
  shadow-radius: 4px;
  shadow-color: rgba(0, 0, 0, 0.12);
  shadow-offset: 0px -2px;
`
