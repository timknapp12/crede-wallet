import { Animated } from 'react-native'
import styled from 'styled-components/native'

export const Drawer = styled(Animated.View)`
  background-color: ${({ theme }) => theme.backgroundDefault};
  position: absolute;
  bottom: 0;
  width: 100%;
  align-items: flex-start;
  gap: ${({ theme }) => theme.s4};
  padding: ${({ theme }) => theme.s24};
  border-top-left-radius: ${({ theme }) => theme.s16};
  border-top-right-radius: ${({ theme }) => theme.s16};
`
