import styled from 'styled-components/native'

import { Input } from 'components/inputs'

export const MnemonicContainer = styled.View`
  width: 100%;
  background-color: ${({ theme }) => theme.backgroundDefault};
  border-radius: ${({ theme }) => theme.s8};
  padding: ${({ theme }) => theme.s8};
`

export const MnemonicInput = styled(Input)`
  flex: 1;
`

export const AdvancedButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`
