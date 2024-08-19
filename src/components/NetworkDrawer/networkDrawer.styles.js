import PropTypes from 'prop-types'
import { Animated, TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import { size } from 'styles/constants'

import { Row, Svg } from '../containers'
import { PrimaryText } from '../texts'

const { s24 } = size

export const Drawer = styled(Animated.View)`
  background-color: ${({ theme }) => theme.backgroundDefault};
  position: absolute;
  bottom: 0;
  width: 100%;
  align-items: flex-start;
  gap: ${({ theme }) => theme.s4};
  padding: ${({ theme }) => theme.s12};
  border-bottom-left-radius: ${({ theme }) => theme.s8};
  border-bottom-right-radius: ${({ theme }) => theme.s8};
`

export const DrawerButton = styled(TouchableOpacity)`
  width: 100%;
`

export const DrawerRow = styled(Row)`
  justify-content: flex-start;
  padding: ${({ theme }) => theme.s8};
  background-color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.selected : 'transparent'};
  border-radius: ${({ theme }) => theme.s8};
`

const SvgContainer = styled.View`
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
`

export const DrawerItem = ({ selectedNetwork, network }) => {
  const hideSvg =
    network?.name === 'All Networks' && selectedNetwork?.name !== 'All Networks'

  const dimension = network?.name === 'All Networks' ? 28 : 40
  return (
    <Row $width='auto' $gap={s24}>
      <SvgContainer>
        {hideSvg ? null : <Svg uri={network?.svg} width={dimension} height={dimension} />}
      </SvgContainer>
      <PrimaryText>{network?.name}</PrimaryText>
    </Row>
  )
}

DrawerItem.propTypes = {
  network: PropTypes.object.isRequired,
  selectedNetwork: PropTypes.object.isRequired,
}
