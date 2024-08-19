import PropTypes from 'prop-types'
import { ScrollView as RNScrollView } from 'react-native'
import { SvgUri } from 'react-native-svg'
import styled from 'styled-components/native'

export const Column = styled.View`
  align-items: ${({ $align }) => $align || 'center'};
  justify-content: ${({ $justify }) => $justify || 'center'};
  width: ${({ $width }) => $width || '100%'};
  height: ${({ $height }) => $height || 'auto'};
  padding: ${({ $padding }) => $padding || 0};
  gap: ${({ theme, $gap }) => $gap || theme.s24};
`

export const Row = styled.View`
  flex-direction: row;
  align-items: ${({ $align }) => $align || 'center'};
  justify-content: ${({ $justify }) => $justify || 'center'};
  width: ${({ $width }) => $width || '100%'};
  height: ${({ $height }) => $height || 'auto'};
  padding: ${({ $padding }) => $padding || 0};
  gap: ${({ theme, $gap }) => $gap || theme.s8};
`

export const Gap = styled.View`
  height: ${({ $height, theme }) => $height || theme.s8};
`

const SvgContainer = styled.View`
  height: ${props => `${props.$height}px`};
  width: ${props => `${props.$width}px`};
`

export const Svg = ({ height = 40, width = 40, uri }) => (
  <SvgContainer $height={height} $width={width}>
    <SvgUri height={height} width={width} uri={uri} />
  </SvgContainer>
)
Svg.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  uri: PropTypes.string.isRequired,
}

const StyledOverlayIcon = styled.View`
  position: absolute;
  bottom: 10px;
  right: 10px;
`

const StyledTokenCard = styled.View`
  padding: ${({ theme }) => theme.s12};
  justify-content: center;
  align-items: center;
  border-radius: ${({ theme }) => theme.s16};
  height: ${({ theme }) => theme.s64};
  width: ${({ theme }) => theme.s64};
  position: relative;
`

export const TokenCard = ({ uri, overlayIcon }) => (
  <StyledTokenCard>
    <Svg uri={uri} />
    {overlayIcon && <StyledOverlayIcon>{overlayIcon}</StyledOverlayIcon>}
  </StyledTokenCard>
)
TokenCard.propTypes = {
  uri: PropTypes.string,
  overlayIcon: PropTypes.node,
}

export const Line = styled.View`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.borderDefault};
`

export const ScrollView = styled(RNScrollView)`
  width: 100%;
  margin-top: ${({ $headerHeight }) => `${$headerHeight || 0}px` || '0px'};
`
