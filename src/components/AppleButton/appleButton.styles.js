import styled from 'styled-components'

export const LoadingAppleButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  width: 100%;
  min-height: 46px;
  background-color: #ffffff;
  border-radius: ${({ theme }) => theme.s8};
`
