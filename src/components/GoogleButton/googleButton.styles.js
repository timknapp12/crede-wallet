import styled from 'styled-components'

export const StyledGoogleButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  width: 100%;
  min-height: 46px;
  background-color: ${({ theme }) => theme.googleButtonBackground};
  border-radius: ${({ theme }) => theme.s8};
  border-bottom-right-radius: ${({ theme }) => theme.s8};
`

export const ImageContainer = styled.View`
  background-color: white;
  padding: 14px;
  border-radius: 1px;
  border-color: ${({ theme }) => theme.googleButtonBackground};
  border-width: 1px;
  border-top-left-radius: ${({ theme }) => theme.s8};
  border-bottom-left-radius: ${({ theme }) => theme.s8};
`

export const GoogleImage = styled.Image`
  height: ${({ theme }) => theme.s16};
  width: ${({ theme }) => theme.s16};
`

export const TextContainer = styled.View`
  flex-direction: row;
  background-color: ${({ theme }) => theme.googleButtonBackground};
  min-height: 46px;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  border-top-right-radius: ${({ theme }) => theme.s8};
  border-bottom-right-radius: ${({ theme }) => theme.s8};
`

export const StyledGoogleText = styled.Text`
  font-family: 'Roboto';
  font-weight: 500;
  font-size: ${({ theme }) => theme.s16};
  color: ${({ theme }) => theme.googleButtonText};
`

export const Filler = styled.View`
  width: 46px;
`
