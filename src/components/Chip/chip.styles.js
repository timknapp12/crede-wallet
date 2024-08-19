import styled from 'styled-components/native'

import { PrimaryText } from '../texts'

export const StyledChip = styled.TouchableOpacity`
  display: flex;
  padding: ${({ theme }) => theme.s4};
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  background-color: ${({ $variant, theme }) =>
    $variant === 'error' ? theme.dangerWeak : 'transparent'};
`

export const ChipText = styled(PrimaryText)`
  font-size: ${({ theme }) => theme.s14};
  font-weight: 600;
  margin-left: ${({ theme }) => theme.s8};
  margin-right: ${({ theme }) => theme.s8};
  color: ${({ $variant, theme }) =>
    $variant === 'error' ? theme.dangerStrong : theme.textDefault};
`
